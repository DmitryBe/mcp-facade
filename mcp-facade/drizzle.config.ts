import { defineConfig } from 'drizzle-kit';
import { config } from './src/app/lib/config';


export default defineConfig({
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: config.postgresUrl,
  },
});