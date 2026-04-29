import { app, BrowserWindow, ipcMain } from 'electron';
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Logic (Inlined for reliability)
const dbPath = path.join(__dirname, '../ecolife.db');
const db = new Database(dbPath);

function initDb() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      co2_impact_kg REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function getActivities() {
    const stmt = db.prepare('SELECT * FROM activities ORDER BY timestamp DESC');
    return stmt.all();
}

function addActivity(type, duration, impact) {
    const stmt = db.prepare('INSERT INTO activities (type, duration_minutes, co2_impact_kg) VALUES (?, ?, ?)');
    const info = stmt.run(type, duration, impact);
    return info.lastInsertRowid;
}

// Initialize Database
initDb();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        // Adding titleBarStyle to make it look clean
        titleBarStyle: 'hidden',
        trafficLightPosition: { x: 10, y: 10 },
    });

    // Open DevTools in development
    if (process.env.VITE_DEV_SERVER_URL) {
        // mainWindow.webContents.openDevTools();
    }

    // Load Vite dev server URL or local file based on environment
    if (process.env.VITE_DEV_SERVER_URL) {
        setTimeout(() => {
            mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        }, 1200);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

// IPC Handlers
ipcMain.handle('get-activities', async () => {
    return getActivities();
});

ipcMain.handle('add-activity', async (event, type, duration, impact) => {
    return addActivity(type, duration, impact);
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
