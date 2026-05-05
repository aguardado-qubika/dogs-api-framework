import * as fs from 'fs';
import * as path from 'path';
import { StateManager } from './src/utils/state-manager';

const DB_FILE = path.resolve(__dirname, 'db.json');
const DB_BACKUP = path.resolve(__dirname, 'db.backup.json');

async function globalTeardown() {
    const state = StateManager.getState();
    console.log('\n[global-teardown] Run complete. Final state:', JSON.stringify(state, null, 2));

    if (fs.existsSync(DB_BACKUP)) {
        fs.unlinkSync(DB_BACKUP);
        console.log('[global-teardown] Backup removed. db.json retains all changes from this run.');
    }
}

export default globalTeardown;
