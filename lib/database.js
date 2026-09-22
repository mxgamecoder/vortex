// Lightweight JSON-backed replacement for Sequelize usage in this project.
// Purpose: avoid native sqlite/better-sqlite3 dependencies by providing
// a minimal in-process store that implements the DB API used in the codebase.

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'database.json');
function ensureDbFile() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf8');
}

function readDb() {
    ensureDbFile();
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '{}');
    } catch (e) {
        return {};
    }
}

function writeDb(obj) {
    fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

// Simple QueryTypes constant used by callers
const QueryTypes = { SELECT: 'SELECT' };

class Model {
    constructor(name, schema, options) {
        this.name = name;
        this.schema = schema;
        this.options = options || {};
    }

    async sync() {
        const db = readDb();
        if (!db[this.name]) db[this.name] = [];
        writeDb(db);
    }

    async findOrCreate({ where, defaults }) {
        const db = readDb();
        const table = db[this.name] || [];
        const found = table.find((r) => Object.keys(where).every(k => String(r[k]) === String(where[k])));
        if (found) return [found, false];
        const record = Object.assign({}, defaults || {}, where || {});
        table.push(record);
        db[this.name] = table;
        writeDb(db);
        return [record, true];
    }

    async create(obj) {
        const db = readDb();
        const table = db[this.name] || [];
        table.push(obj);
        db[this.name] = table;
        writeDb(db);
        return obj;
    }

    async update(values, { where }) {
        const db = readDb();
        const table = db[this.name] || [];
        let affected = 0;
        for (let i = 0; i < table.length; i++) {
            const matches = Object.keys(where || {}).every(k => String(table[i][k]) === String(where[k]));
            if (matches) {
                table[i] = Object.assign({}, table[i], values);
                affected++;
            }
        }
        db[this.name] = table;
        writeDb(db);
        return [affected];
    }

    async findByPk(id) {
        const db = readDb();
        const table = db[this.name] || [];
        return table.find(r => String(r.id) === String(id)) || null;
    }
}

// Minimal DATABASE object exported to match the methods used in the bot.
const DATABASE = {
    QueryTypes,
    async sync() {
        ensureDbFile();
        console.log('Lightweight JSON DB ready.');
        return Promise.resolve();
    },
    define(name, schema, options) {
        return new Model(name, schema, options);
    },
    getQueryInterface() {
        return {
            async describeTable(name) {
                const db = readDb();
                const table = db[name] || [];
                if (!table.length) return {};
                const sample = table[0];
                const desc = {};
                for (const k of Object.keys(sample)) desc[k] = { type: typeof sample[k] };
                return desc;
            }
        };
    },
    async query(sql, options) {
        // Basic support for the project's migration query pattern used in antidel.js
        // Expected: 'SELECT * FROM antidelete WHERE id = 1'
        try {
            const m = sql.match(/SELECT \* FROM ([a-zA-Z0-9_]+) WHERE id = (\d+)/i);
            if (m) {
                const table = m[1];
                const id = m[2];
                const db = readDb();
                const rows = (db[table] || []).filter(r => String(r.id) === String(id));
                return [rows, null];
            }
        } catch (e) {}
        return [[], null];
    },
};

// initialize
DATABASE.sync().catch(() => {});

module.exports = { DATABASE };


