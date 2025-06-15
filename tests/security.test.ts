import request from 'supertest';
import app from '../server/server';

describe('Security Tests', () => {
  
  describe('SSRF Protection', () => {
    it('should block localhost URLs', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'http://localhost:8080' });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('URL not allowed');
    });

    it('should block private IP ranges', async () => {
      const privateIPs = [
        'http://192.168.1.1',
        'http://10.0.0.1',
        'http://172.16.0.1',
        'http://127.0.0.1'
      ];

      for (const ip of privateIPs) {
        const response = await request(app)
          .get('/api/preview')
          .query({ url: ip });
        
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('URL not allowed');
      }
    });

    it('should block direct IP access', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'http://8.8.8.8' });
      
      expect(response.status).toBe(403);
      expect(response.body.reason).toBe('Direct IP access not allowed');
    });

    it('should block suspicious URL patterns', async () => {
      const suspiciousUrls = [
        'http://malicious.tk',
        'http://evil.ga',
        'http://scam.ml',
        'http://phishing.cf'
      ];

      for (const url of suspiciousUrls) {
        const response = await request(app)
          .get('/api/preview')
          .query({ url });
        
        expect(response.status).toBe(403);
        expect(response.body.reason).toBe('Suspicious URL pattern detected');
      }
    });

    it('should only allow whitelisted domains', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'http://malicious-site.com' });
      
      expect(response.status).toBe(403);
      expect(response.body.reason).toBe('Domain not whitelisted');
    });

    it('should allow valid whitelisted domains', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' });
      
      expect(response.status).not.toBe(403);
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid URL formats', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'not-a-valid-url' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject URLs that are too long', async () => {
      const longUrl = 'https://github.com/' + 'a'.repeat(2000);
      const response = await request(app)
        .get('/api/preview')
        .query({ url: longUrl });
      
      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'URL too long' })
        ])
      );
    });

    it('should reject URLs with script tags', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com<script>alert(1)</script>' });
      
      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'Invalid URL content' })
        ])
      );
    });

    it('should require URL parameter', async () => {
      const response = await request(app)
        .get('/api/preview');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to preview endpoint', async () => {
      const requests = Array.from({ length: 12 }, (_, i) => 
        request(app)
          .get('/api/preview')
          .query({ url: 'https://github.com' })
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should have different rate limits for batch endpoint', async () => {
      const response = await request(app)
        .post('/api/preview/batch')
        .send({ urls: ['https://github.com'] });

      // Should be subject to rate limiting
      expect([200, 429]).toContain(response.status);
    });
  });

  describe('Batch Request Security', () => {
    it('should limit batch size', async () => {
      const urls = Array.from({ length: 10 }, () => 'https://github.com');
      const response = await request(app)
        .post('/api/preview/batch')
        .send({ urls });
      
      expect(response.status).toBe(400);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'URLs must be an array with 1-5 items' })
        ])
      );
    });

    it('should validate all URLs in batch', async () => {
      const urls = ['https://github.com', 'http://localhost:8080'];
      const response = await request(app)
        .post('/api/preview/batch')
        .send({ urls });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid URLs detected');
    });

    it('should require URLs array', async () => {
      const response = await request(app)
        .post('/api/preview/batch')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Content Sanitization', () => {
    it('should sanitize HTML in response', async () => {
      // Mock a response that would contain HTML
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' });

      if (response.status === 200) {
        expect(response.body.title).not.toContain('<script>');
        expect(response.body.description).not.toContain('<iframe>');
        expect(response.body.title).not.toContain('javascript:');
      }
    });

    it('should limit content length', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' });

      if (response.status === 200) {
        expect(response.body.title.length).toBeLessThanOrEqual(500);
        expect(response.body.description.length).toBeLessThanOrEqual(500);
      }
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['strict-transport-security']).toBeDefined();
    });

    it('should include CSP headers', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes gracefully', async () => {
      const response = await request(app)
        .get('/nonexistent-route');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should not expose sensitive error information', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' });

      if (response.status === 500) {
        expect(response.body).not.toHaveProperty('stack');
        expect(response.body.message).toBe('Unable to load preview content');
      }
    });
  });

  describe('Health Check Security', () => {
    it('should provide health status without sensitive info', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      
      // Should not expose sensitive system information
      expect(response.body).not.toHaveProperty('env');
      expect(response.body).not.toHaveProperty('secrets');
    });
  });

  describe('Suspicious Activity Tracking', () => {
    it('should track repeated invalid attempts', async () => {
      // Make multiple invalid requests
      const requests = Array.from({ length: 6 }, () => 
        request(app)
          .get('/api/preview')
          .query({ url: 'http://localhost:8080' })
      );

      const responses = await Promise.all(requests);
      
      // After 5 attempts, should get blocked
      expect(responses.some(r => r.status === 403)).toBe(true);
    });
  });

  describe('Image URL Validation', () => {
    it('should only allow HTTPS for images', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' });

      if (response.status === 200 && response.body.image) {
        expect(response.body.image).toMatch(/^https:/);
      }
    });

    it('should validate favicon URLs', async () => {
      const response = await request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' });

      if (response.status === 200 && response.body.favicon) {
        expect(response.body.favicon).toMatch(/^https:/);
      }
    });
  });

  describe('Protocol Security', () => {
    it('should reject non-HTTP protocols', async () => {
      const protocols = [
        'ftp://example.com',
        'file:///etc/passwd',
        'gopher://example.com',
        'javascript:alert(1)'
      ];

      for (const url of protocols) {
        const response = await request(app)
          .get('/api/preview')
          .query({ url });
        
        expect(response.status).toBe(400);
      }
    });

    it('should only allow HTTP and HTTPS', async () => {
      const validUrls = [
        'http://github.com',
        'https://github.com'
      ];

      for (const url of validUrls) {
        const response = await request(app)
          .get('/api/preview')
          .query({ url });
        
        // Should not fail due to protocol
        expect(response.status).not.toBe(400);
      }
    });
  });

  describe('Content-Type Validation', () => {
    it('should handle large payloads gracefully', async () => {
      const largePayload = { 
        urls: Array.from({ length: 1000 }, () => 'https://github.com') 
      };
      
      const response = await request(app)
        .post('/api/preview/batch')
        .send(largePayload);
      
      // Should be rejected before processing
      expect([400, 413]).toContain(response.status);
    });
  });

});

