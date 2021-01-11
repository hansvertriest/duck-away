import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';  
import { IConfig } from '../config';

export default class AuthService {
  public config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  public createAdminToken(password: string): string {
    if (password == this.config.auth.adminPass) {
      const payload = {
        role: "admin"
      };
      console.log(this.config.auth.expiresIn)
      return jwt.sign(payload, this.config.auth.secret);
    } else {
      return "";
    }
  }

  public createDuckToken(duckId: string): string {
    const payload = {
      role: "duck",
      id: duckId,
    };

    return jwt.sign(payload, this.config.auth.secret);
  }

  public verifyToken = (token: string): any => {
    try {
      const decoded: string | object = jwt.verify(token, this.config.auth.secret);
      if (!decoded) throw {};
      return { result: true, content: decoded };
    } catch( error ) {
      return { result: false };
    }
  }
}