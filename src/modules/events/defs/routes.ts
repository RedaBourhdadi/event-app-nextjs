import { CrudAppRoutes } from '@common/defs/types';

const prefix = '/events';
const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  Me: prefix + '/me',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
};

export default Routes;
