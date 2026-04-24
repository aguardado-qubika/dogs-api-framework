import { StateManager } from './src/utils/state-manager';

async function globalTeardown() {
  const state = StateManager.getState();
  console.log('\n[global-teardown] Run complete. Final state:', JSON.stringify(state, null, 2));
}

export default globalTeardown;