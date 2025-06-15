
import { FunnelProject } from '../types/funnel';

export const initialProject: FunnelProject = {
  id: 'new-project',
  name: 'New Project',
  components: [],
  connections: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
