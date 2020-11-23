import { CorsOptions } from 'cors';

export const createCorsConfig = (): CorsOptions => ({
  origin: [process.env.WEB_HOST_CLIENT!, process.env.WEB_HOST_SERVER!],
  credentials: true,
});
