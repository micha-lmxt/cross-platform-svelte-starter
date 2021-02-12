// Electron specific code
const { ipcRenderer } = window.require('electron');
import {GetFileResult, messages} from '../../src-electron/messages';
import type { Adapter } from './api';

const getFile = async () =>{
    try {
        return (ipcRenderer.invoke(messages.getFile) as GetFileResult);
    } catch (error) {
        console.log(error);
        return "failed" as "failed";
    }
}

const ElectronAdapter : Adapter = {
    getFile
}

export default ElectronAdapter;