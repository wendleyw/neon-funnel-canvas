export type Language = 'en' | 'pt';

export interface Translation {
  // Common UI elements
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    add: string;
    remove: string;
    search: string;
    loading: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    confirm: string;
    back: string;
    next: string;
    finish: string;
    close: string;
    open: string;
    settings: string;
    help: string;
    profile: string;
    logout: string;
  };

  // Sidebar and Navigation
  sidebar: {
    sources: string;
    pages: string;
    actions: string;
    library: string;
    templates: string;
    favorites: string;
    search_placeholder: string;
    no_results: string;
    no_favorite_items_type: string;
  };

  // Sources
  sources: {
    title: string;
    search_placeholder: string;
    categories: {
      paid: string;
      search: string;
      social: string;
      messaging: string;
      crm: string;
      offline: string;
      content: string;
      other: string;
    };
    no_favorites: string;
    add_to_favorites: string;
    remove_from_favorites: string;
  };

  // Pages
  pages: {
    title: string;
    search_placeholder: string;
    categories: {
      lead_capture: string;
      sales: string;
      social_media: string;
      webinar: string;
      engagement: string;
      booking: string;
      content: string;
      membership: string;
      confirmation: string;
      popup: string;
    };
  };

  // Actions
  actions: {
    title: string;
    search_placeholder: string;
    categories: {
      conversion: string;
      engagement: string;
      integration: string;
      custom: string;
      automation: string;
      forms: string;
      interactions: string;
      analytics: string;
    };
  };

  // Admin Panel
  admin: {
    title: string;
    dashboard: string;
    manage_sources: string;
    manage_pages: string;
    manage_actions: string;
    add_new: string;
    edit_item: string;
    delete_item: string;
    confirm_delete: string;
    item_added: string;
    item_updated: string;
    item_deleted: string;
    access_denied: string;
    admin_only: string;
    
    // Forms
    forms: {
      name: string;
      description: string;
      category: string;
      type: string;
      icon: string;
      color: string;
      status: string;
      properties: string;
      required_field: string;
      invalid_json: string;
      save_success: string;
      save_error: string;
    };
    
    // Statuses
    status: {
      active: string;
      inactive: string;
      draft: string;
      published: string;
      test: string;
    };
  };

  // Authentication
  auth: {
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    full_name: string;
    forgot_password: string;
    reset_password: string;
    create_account: string;
    sign_in: string;
    sign_up: string;
    welcome_back: string;
    account_created: string;
    login_error: string;
    register_error: string;
    already_have_account: string;
    dont_have_account: string;
  };

  // Component Editor
  editor: {
    title: string;
    general: string;
    media_assets: string;
    advanced: string;
    properties: string;
    upload_image: string;
    image_url: string;
    auto_scroll_preview: string;
    save_changes: string;
    discard_changes: string;
  };

  // Workspace
  workspace: {
    title: string;
    create_workspace: string;
    workspace_name: string;
    workspace_description: string;
    select_workspace: string;
    no_workspaces: string;
    create_project: string;
    project_name: string;
    open_project: string;
    delete_project: string;
    projects: string;
    last_modified: string;
  };

  // Canvas
  canvas: {
    add_component: string;
    delete_component: string;
    edit_component: string;
    connect_components: string;
    clear_canvas: string;
    save_project: string;
    load_project: string;
    export_project: string;
    zoom_in: string;
    zoom_out: string;
    fit_view: string;
  };

  // Messages and Notifications
  messages: {
    component_added: string;
    component_deleted: string;
    component_updated: string;
    project_saved: string;
    project_loaded: string;
    connection_created: string;
    connection_deleted: string;
    unsaved_changes: string;
    save_before_exit: string;
    operation_successful: string;
    operation_failed: string;
  };

  // Connection Modal & Edge Context Menu
  connection_modal_title: string;
  delete_connection_confirmation: string;
  no_components_available_to_connect: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      add: 'Add',
      remove: 'Remove',
      search: 'Search',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      yes: 'Yes',
      no: 'No',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      close: 'Close',
      open: 'Open',
      settings: 'Settings',
      help: 'Help',
      profile: 'Profile',
      logout: 'Logout',
    },

    sidebar: {
      sources: 'Sources',
      pages: 'Pages',
      actions: 'Actions',
      library: 'Library',
      templates: 'Templates',
      favorites: 'Favorites',
      search_placeholder: 'Search...',
      no_results: 'No results found',
      no_favorite_items_type: 'No favorite {type} found',
    },

    sources: {
      title: 'Traffic Sources',
      search_placeholder: 'Search sources...',
      categories: {
        paid: 'Paid Advertising',
        search: 'Search Engines',
        social: 'Social Media',
        messaging: 'Messaging Platforms',
        crm: 'CRM Systems',
        offline: 'Offline Marketing',
        content: 'Content Marketing',
        other: 'Other Sources',
      },
      no_favorites: 'No favorite sources yet',
      add_to_favorites: 'Add to favorites',
      remove_from_favorites: 'Remove from favorites',
    },

    pages: {
      title: 'Page Templates',
      search_placeholder: 'Search pages...',
      categories: {
        lead_capture: 'Lead Capture',
        sales: 'Sales Pages',
        social_media: 'Social Media',
        webinar: 'Webinars',
        engagement: 'Engagement',
        booking: 'Booking',
        content: 'Content',
        membership: 'Membership',
        confirmation: 'Confirmation',
        popup: 'Popups',
      },
    },

    actions: {
      title: 'User Actions',
      search_placeholder: 'Search actions...',
      categories: {
        conversion: 'Conversion Actions',
        engagement: 'Engagement Actions',
        integration: 'Integration Actions',
        custom: 'Custom Actions',
        automation: 'Automation Actions',
        forms: 'Forms & Inputs',
        interactions: 'User Interactions',
        analytics: 'Analytics & Tracking',
      },
    },

    admin: {
      title: 'Admin Panel',
      dashboard: 'Dashboard',
      manage_sources: 'Manage Sources',
      manage_pages: 'Manage Pages',
      manage_actions: 'Manage Actions',
      add_new: 'Add New',
      edit_item: 'Edit Item',
      delete_item: 'Delete Item',
      confirm_delete: 'Are you sure you want to delete this item?',
      item_added: 'Item added successfully',
      item_updated: 'Item updated successfully',
      item_deleted: 'Item deleted successfully',
      access_denied: 'Access denied',
      admin_only: 'This area is restricted to administrators only',

      forms: {
        name: 'Name',
        description: 'Description',
        category: 'Category',
        type: 'Type',
        icon: 'Icon',
        color: 'Color',
        status: 'Status',
        properties: 'Properties',
        required_field: 'This field is required',
        invalid_json: 'Invalid JSON format',
        save_success: 'Saved successfully',
        save_error: 'Error saving changes',
      },

      status: {
        active: 'Active',
        inactive: 'Inactive',
        draft: 'Draft',
        published: 'Published',
        test: 'Test',
      },
    },

    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      full_name: 'Full Name',
      forgot_password: 'Forgot Password',
      reset_password: 'Reset Password',
      create_account: 'Create Account',
      sign_in: 'Sign In',
      sign_up: 'Sign Up',
      welcome_back: 'Welcome back!',
      account_created: 'Account created successfully',
      login_error: 'Invalid email or password',
      register_error: 'Error creating account',
      already_have_account: 'Already have an account?',
      dont_have_account: "Don't have an account?",
    },

    editor: {
      title: 'Component Editor',
      general: 'General',
      media_assets: 'Media & Assets',
      advanced: 'Advanced',
      properties: 'Properties',
      upload_image: 'Upload Image',
      image_url: 'Image URL',
      auto_scroll_preview: 'Auto-scroll preview',
      save_changes: 'Save Changes',
      discard_changes: 'Discard Changes',
    },

    workspace: {
      title: 'Workspaces',
      create_workspace: 'Create Workspace',
      workspace_name: 'Workspace Name',
      workspace_description: 'Workspace Description',
      select_workspace: 'Select Workspace',
      no_workspaces: 'No workspaces found',
      create_project: 'Create Project',
      project_name: 'Project Name',
      open_project: 'Open Project',
      delete_project: 'Delete Project',
      projects: 'Projects',
      last_modified: 'Last Modified',
    },

    canvas: {
      add_component: 'Add Component',
      delete_component: 'Delete Component',
      edit_component: 'Edit Component',
      connect_components: 'Connect Components',
      clear_canvas: 'Clear Canvas',
      save_project: 'Save Project',
      load_project: 'Load Project',
      export_project: 'Export Project',
      zoom_in: 'Zoom In',
      zoom_out: 'Zoom Out',
      fit_view: 'Fit View',
    },

    messages: {
      component_added: 'Component Added',
      component_deleted: 'Component Deleted',
      component_updated: 'Component Updated',
      project_saved: 'Project Saved',
      project_loaded: 'Project Loaded',
      connection_created: 'Connection Created',
      connection_deleted: 'Connection Deleted',
      unsaved_changes: 'You have unsaved changes.',
      save_before_exit: 'Do you want to save your changes before exiting?',
      operation_successful: 'Operation successful',
      operation_failed: 'Operation failed',
    },

    connection_modal_title: 'Select Component to Connect',
    delete_connection_confirmation: 'Are you sure you want to delete this connection?',
    no_components_available_to_connect: 'No other components available to connect.',
  },

  pt: {
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      add: 'Adicionar',
      remove: 'Remover',
      search: 'Buscar',
      loading: 'Carregando...',
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Aviso',
      info: 'Info',
      yes: 'Sim',
      no: 'Não',
      confirm: 'Confirmar',
      back: 'Voltar',
      next: 'Próximo',
      finish: 'Finalizar',
      close: 'Fechar',
      open: 'Abrir',
      settings: 'Configurações',
      help: 'Ajuda',
      profile: 'Perfil',
      logout: 'Sair',
    },

    sidebar: {
      sources: 'Fontes',
      pages: 'Páginas',
      actions: 'Ações',
      library: 'Biblioteca',
      templates: 'Templates',
      favorites: 'Favoritos',
      search_placeholder: 'Buscar...',
      no_results: 'Nenhum resultado encontrado',
      no_favorite_items_type: 'Nenhum favorito do tipo {type} encontrado',
    },

    sources: {
      title: 'Fontes de Tráfego',
      search_placeholder: 'Buscar fontes...',
      categories: {
        paid: 'Publicidade Paga',
        search: 'Mecanismos de Busca',
        social: 'Mídias Sociais',
        messaging: 'Plataformas de Mensagem',
        crm: 'Sistemas CRM',
        offline: 'Marketing Offline',
        content: 'Marketing de Conteúdo',
        other: 'Outras Fontes',
      },
      no_favorites: 'Nenhuma fonte favorita ainda',
      add_to_favorites: 'Adicionar aos favoritos',
      remove_from_favorites: 'Remover dos favoritos',
    },

    pages: {
      title: 'Templates de Página',
      search_placeholder: 'Buscar páginas...',
      categories: {
        lead_capture: 'Captura de Leads',
        sales: 'Páginas de Vendas',
        social_media: 'Mídias Sociais',
        webinar: 'Webinars',
        engagement: 'Engajamento',
        booking: 'Agendamento',
        content: 'Conteúdo',
        membership: 'Membros',
        confirmation: 'Confirmação',
        popup: 'Popups',
      },
    },

    actions: {
      title: 'Ações do Usuário',
      search_placeholder: 'Buscar ações...',
      categories: {
        conversion: 'Ações de Conversão',
        engagement: 'Ações de Engajamento',
        integration: 'Ações de Integração',
        custom: 'Ações Personalizadas',
        automation: 'Ações de Automação',
        forms: 'Formulários e Entradas',
        interactions: 'Interações do Usuário',
        analytics: 'Analytics e Tracking',
      },
    },

    admin: {
      title: 'Painel Administrativo',
      dashboard: 'Dashboard',
      manage_sources: 'Gerenciar Fontes',
      manage_pages: 'Gerenciar Páginas',
      manage_actions: 'Gerenciar Ações',
      add_new: 'Adicionar Novo',
      edit_item: 'Editar Item',
      delete_item: 'Excluir Item',
      confirm_delete: 'Tem certeza que deseja excluir este item?',
      item_added: 'Item adicionado com sucesso',
      item_updated: 'Item atualizado com sucesso',
      item_deleted: 'Item excluído com sucesso',
      access_denied: 'Acesso negado',
      admin_only: 'Esta área é restrita apenas para administradores',

      forms: {
        name: 'Nome',
        description: 'Descrição',
        category: 'Categoria',
        type: 'Tipo',
        icon: 'Ícone',
        color: 'Cor',
        status: 'Status',
        properties: 'Propriedades',
        required_field: 'Este campo é obrigatório',
        invalid_json: 'Formato JSON inválido',
        save_success: 'Salvo com sucesso',
        save_error: 'Erro ao salvar alterações',
      },

      status: {
        active: 'Ativo',
        inactive: 'Inativo',
        draft: 'Rascunho',
        published: 'Publicado',
        test: 'Teste',
      },
    },

    auth: {
      login: 'Entrar',
      register: 'Registrar',
      logout: 'Sair',
      email: 'Email',
      password: 'Senha',
      full_name: 'Nome Completo',
      forgot_password: 'Esqueci a Senha',
      reset_password: 'Redefinir Senha',
      create_account: 'Criar Conta',
      sign_in: 'Entrar',
      sign_up: 'Cadastrar',
      welcome_back: 'Bem-vindo de volta!',
      account_created: 'Conta criada com sucesso',
      login_error: 'Email ou senha inválidos',
      register_error: 'Erro ao criar conta',
      already_have_account: 'Já tem uma conta?',
      dont_have_account: 'Não tem uma conta?',
    },

    editor: {
      title: 'Editor de Componente',
      general: 'Geral',
      media_assets: 'Mídia e Assets',
      advanced: 'Avançado',
      properties: 'Propriedades',
      upload_image: 'Fazer Upload de Imagem',
      image_url: 'URL da Imagem',
      auto_scroll_preview: 'Preview com auto-scroll',
      save_changes: 'Salvar Alterações',
      discard_changes: 'Descartar Alterações',
    },

    workspace: {
      title: 'Espaços de Trabalho',
      create_workspace: 'Criar Espaço de Trabalho',
      workspace_name: 'Nome do Espaço de Trabalho',
      workspace_description: 'Descrição do Espaço de Trabalho',
      select_workspace: 'Selecionar Espaço de Trabalho',
      no_workspaces: 'Nenhum espaço de trabalho encontrado',
      create_project: 'Criar Projeto',
      project_name: 'Nome do Projeto',
      open_project: 'Abrir Projeto',
      delete_project: 'Excluir Projeto',
      projects: 'Projetos',
      last_modified: 'Última Modificação',
    },

    canvas: {
      add_component: 'Adicionar Componente',
      delete_component: 'Excluir Componente',
      edit_component: 'Editar Componente',
      connect_components: 'Conectar Componentes',
      clear_canvas: 'Limpar Canvas',
      save_project: 'Salvar Projeto',
      load_project: 'Carregar Projeto',
      export_project: 'Exportar Projeto',
      zoom_in: 'Aumentar Zoom',
      zoom_out: 'Diminuir Zoom',
      fit_view: 'Ajustar Visualização',
    },

    messages: {
      component_added: 'Componente Adicionado',
      component_deleted: 'Componente Excluído',
      component_updated: 'Componente Atualizado',
      project_saved: 'Projeto Salvo',
      project_loaded: 'Projeto Carregado',
      connection_created: 'Conexão criada',
      connection_deleted: 'Conexão excluída',
      unsaved_changes: 'Você possui alterações não salvas.',
      save_before_exit: 'Deseja salvar suas alterações antes de sair?',
      operation_successful: 'Operação bem-sucedida',
      operation_failed: 'Operação falhou',
    },

    connection_modal_title: 'Selecionar Componente para Conectar',
    delete_connection_confirmation: 'Tem certeza que deseja excluir esta conexão?',
    no_components_available_to_connect: 'Nenhum outro componente disponível para conectar.',
  },
};

// Hook for using translations
let currentLanguage: Language = 'en';
let currentTranslations: Translation = translations.en;

export function useTranslation() {
  const setLanguage = (language: Language) => {
    currentLanguage = language;
    currentTranslations = translations[language];
    localStorage.setItem('funnel-builder-language', language);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = currentTranslations;
    
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    return result;
  };

  return {
    t,
    language: currentLanguage,
    setLanguage,
    availableLanguages: Object.keys(translations) as Language[],
  };
}

// Initialize language from localStorage
export const initializeI18n = () => {
  const savedLanguage = localStorage.getItem('funnel-builder-language') as Language;
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
    currentTranslations = translations[savedLanguage];
  }
};

// Export for global access
export { currentLanguage, currentTranslations }; 