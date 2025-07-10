import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RolProtected } from './rol-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { ValidRoles } from '../interfaces/valid-roles';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
