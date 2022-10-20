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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemException = exports.FileSystem = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class FileSystem {
    constructor(path) {
        this.path = path;
        this._exists = undefined;
    }
    get name() { return path_1.default.basename(this.path); }
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._exists !== undefined)
                return this._exists;
            try {
                yield promises_1.default.stat(this.path);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
exports.FileSystem = FileSystem;
class FileSystemException extends Error {
}
exports.FileSystemException = FileSystemException;
