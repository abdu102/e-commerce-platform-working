import { CanActivate, ExecutionContext, Injectable, ForbiddenException, SetMetadata } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const Roles = (...roles: Array<'SUPER_ADMIN' | 'ADMIN' | 'USER'>) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const handlerRoles: Array<'SUPER_ADMIN' | 'ADMIN' | 'USER'> = (Reflect as any).getMetadata('roles', context.getHandler()) || [];
    const classRoles: Array<'SUPER_ADMIN' | 'ADMIN' | 'USER'> = (Reflect as any).getMetadata('roles', context.getClass()) || [];
    const requiredRoles = handlerRoles.length ? handlerRoles : classRoles;

    const auth = request.headers['authorization'];
    if (!auth) throw new ForbiddenException('Missing authorization');
    const token = auth.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      request.user = { ...payload, userId: payload.sub };
      if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
        throw new ForbiddenException('Insufficient role');
      }
      return true;
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  }
}


