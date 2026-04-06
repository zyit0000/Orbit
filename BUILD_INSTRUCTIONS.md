# Orbit Editor Build Instructions

To build Orbit as a desktop application with a custom frameless topbar for macOS (Intel, ARM, Universal) and Windows 11, follow these steps.

## 1. Prerequisites
- Node.js installed.
- Electron and Electron Builder added to your project.

```bash
npm install --save-dev electron electron-builder
```

## 2. Electron Main Script (`main.js`)
Create a `main.js` in your root directory to handle the frameless window and IPC events.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600, // Somewhat wide and not too tall
    frame: false, // This removes the default OS topbar
    titleBarStyle: 'hidden', // For macOS to keep traffic lights if desired, or 'hidden' for full custom
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // In production, load the built index.html
  // win.loadFile('dist/index.html');
  win.loadURL('http://localhost:3000'); // For development
}

app.whenReady().then(createWindow);

ipcMain.on('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});
ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close());
```

## 3. Preload Script (`preload.js`)
Expose the window controls to the React app.

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});
```

## 4. GitHub Workflow (`.github/workflows/build.yml`)
Use this workflow to build for all platforms.

```yaml
name: Build Desktop App
on: [push]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest]
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install Dependencies
        run: npm install
      - name: Build React App
        run: npm run build
      - name: Build Electron App
        run: npx electron-builder --publish never
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 5. Electron Builder Config (`package.json`)
Add this to your `package.json`:

```json
"build": {
  "appId": "com.orbit.editor",
  "productName": "Orbit",
  "mac": {
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64", "universal"]
      }
    ]
  },
  "win": {
    "target": "nsis"
  },
  "directories": {
    "output": "release"
  }
}
```
