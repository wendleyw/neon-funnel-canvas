# Product Requirements Document: Funnel Board

**Version:** 1.0
**Date:** June 1, 2025
**Product Lead:** [Seu Nome/Nome da Equipe]

## 1. Introduction & Product Vision

### 1.1. Product Name
Funnel Board

### 1.2. Brief Description
Funnel Board is a visual and intuitive web application for planning, creating, and managing marketing funnels. It allows users to build complex funnel strategies with a drag-and-drop interface, customize components, and organize their work efficiently.

### 1.3. Target Audience
* Digital Marketing Professionals
* Entrepreneurs and Small to Medium Business Owners
* Marketing Agencies
* Content Creators and Coaches

### 1.4. Problem Statement
The process of designing, visualizing, and iterating on marketing funnels is often complex, disjointed, and time-consuming. Existing tools can be clunky, lack visual clarity, or don't offer enough flexibility for modern marketing strategies. Funnel Board aims to simplify this process by providing a centralized, visual, and powerful platform.

### 1.5. Product Vision
To become the leading visual platform for marketing funnel creation, enabling users to effortlessly translate their strategic ideas into actionable and effective marketing workflows, thereby improving campaign performance and ROI.

## 2. Goals & Objectives

* **G1:** Provide a highly intuitive drag-and-drop canvas for seamless funnel construction.
* **G2:** Enable detailed customization of all funnel components and their properties.
* **G3:** Facilitate efficient organization of multiple funnels through a project and workspace system.
* **G4:** Offer a rich library of pre-built component and full-funnel templates to accelerate user workflow.
* **G5:** Allow users to export funnels for documentation, collaboration, or use with other tools.
* **G6:** Ensure reliable data persistence and user data security through Supabase integration.
* **G7:** Deliver a smooth, performant user experience, even when dealing with complex funnels.
* **G8:** Support PWA (Progressive Web App) capabilities for enhanced accessibility and potential offline features.
* **G9:** Ensure all new code is written in **English**, including **comments in English**, and adheres to modern software development best practices focusing on readability, maintainability, and performance.

## 3. Scope & Features (User Stories / Use Cases)

### 3.1. User Authentication & Profile Management
* **US1.1:** As a new user, I want to be able to create an account using my email and password so I can save my work.
* **US1.2:** As an existing user, I want to be able to log in with my email and password to access my projects.
* **US1.3:** As a logged-in user, I want to view and update my profile information (e.g., full name, company, bio).
* **US1.4:** As a logged-in user, I want to be able to log out securely.

### 3.2. Workspace & Project Management
* **US2.1:** As a user, I want to create and manage multiple workspaces to organize different clients or business areas.
* **US2.2:** As a user, I want to be able to name, describe, select, and delete workspaces.
* **US2.3:** As a user, within a workspace, I want to create new funnel projects from scratch or based on templates.
* **US2.4:** As a user, I want to be able to name, save, load, and delete individual funnel projects.
* **US2.5:** As a user, I want my project data (components, connections, name) to be persistently saved to the backend (Supabase).

### 3.3. Funnel Canvas & Editor
* **US3.1:** As a user, I want to drag various funnel components from a sidebar onto an infinite canvas.
* **US3.2:** As a user, I want to freely move components around the canvas to arrange my funnel visually.
* **US3.3:** As a user, I want to connect components with visual lines to represent the flow of the funnel.
* **US3.4:** As a user, I want to zoom in/out and pan across the canvas for better visualization.
* **US3.5:** As a user, I want to see a background grid on the canvas to aid in alignment.
* **US3.6:** As a user, I want a mini-map to quickly navigate large or zoomed-in funnels.
* **US3.7:** As a user, I want the canvas interactions (drag, pan, zoom) to be smooth and performant.
    * *(Known Issue to address: Components being visually "cut off" on the canvas during pan/zoom).*
* **US3.8:** As a user, I want to clear the entire canvas if needed.

### 3.4. Funnel Components (Nodes)
* **US4.1:** As a user, I want access to a library of diverse funnel components, including but not limited to:
    * Core: Landing Page, Quiz, Form, Email Sequence, Checkout, Sales Page.
    * Digital Launch: Offer, Target Audience, Traffic (Organic/Paid), Lead Capture, Nurturing, Webinar/VSL, Post-Sale, Analytics.
    * Social Media: Instagram Post/Story/Reels/Carousel, TikTok Video, YouTube Short/Video/Thumbnail, Facebook Post/Ad, LinkedIn Post, Twitter Post.
    * Visual Helpers: Note, Arrow, Frame.
* **US4.2:** As a user, I want to select a component on the canvas to view/edit its properties.
* **US4.3:** As a user, I want to edit common properties (title, description, URL, status, image) and type-specific properties for each component through an editor modal.
* **US4.4:** As a user, I want to delete components from the funnel.
* **US4.5:** As a user, I want to duplicate an existing component with its configuration.
* **US4.6:** As a user, I want visual helper components (Note, Arrow, Frame) to have specific visual editing controls (color, size, direction, text, border style).

### 3.5. Connections (Edges)
* **US5.1:** As a user, I want to easily initiate a connection from one component and link it to another.
* **US5.2:** As a user, I want to delete connections between components.
* **US5.3:** As a user, I want to select a connection to edit its properties.
* **US5.4:** As a user, I want to set the type of connection (e.g., success, failure, conditional) and its visual style (color).
* **US5.5:** As a user, I want an option to make connections animated to better visualize flow.

