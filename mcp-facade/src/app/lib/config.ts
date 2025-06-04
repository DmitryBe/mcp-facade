import { config as configDotenv } from 'dotenv';

configDotenv({
    path: '.env',
});


export const config = {
    postgresUrl: getEnv("POSTGRES_URL"),
    authEnabled: getEnv("AUTH_ENABLED", "false") === "true",
};

function getEnv(name: string, defaultValue?: string): string {
    const val = process.env[name];
    if (!val && !defaultValue) throw new Error(`Missing env var: ${name}`);
    if (!val) return defaultValue!;
    return val;
}
