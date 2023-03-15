import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.ExtractJwt]),
      ignoreExpiration: false,
      secretOrKey: 'aliibrahemhamoud',
    });
  }
  private static ExtractJwt(req: Request) {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies['token'];
    }
    return null;
  }
  async validate(payload: any) {
    return { ...payload };
  }
}
export default JwtStrategy;
