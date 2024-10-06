"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEvents = void 0;
exports.logEvent = logEvent;
const events_1 = require("events");
const fs_1 = require("fs");
const constants_1 = require("../constants");
exports.uploadEvents = new events_1.EventEmitter();
function logEvent(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const logMessage = `${timestamp} - ${message}\n`;
        try {
            yield fs_1.promises.appendFile(constants_1.LOG_FILE, logMessage);
        }
        catch (err) {
            console.error('Error appending data to file:', err);
        }
    });
}
exports.uploadEvents.on('fileUploadStart', () => __awaiter(void 0, void 0, void 0, function* () { return yield logEvent('File upload has started'); }));
exports.uploadEvents.on('fileUploadEnd', () => __awaiter(void 0, void 0, void 0, function* () { return yield logEvent('File has been uploaded'); }));
exports.uploadEvents.on('fileUploadFailed', (error) => __awaiter(void 0, void 0, void 0, function* () { return yield logEvent(`Error occurred, file upload failed: ${error}`); }));
