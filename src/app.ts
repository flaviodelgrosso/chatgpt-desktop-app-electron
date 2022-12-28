import updater from 'update-electron-app';

updater();

import { app, globalShortcut } from 'electron';
import { createAppWindow, setupTrayIcon } from './appWindow';

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('ready', () => {
  const appWindow = createAppWindow();

  // Create the Application's tray icon
  setupTrayIcon();

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+g', () => {
    if (appWindow.isVisible()) {
      appWindow.hide();
    } else {
      appWindow.show();
      if (process.platform == 'darwin') {
        app.show();
      }
      app.focus();
    }
  });

  // prevent background flickering
  app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
