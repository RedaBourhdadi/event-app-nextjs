import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/Attendee';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix + '/create',
  ReadAll: '/events',
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
