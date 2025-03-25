declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    DB_PORT: string;
    DB_REMOTE_PORT: string;
    JWT_SECRET: string;

    NEXT_PUBLIC_WS_HOST: string;
    NEXT_PUBLIC_WS_PORT: string;

    NEXT_PUBLIC_URL: string;
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
    NEXT_PUBLIC_NINJA_API_KEY: string;
  }
}