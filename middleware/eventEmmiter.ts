import {EventEmitter} from "events";
import { promises as fs } from 'fs';
import {LOG_FILE} from "../constants";

export const uploadEvents: EventEmitter = new EventEmitter();

export async function logEvent(message: string): Promise<void> {
    const timestamp: string = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logMessage: string = `${timestamp} - ${message}\n`;
    try {
        await fs.appendFile(LOG_FILE, logMessage);
    } catch (err) {
        console.error('Error appending data to file:', err);
    }
}

uploadEvents.on('fileUploadStart', async (): Promise<void> => await logEvent('File upload has started'));
uploadEvents.on('fileUploadEnd', async (): Promise<void> => await logEvent('File has been uploaded'));
uploadEvents.on('fileUploadFailed', async (error): Promise<void> => await logEvent(`Error occurred, file upload failed: ${error}`));