
import adapterweb from './webAdapter';
import adapterelectron from './electronAdapter';
import adaptercapacitor from './capacitorAdapter';

const adapter = adapterweb||adapterelectron||adaptercapacitor;

export interface Adapter {
    getFile?:(() => Promise<{
        filename: string,
        content: string,
        ext: string
    } | "cancelled" | "failed">)
}

export const getAdapter = () : Adapter => {
    return adapter;
}