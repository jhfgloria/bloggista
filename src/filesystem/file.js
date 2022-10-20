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
exports.File = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const filesystem_1 = require("./filesystem");
class File extends filesystem_1.FileSystem {
    constructor(path) {
        super(path);
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists()) {
                const file = yield promises_1.default.open(this.path, 'r');
                const content = yield file.readFile({ encoding: 'utf-8' });
                yield file.close();
                return content;
            }
            throw new MissingFileException();
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Been here", this.path);
            yield promises_1.default.writeFile(this.path, data);
        });
    }
    static fromDirent(dirent, parentFolder) {
        return new File(`${parentFolder.path}/${dirent.name}`);
    }
}
exports.File = File;
class FileException extends Error {
}
class MissingFileException extends FileException {
}
