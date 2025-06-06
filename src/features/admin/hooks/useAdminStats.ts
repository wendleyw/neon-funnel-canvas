import { useMemo } from 'react';
import { FrontendTemplate } from '../../../types/admin';

export interface AdminStats {
  total: number;
  sources: number;
  pages: number;
  actions: number;
  paidTraffic: number;
  organicTraffic: number;
  otherSources: number;
  salesLead: number;
  contentSocial: number;
  memberUtility: number;
  nurturing: number;
  digitalLaunch: number;
  socialContent: number;
}

export interface CategoryBreakdown {
  sources: {
    paid: number;
    organic: number;
    other: number;
  };
  pages: {
    salesLead: number;
    contentSocial: number;
    memberUtility: number;
  };
  actions: {
    nurturing: number;
    digitalLaunch: number;
    socialContent: number;
  };
}

/**
 * Custom hook to calculate admin statistics in a performant way
 * Follows best practices for memoization and clear separation of concerns
 */
export const useAdminStats = (frontendTemplates: FrontendTemplate[]): {
  stats: AdminStats;
  categoryBreakdown: CategoryBreakdown;
  hasData: boolean;
} => {
  const stats = useMemo((): AdminStats => {
    // Base type counts
    const sources = frontendTemplates.filter(i => i.type === 'source');
    const pages = frontendTemplates.filter(i => i.type === 'page');
    const actions = frontendTemplates.filter(i => i.type === 'action');

    // Helper function for category matching
    const matchesCategory = (item: FrontendTemplate, keywords: string[]): boolean => {
      if (!item.category) return false;
      return keywords.some(keyword => item.category!.includes(keyword));
    };

    // Sources subcategories with comprehensive categorization
    const paidTrafficSources = sources.filter(i => 
      matchesCategory(i, ['paid', 'ads', 'traffic-sources-paid'])
    );

    const organicTrafficSources = sources.filter(i => 
      matchesCategory(i, ['search', 'social', 'organic', 'traffic-sources-search', 'traffic-sources-social'])
    );

    const otherSourcesList = sources.filter(i => 
      matchesCategory(i, ['offline', 'crm', 'other', 'traffic-sources-offline', 'traffic-sources-crm', 'referral', 'direct'])
    );

    // Count uncategorized sources to ensure total matches
    const categorizedSources = new Set([
      ...paidTrafficSources.map(s => s.id),
      ...organicTrafficSources.map(s => s.id),
      ...otherSourcesList.map(s => s.id)
    ]);
    const uncategorizedSources = sources.filter(s => !categorizedSources.has(s.id));
    const otherSources = otherSourcesList.length + uncategorizedSources.length;

    // Pages subcategories with comprehensive categorization
    const salesLeadPages = pages.filter(i => 
      matchesCategory(i, ['lead', 'sales', 'conversion', 'capture'])
    );

    const contentSocialPages = pages.filter(i => 
      matchesCategory(i, ['engagement', 'content', 'social'])
    );

    const memberUtilityPages = pages.filter(i => 
      matchesCategory(i, ['member', 'utility', 'book'])
    );

    // Count uncategorized pages to ensure total matches
    const categorizedPages = new Set([
      ...salesLeadPages.map(p => p.id),
      ...contentSocialPages.map(p => p.id),
      ...memberUtilityPages.map(p => p.id)
    ]);
    const uncategorizedPages = pages.filter(p => !categorizedPages.has(p.id));
    const memberUtility = memberUtilityPages.length + uncategorizedPages.length;

    // Actions subcategories with comprehensive categorization
    const nurturingActions = actions.filter(i => 
      matchesCategory(i, ['nurturing', 'email', 'sequence'])
    );

    const digitalLaunchActions = actions.filter(i => 
      matchesCategory(i, ['digital-launch', 'launch', 'campaign'])
    );

    const socialContentActions = actions.filter(i => 
      matchesCategory(i, ['social', 'engagement', 'automation'])
    );

    // Count uncategorized actions to ensure total matches
    const categorizedActions = new Set([
      ...nurturingActions.map(a => a.id),
      ...digitalLaunchActions.map(a => a.id),
      ...socialContentActions.map(a => a.id)
    ]);
    const uncategorizedActions = actions.filter(a => !categorizedActions.has(a.id));
    const socialContent = socialContentActions.length + uncategorizedActions.length;

    const finalStats = {
      total: frontendTemplates.length,
      sources: sources.length,
      pages: pages.length,
      actions: actions.length,
      paidTraffic: paidTrafficSources.length,
      organicTraffic: organicTrafficSources.length,
      otherSources: otherSources,
      salesLead: salesLeadPages.length,
      contentSocial: contentSocialPages.length,
      memberUtility: memberUtility,
      nurturing: nurturingActions.length,
      digitalLaunch: digitalLaunchActions.length,
      socialContent: socialContent,
    };

    // Validation: Ensure subcategory totals match type totals
    const sourcesSubtotal = finalStats.paidTraffic + finalStats.organicTraffic + finalStats.otherSources;
    const pagesSubtotal = finalStats.salesLead + finalStats.contentSocial + finalStats.memberUtility;
    const actionsSubtotal = finalStats.nurturing + finalStats.digitalLaunch + finalStats.socialContent;

    // Log discrepancies for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      if (sourcesSubtotal !== finalStats.sources) {
        console.warn(`⚠️ Sources count mismatch: Total ${finalStats.sources}, Subtotal ${sourcesSubtotal}`);
      }
      if (pagesSubtotal !== finalStats.pages) {
        console.warn(`⚠️ Pages count mismatch: Total ${finalStats.pages}, Subtotal ${pagesSubtotal}`);
      }
      if (actionsSubtotal !== finalStats.actions) {
        console.warn(`⚠️ Actions count mismatch: Total ${finalStats.actions}, Subtotal ${actionsSubtotal}`);
      }
    }

    return finalStats;
  }, [frontendTemplates]);

  const categoryBreakdown = useMemo((): CategoryBreakdown => ({
    sources: {
      paid: stats.paidTraffic,
      organic: stats.organicTraffic,
      other: stats.otherSources,
    },
    pages: {
      salesLead: stats.salesLead,
      contentSocial: stats.contentSocial,
      memberUtility: stats.memberUtility,
    },
    actions: {
      nurturing: stats.nurturing,
      digitalLaunch: stats.digitalLaunch,
      socialContent: stats.socialContent,
    },
  }), [stats]);

  const hasData = useMemo(() => stats.total > 0, [stats.total]);

  return {
    stats,
    categoryBreakdown,
    hasData,
  };
}; 