import {EventEmitter} from "events";
import fs from "fs/promises";
import {LOG_FILE} from "../constants.js";

export const uploadEvents = new EventEmitter();

export async function logEvent(message) {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logMessage = `${timestamp} - ${message}\n`;
    await fs.appendFile(LOG_FILE, logMessage, (err) => {
        if(err) {
            console.error('Error appending data to file:', err);
        }
    });
}

uploadEvents.on('fileUploadStart', async () => await logEvent('File upload has started'));
uploadEvents.on('fileUploadEnd', async () => await logEvent('File has been uploaded'));
uploadEvents.on('fileUploadFailed', async (error) => await logEvent(`Error occurred, file upload failed: ${error}`));