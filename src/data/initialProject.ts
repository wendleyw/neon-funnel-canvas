import { FunnelProject } from '../types';

export const initialProject: FunnelProject = {
  id: 'new-project',
  name: 'New Project',
  components: [],
  connections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
