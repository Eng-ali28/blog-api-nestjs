import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/user/user.entity';
@Injectable()
class RoleGuard implements CanActivate {
  constructor(private readonly reflactor: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> {
    let request = ctx.switchToHttp().getRequest();
    let roles = this.reflactor.get('roles', ctx.getHandler());
    if (roles.length == 0) return true;

    return this.matchRoles(roles, request.user);
  }
  matchRoles(roles: string | string[], user: UserEntity) {
    if (roles.includes(user.role)) return true;
    else return false;
  }
}
export default RoleGuard;
