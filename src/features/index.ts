// Main Features Export
// This file provides easy access to all features in the application

// Feature Namespace Exports to avoid naming conflicts
export * as Admin from './admin';
export * as Auth from './auth';
export * as Canvas from './canvas';
export * as Editor from './editor';
export * as Sidebar from './sidebar';
export * as Templates from './templates';
export * as Workspace from './workspace';
export * as Shared from './shared';

// Admin features
export { AdminTemplatesManager } from './admin/components/AdminTemplatesManager';

// Social Media features
export { InstagramMockup } from './social-media/instagram/components/InstagramMockup';
export { InstagramMockupModal } from './social-media/instagram/components/InstagramMockupModal';

// Marketing features
export { OfferCard } from './marketing/components/OfferCard';
export { PersonaCard } from './marketing/components/PersonaCard';

// Types
export type { Offer } from './marketing/components/OfferCard';
export type { Persona } from './marketing/components/PersonaCard';
