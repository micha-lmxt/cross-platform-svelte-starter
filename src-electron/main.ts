import { app, BrowserWindow, nativeImage, Tray, Menu } from 'electron';
import path from 'path';
import {registerMessages} from './registerMessages';


//IFDEV
require('electron-reload')(
    path.join(__dirname,'../public/**/*'));
//END


const image = nativeImage.createFromPath(
  app.getAppPath() + "/public/favicon-big.png"
);
if (app.dock){
    app.dock.setIcon(image);
}

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile(path.join(__dirname, 'public/index.html'))
}

let tray = null
app.whenReady().then(() => {

})

app.whenReady().then(()=>{
    createWindow();
    tray = new Tray('/path/to/my/icon')
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

registerMessages();