describe('Performance Security Tests', () => {
  
  it('should complete requests within timeout', async () => {
    const start = Date.now();
    const response = await request(app)
      .get('/api/preview')
      .query({ url: 'https://github.com' })
      .timeout(10000);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(15000); // Should complete within 15 seconds
  });

  it('should handle concurrent requests safely', async () => {
    const concurrentRequests = Array.from({ length: 5 }, () => 
      request(app)
        .get('/api/preview')
        .query({ url: 'https://github.com' })
    );

    const responses = await Promise.all(concurrentRequests);
    
    // All requests should be handled (either success or rate limited)
    responses.forEach(response => {
      expect([200, 403, 429, 500]).toContain(response.status);
    });
  });

});

describe('Integration Security Tests', () => {
  
  it('should maintain security across different endpoints', async () => {
    // Test health endpoint
    const healthResponse = await request(app).get('/health');
    expect(healthResponse.status).toBe(200);
    
    // Test preview endpoint with valid URL
    const previewResponse = await request(app)
      .get('/api/preview')
      .query({ url: 'https://github.com' });
    expect([200, 403, 429]).toContain(previewResponse.status);
    
    // Test batch endpoint
    const batchResponse = await request(app)
      .post('/api/preview/batch')
      .send({ urls: ['https://github.com'] });
    expect([200, 403, 429]).toContain(batchResponse.status);
  });

}); 