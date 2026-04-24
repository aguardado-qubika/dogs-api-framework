import * as fs from 'fs';
import * as path from 'path';

interface StateLog {
    created: number[];
    updated: number[];
    deleted: number[];
    lastRunAt: string | null;
}

const STATE_FILE = path.resolve(__dirname, '../../state/state-log.json');

function readState(): StateLog {
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(raw) as StateLog;
}

function writeState(state: StateLog): void {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

export const StateManager = {
    trackCreated(id: number): void {
        const state = readState();
        if (!state.created.includes(id)) state.created.push(id);
        state.lastRunAt = new Date().toISOString();
        writeState(state);
    },

    trackUpdated(id: number): void {
        const state = readState();
        if (!state.updated.includes(id)) state.updated.push(id);
        state.lastRunAt = new Date().toISOString();
        writeState(state);
    },

    trackDeleted(id: number): void {
        const state = readState();
        // Remove from created/updated, add to deleted
        state.created = state.created.filter(i => i !== id);
        state.updated = state.updated.filter(i => i !== id);
        if (!state.deleted.includes(id)) state.deleted.push(id);
        state.lastRunAt = new Date().toISOString();
        writeState(state);
    },

    reset(): void {
        writeState({ created: [], updated: [], deleted: [], lastRunAt: null });
    },

    getState(): StateLog {
        return readState();
    },
};