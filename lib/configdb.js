
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'config.json');

function ensure() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}), 'utf8');
}

function read() {
  ensure();
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8') || '{}'); } catch (e) { return {}; }
}

function write(obj) {
  fs.writeFileSync(FILE, JSON.stringify(obj, null, 2), 'utf8');
}

module.exports = {
  getConfig: (key) => {
    const cfg = read();
    return cfg.hasOwnProperty(key) ? cfg[key] : null;
  },
  setConfig: (key, value) => {
    const cfg = read();
    cfg[key] = value;
    write(cfg);
  },
  getAllConfig: () => {
    return read();
  }
};
