import { mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = mkdtempSync(join(tmpdir(), 'nautiquiz-e2e-'));
process.env.SQLITE_PATH = join(dir, 'test.sqlite');
process.env.JWT_SECRET = 'e2e-test-jwt-secret-key-min-32-chars!!';
