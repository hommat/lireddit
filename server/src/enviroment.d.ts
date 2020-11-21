declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      COOKIE_SECRET: string;
      WEB_HOST_SERVER: string;
      WEB_HOST_CLIENT: string;
      REDIS_HOST: string;
      REDIS_PASSWORD: string;
      POSTGRES_SOMEENV: string;
      POSTGRES_HOST: string;
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
    }
  }
}

export {};
