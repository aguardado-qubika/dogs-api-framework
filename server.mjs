import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { watch } from 'chokidar';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, 'db.json');
const PORT = 3001;

function readDb() {
  return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
}

function writeDb(data) {
  writing = true;
  writeFileSync(DB_FILE, JSON.stringify(data, null, 4));
  writing = false;
}

// Sequential numeric ID: finds max existing numeric id and increments
function nextId(dogs) {
  const max = dogs.reduce((m, d) => {
    const n = parseInt(d.id);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return String(max + 1);
}

let db = readDb();
let writing = false;

// Reload in-memory db when global-teardown externally restores db.json
watch(DB_FILE).on('change', () => {
  if (!writing) {
    try { db = readDb(); } catch { /* ignore transient parse errors */ }
  }
});

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

function send(res, status, data) {
  setCors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); } catch { resolve({}); }
    });
  });
}

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const [, resource, id] = url.pathname.split('/');
  const method = req.method.toUpperCase();

  if (method === 'OPTIONS') {
    setCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (resource !== 'dogs') {
    send(res, 404, { error: 'Not Found' });
    return;
  }

  const dogs = () => (db.dogs = db.dogs ?? []);

  if (method === 'GET' && !id) {
    send(res, 200, dogs());
  } else if (method === 'GET' && id) {
    const dog = dogs().find(d => d.id === id);
    dog ? send(res, 200, dog) : send(res, 404, { error: 'Not Found' });
  } else if (method === 'POST') {
    const { id: _drop, ...data } = await parseBody(req);
    const dog = { ...data, id: nextId(dogs()) };
    dogs().push(dog);
    writeDb(db);
    send(res, 201, dog);
  } else if (method === 'PATCH' && id) {
    const dog = dogs().find(d => d.id === id);
    if (!dog) { send(res, 404, { error: 'Not Found' }); return; }
    Object.assign(dog, await parseBody(req));
    writeDb(db);
    send(res, 200, dog);
  } else if (method === 'DELETE' && id) {
    const idx = dogs().findIndex(d => d.id === id);
    if (idx === -1) { send(res, 404, { error: 'Not Found' }); return; }
    dogs().splice(idx, 1);
    writeDb(db);
    send(res, 200, {});
  } else {
    send(res, 404, { error: 'Not Found' });
  }
});

httpServer.listen(PORT, () => {
  console.log(`\nMock server running on http://localhost:${PORT}`);
  console.log(`Endpoints:\n  GET    /dogs\n  GET    /dogs/:id\n  POST   /dogs\n  PATCH  /dogs/:id\n  DELETE /dogs/:id`);
  console.log(`\nWatching ${DB_FILE} for external changes...`);
});
