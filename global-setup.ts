import { StateManager } from './src/utils/state-manager';

async function globalSetup() {
    StateManager.reset();
    console.log('[global-setup] State log cleared. Fresh run starting.');
}

export default globalSetup;