export const messages = {
    getFile: "GETFILE"
}

export type GetFileResult = Promise<{
    filename: string;
    content: string;
    ext: string;
} | "cancelled">
