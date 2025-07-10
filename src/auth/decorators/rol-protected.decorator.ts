import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';

export const META_ROLES = 'role';

export const RolProtected = (...args: ValidRoles[]) => {
  // if (args && args.length > 0) args.push(Role.dev);      //Allow all endpoints for dev role

  return SetMetadata(META_ROLES, args);
};
