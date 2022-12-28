import { app, BrowserWindow, nativeImage, Menu, Tray, shell } from 'electron';
import path from 'path';
import packageJson from '../package.json';

// Electron Forge automatically creates this entry point
declare const CHATGPT_WINDOW_WEBPACK_ENTRY: string;

let appWindow: BrowserWindow;
let tray: Tray;

/**
 * Create Application Window
 * @returns { BrowserWindow } Application Window Instance
 */
export function createAppWindow(): BrowserWindow {
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: 450,
    height: 550,
    show: false,
    alwaysOnTop: true,
    frame: false,
    fullscreenable: false,
    transparent: true,
    webPreferences: {
      webviewTag: true,
      // Prevents renderer process code from not running when window is hidden
      backgroundThrottling: false,
    },
  };

  // Create new window instance
  appWindow = new BrowserWindow(windowOptions);

  // Load the index.html of the app window.
  appWindow.loadURL(CHATGPT_WINDOW_WEBPACK_ENTRY);

  // Sets whether the window should be visible on all workspaces. (only macOS, Linux)
  appWindow.setVisibleOnAllWorkspaces(true);

  // Close all windows when main window is closed
  appWindow.on('close', () => {
    appWindow = null;
    app.quit();
  });

  return appWindow;
}

const contextMenuTemplate: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: () => {
      app.quit();
    },
  },
  {
    label: 'Reload',
    accelerator: 'Command+R',
    click: () => {
      appWindow.reload();
    },
  },
  {
    label: 'Open in browser',
    click: () => {
      shell.openExternal('https://chat.openai.com/chat');
    },
  },
  {
    type: 'separator',
  },
  {
    label: 'View on GitHub',
    click: () => {
      shell.openExternal(packageJson.repository.url);
    },
  },
];

/**
 * Create Application Tray Icon
 */
export function setupTrayIcon() {
  const iconPath = path.join(
    process.env.NODE_ENV === 'development' ? process.cwd() : process.resourcesPath,
    'images/newiconTemplate.png',
  );

  tray = new Tray(nativeImage.createFromPath(iconPath));

  tray.setToolTip('ChatGPT');

  tray.on('click', () => {
    toggleWindow();
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
  });
}

function getWindowPosition() {
  const windowBounds = appWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
}

function showWindow() {
  const position = getWindowPosition();
  appWindow.setPosition(position.x, position.y, false);
  appWindow.show();
  appWindow.focus();
}

function toggleWindow() {
  if (appWindow.isVisible()) {
    appWindow.hide();
  } else {
    showWindow();
  }
}
