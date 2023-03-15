import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';

export class GetInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    let request = context.switchToHttp().getRequest();
    return next.handle();
  }
}
