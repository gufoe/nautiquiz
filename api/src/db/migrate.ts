import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db, sqlite } from './index';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = join(__dirname, '../../drizzle');

await migrate(db, { migrationsFolder });
sqlite.close();
console.log('Migrations applied.');
