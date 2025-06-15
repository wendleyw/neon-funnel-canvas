#!/usr/bin/env node

/**
 * 🛡️ Security Monitoring Script
 * Automated security monitoring and alerting system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  BUNDLE_SIZE_LIMIT: 512, // KB
  SECURITY_SCORE_MIN: 90,
  VULNERABILITY_LEVELS: ['moderate', 'high', 'critical'],
  LOG_RETENTION_DAYS: 30,
  MONITORING_INTERVAL: 60000 // 1 minute
};

class SecurityMonitor {
  constructor() {
    this.logFile = path.join(__dirname, '..', 'logs', 'security-monitor.log');
    this.metricsFile = path.join(__dirname, '..', 'logs', 'security-metrics.json');
    this.isRunning = false;
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      pid: process.pid
    };

    // Console output with colors
    const colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      success: '\x1b[32m',
      reset: '\x1b[0m'
    };

    console.log(
      `${colors[level] || colors.info}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`
    );

    // File logging
    try {
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  async checkDependencyVulnerabilities() {
    try {
      const result = execSync('npm audit --json', { encoding: 'utf8' });
      const auditData = JSON.parse(result);
      
      const vulnerabilities = auditData.metadata?.vulnerabilities || {};
      const totalVulns = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);

      if (totalVulns > 0) {
        this.log('warn', `Found ${totalVulns} vulnerabilities`, vulnerabilities);
        
        // Check for high/critical vulnerabilities
        const highCritical = (vulnerabilities.high || 0) + (vulnerabilities.critical || 0);
        if (highCritical > 0) {
          this.log('error', `Critical security issue: ${highCritical} high/critical vulnerabilities found`);
          return false;
        }
      } else {
        this.log('success', 'No vulnerabilities found in dependencies');
      }
      
      return true;
    } catch (error) {
      if (error.status === 1) {
        // npm audit returns status 1 when vulnerabilities are found
        try {
          const auditData = JSON.parse(error.stdout);
          const vulnerabilities = auditData.metadata?.vulnerabilities || {};
          const highCritical = (vulnerabilities.high || 0) + (vulnerabilities.critical || 0);
          
          if (highCritical > 0) {
            this.log('error', `Critical vulnerabilities found: ${highCritical}`, vulnerabilities);
            return false;
          }
        } catch (parseError) {
          this.log('error', 'Failed to parse npm audit output', { error: parseError.message });
        }
      } else {
        this.log('error', 'Failed to run dependency vulnerability check', { error: error.message });
      }
      return false;
    }
  }

  async checkBundleSize() {
    try {
      const distPath = path.join(__dirname, '..', 'dist');
      if (!fs.existsSync(distPath)) {
        this.log('info', 'Dist directory not found, skipping bundle size check');
        return true;
      }

      const result = execSync(`du -sk ${distPath}`, { encoding: 'utf8' });
      const sizeKB = parseInt(result.split('\t')[0]);

      if (sizeKB > CONFIG.BUNDLE_SIZE_LIMIT) {
        this.log('warn', `Bundle size ${sizeKB}KB exceeds limit of ${CONFIG.BUNDLE_SIZE_LIMIT}KB`);
        return false;
      } else {
        this.log('success', `Bundle size ${sizeKB}KB is within limits`);
      }

      return true;
    } catch (error) {
      this.log('error', 'Failed to check bundle size', { error: error.message });
      return false;
    }
  }

  async runSecurityTests() {
    try {
      execSync('npm run test:security', { stdio: 'inherit' });
      this.log('success', 'All security tests passed');
      return true;
    } catch (error) {
      this.log('error', 'Security tests failed', { exitCode: error.status });
      return false;
    }
  }

  async checkLogFiles() {
    try {
      const logsDir = path.join(__dirname, '..', 'logs');
      if (!fs.existsSync(logsDir)) {
        return true;
      }

      const files = fs.readdirSync(logsDir);
      const logFiles = files.filter(file => file.endsWith('.log'));
      
      for (const logFile of logFiles) {
        const filePath = path.join(logsDir, logFile);
        const stats = fs.statSync(filePath);
        const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (ageInDays > CONFIG.LOG_RETENTION_DAYS) {
          fs.unlinkSync(filePath);
          this.log('info', `Deleted old log file: ${logFile}`, { ageInDays: Math.round(ageInDays) });
        }
      }

      // Check for suspicious activity in logs
      const errorLogPath = path.join(logsDir, 'error.log');
      if (fs.existsSync(errorLogPath)) {
        const errorLog = fs.readFileSync(errorLogPath, 'utf8');
        const suspiciousPatterns = [
          /blocked.*attempts.*(\d+)/gi,
          /suspicious.*activity/gi,
          /security.*violation/gi
        ];

        for (const pattern of suspiciousPatterns) {
          const matches = errorLog.match(pattern);
          if (matches && matches.length > 5) {
            this.log('warn', `High number of security incidents detected: ${matches.length} matches for pattern`);
          }
        }
      }

      return true;
    } catch (error) {
      this.log('error', 'Failed to check log files', { error: error.message });
      return false;
    }
  }

  async updateSecurityMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      vulnerabilityCheck: await this.checkDependencyVulnerabilities(),
      bundleSizeCheck: await this.checkBundleSize(),
      securityTestsCheck: await this.runSecurityTests(),
      logMaintenanceCheck: await this.checkLogFiles(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    };

    // Calculate security score
    const checks = [
      metrics.vulnerabilityCheck,
      metrics.bundleSizeCheck,
      metrics.securityTestsCheck,
      metrics.logMaintenanceCheck
    ];
    const passedChecks = checks.filter(Boolean).length;
    metrics.securityScore = Math.round((passedChecks / checks.length) * 100);

    // Save metrics
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      this.log('error', 'Failed to save security metrics', { error: error.message });
    }

    // Alert on low security score
    if (metrics.securityScore < CONFIG.SECURITY_SCORE_MIN) {
      this.log('error', `Security score ${metrics.securityScore}% below minimum ${CONFIG.SECURITY_SCORE_MIN}%`);
    } else {
      this.log('success', `Security score: ${metrics.securityScore}%`);
    }

    return metrics;
  }

  async start() {
    if (this.isRunning) {
      this.log('warn', 'Security monitor is already running');
      return;
    }

    this.isRunning = true;
    this.log('info', 'Starting security monitor...', { interval: CONFIG.MONITORING_INTERVAL });

    // Initial check
    await this.updateSecurityMetrics();

    // Setup interval monitoring
    this.interval = setInterval(async () => {
      try {
        await this.updateSecurityMetrics();
      } catch (error) {
        this.log('error', 'Error during security monitoring cycle', { error: error.message });
      }
    }, CONFIG.MONITORING_INTERVAL);

    // Graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.log('info', 'Stopping security monitor...');
    this.isRunning = false;
    
    if (this.interval) {
      clearInterval(this.interval);
    }

    process.exit(0);
  }

  // One-time security check
  async runOnce() {
    this.log('info', 'Running one-time security check...');
    const metrics = await this.updateSecurityMetrics();
    
    if (metrics.securityScore >= CONFIG.SECURITY_SCORE_MIN) {
      this.log('success', `Security check passed with score: ${metrics.securityScore}%`);
      process.exit(0);
    } else {
      this.log('error', `Security check failed with score: ${metrics.securityScore}%`);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new SecurityMonitor();
  const command = process.argv[2];

  switch (command) {
    case 'start':
      monitor.start();
      break;
    case 'check':
      monitor.runOnce();
      break;
    default:
      console.log('Usage: node security-monitor.js [start|check]');
      console.log('  start - Start continuous monitoring');
      console.log('  check - Run one-time security check');
      process.exit(1);
  }
}

module.exports = SecurityMonitor; 