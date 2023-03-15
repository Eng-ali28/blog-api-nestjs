import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'src/types/Role.type';
import { JwtGuard } from '../guard/jwt.guard';
import RoleGuard from '../guard/roles.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtGuard, RoleGuard),
  );
}
