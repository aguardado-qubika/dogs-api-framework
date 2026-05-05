import * as fs from 'fs';
import * as path from 'path';
import { StateManager } from './src/utils/state-manager';

const DB_FILE = path.resolve(__dirname, 'db.json');
const DB_BACKUP = path.resolve(__dirname, 'db.backup.json');

async function globalSetup() {
    // If a backup exists from a previously interrupted run, restore it first
    // so we always start from the pre-run clean state, not a dirty db.json
    if (fs.existsSync(DB_BACKUP)) {
        fs.copyFileSync(DB_BACKUP, DB_FILE);
        fs.unlinkSync(DB_BACKUP);
    }
    fs.copyFileSync(DB_FILE, DB_BACKUP);
    StateManager.reset();
    console.log('[global-setup] db.json snapshotted. State log cleared. Fresh run starting.');
}

export default globalSetup;
