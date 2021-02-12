import { GetFileResult, messages } from "./messages";
import { ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs-extra';

export const registerMessages = () => {

    ipcMain.handle(messages.getFile, async () : GetFileResult => {
        const dialogresult = await dialog.showOpenDialog(
            {
                properties: ['openFile'],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'gif', 'webp'] }
                ]
            })
        if (dialogresult.canceled || dialogresult.filePaths.length === 0){
            return "cancelled"
        }
        const filepath = dialogresult.filePaths[0];

        const content = "data:image/"+path.extname(filepath)+";base64," + fs.readFileSync(filepath).toString("base64");
        return {
            content: content,
            filename: filepath,
            ext: path.extname(filepath)
        }
    })
}