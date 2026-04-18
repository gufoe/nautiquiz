import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const path = process.env.SQLITE_PATH ?? './data/nautiquiz.sqlite';
mkdirSync(dirname(path), { recursive: true });

export const sqlite = new Database(path);
export const db = drizzle(sqlite, { schema });
