declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    DB_PORT: string;
    DB_REMOTE_PORT: string;
    JWT_SECRET: string;
    WS_HOST: string;
    WS_PORT: string;

    URL: string;
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
    NEXT_PUBLIC_NINJA_API_KEY: string;
  }
}