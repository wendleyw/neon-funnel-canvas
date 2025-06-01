
import { FunnelProject } from '../types/funnel';

export const initialProject: FunnelProject = {
  id: 'project-' + Date.now(),
  name: 'Novo Projeto',
  components: [],
  connections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
