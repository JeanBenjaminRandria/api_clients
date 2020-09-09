import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  expires: process.env.TOKEN_EXPIRATION,
  secret: process.env.SECRET_KEY,
}));