### 3.6. Templates & Component Library
* **US6.1:** As a user, I want to access a library of pre-built full-funnel templates, categorized by use case (e.g., Digital Launch, Lead Generation).
* **US6.2:** As a user, I want to load a full-funnel template onto my canvas as a starting point.
* **US6.3:** As a user, I want the component sidebar to be organized by categories (e.g., Traffic, Conversion, Social Media, Visual Helpers) and allow searching.
* **US6.4:** As a user, I want to mark/unmark component templates as favorites for quick access.
* **US6.5 (Admin):** As an administrator, I want to be able to manage the available ready-made templates (add, edit, activate/deactivate, delete).

### 3.7. Export & Documentation
* **US7.1:** As a user, I want to export my current funnel project as a JSON file.
* **US7.2:** As a user, I want to export my funnel to formats compatible with other tools like Figma, Miro, LucidChart, and Draw.io.
* **US7.3:** As a user, I want to generate a project documentation file that summarizes components, connections, and basic stats.
* **US7.4:** As a user, I want to export project data in a Git-compatible format for version control.

### 3.8. General UI/UX
* **US8.1:** The application must feature a main toolbar with actions like Save Project, Load Project, Export, Clear Canvas, and Navigate Back to Workspaces.
* **US8.2:** A status bar at the bottom should display contextual information (e.g., component count, connection count, application status).
* **US8.3:** The application should provide clear visual feedback for all user interactions (selection, dragging, hover states, connection mode).
* **US8.4:** For social media components, I want to be able to preview a mockup (e.g., Instagram post mockup).
* **US8.5:** The application should gracefully handle unexpected errors using an ErrorBoundary to prevent a full crash.

## 4. Non-Functional Requirements

* **NFR1. Performance:**
    * Canvas interactions (drag, zoom, pan) must remain fluid and responsive, targeting 60 FPS, even with 50-100 components on screen.
    * Initial application load time (LCP) should be < 3 seconds on a fast 3G connection.
    * Project save/load operations should ideally complete within 2-3 seconds for average-sized projects.
* **NFR2. Usability:**
    * The learning curve should be minimal; users should be able to create a basic funnel within 10 minutes of first use.
    * The UI must be consistent, predictable, and visually appealing (dark mode with "neon" accents).
* **NFR3. Reliability & Data Integrity:**
    * Project data saved to Supabase must be persistent and accurate.
    * The application should aim for 99.9% uptime.
* **NFR4. Scalability:**
    * The system (frontend and backend via Supabase) must be designed to handle a growing number of users, workspaces, projects, and components per project.
* **NFR5. Security:**
    * User authentication and authorization must be secure.
    * User data and project data must be protected through Supabase Row Level Security (RLS) and other best practices.
    * Protection against common web vulnerabilities (XSS, CSRF).
* **NFR6. Maintainability & Code Quality:**
    * Codebase must be well-structured, modular, and follow ESLint rules.
    * All code (including variables, functions, components, types) and comments must be written in **English**.
    * Adherence to modern software development best practices, including clean code principles, SOLID (where applicable), and DRY (Don't Repeat Yourself).
    * TypeScript best practices: strong typing, avoidance of `any`, clear interface/type definitions.
* **NFR7. Browser Compatibility:**
    * Full support for the latest versions of Chrome, Firefox, Safari, and Edge.
* **NFR8. PWA Capabilities:**
    * The application should be installable and offer a baseline offline experience (e.g., cached shell).

## 5. Success Metrics (Examples)

* **SM1. User Adoption:**
    * Monthly Active Users (MAU)
    * New user sign-ups per week/month
* **SM2. User Engagement:**
    * Average number of funnels created per active user
    * Average number of components per funnel
    * Average session duration
    * Feature adoption rate (e.g., % of users using templates, export features)
* **SM3. User Retention:**
    * Day 1, Day 7, Day 30 retention rates
    * Churn rate
* **SM4. Task Completion:**
    * Average time to create a 5-component funnel
    * Funnel creation completion rate
* **SM5. System Performance & Quality:**
    * Client-side error rate (via Sentry or similar)
    * Average LCP and FID scores
    * API (Supabase) response times
    * Number of bugs reported vs. fixed.

## 6. Future Considerations / Potential Roadmap

* **Phase 1.1 (Stability & Core Polish):**
    * Comprehensive automated testing suite (unit, integration, E2E).
    * Advanced canvas performance optimizations for very large funnels.
    * Enhanced project versioning (visual diff, named versions).
* **Phase 1.2 (Collaboration & Community):**
    * Real-time collaboration on funnels.
    * Ability for users to share their funnels as templates within a community library.
* **Phase 2.0 (Advanced Features & Integrations):**
    * Direct integrations with marketing automation platforms (e.g., Mailchimp, ActiveCampaign) and CRMs.
    * Integration with ad platforms (Facebook Ads, Google Ads) for data import/export.
    * In-app analytics module to track funnel performance metrics.
    * AI-assisted funnel creation and optimization suggestions (leveraging "Create Custom Funnel" feature).
    * Advanced PWA features (full offline editing, background sync).

---