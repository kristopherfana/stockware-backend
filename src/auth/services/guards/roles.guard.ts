import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ROLES_KEY } from 'src/users/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    matchRoles(roles: string[], userRole: string) {
        return roles.some((role) => role == userRole);
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!roles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return this.matchRoles(roles, user.role);
    }
}