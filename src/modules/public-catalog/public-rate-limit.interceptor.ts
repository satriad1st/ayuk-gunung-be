import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

const WINDOW_MS = 60_000;
const MAX_HITS = 90;

@Injectable()
export class PublicRateLimitInterceptor implements NestInterceptor {
  private readonly hits = new Map<string, number[]>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const recent = (this.hits.get(ip) ?? []).filter(
      (stamp) => now - stamp < WINDOW_MS,
    );

    if (recent.length >= MAX_HITS) {
      throw new HttpException(
        'Too many requests, please try again shortly',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(now);
    this.hits.set(ip, recent);

    if (this.hits.size > 5_000) {
      for (const [key, stamps] of this.hits) {
        const valid = stamps.filter((stamp) => now - stamp < WINDOW_MS);
        if (valid.length === 0) {
          this.hits.delete(key);
        } else {
          this.hits.set(key, valid);
        }
      }
    }

    return next.handle();
  }
}
