import appConfig from './app.config';
import databaseConfig from './database.config';
import tokenConfig from './token.config';
import * as Joi from '@hapi/joi';

export const configOptions = {
  isGlobal: true,
  load: [appConfig, databaseConfig, tokenConfig],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number().default(5000),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
  }),
  // validationOptions: {
  //     allowUnknown: false,
  //     abortEarly: true,
  // },
};
