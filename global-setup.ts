import * as fs from 'fs';
import * as path from 'path';
import { StateManager } from './src/utils/state-manager';

const DB_FILE = path.resolve(__dirname, 'db.json');
const DB_BACKUP = path.resolve(__dirname, 'db.backup.json');

async function globalSetup() {
    // Snapshot db.json before the run so teardown can restore it
    fs.copyFileSync(DB_FILE, DB_BACKUP);
    StateManager.reset();
    console.log('[global-setup] db.json snapshotted. State log cleared. Fresh run starting.');
}

export default globalSetup;
