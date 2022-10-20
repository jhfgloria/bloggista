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
exports.Folder = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const file_1 = require("./file");
const filesystem_1 = require("./filesystem");
class Folder extends filesystem_1.FileSystem {
    constructor(path) {
        super(path);
        this.ROOT_FOLDER = '/';
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists()) {
                yield promises_1.default.rmdir(this.path, { recursive: true });
            }
            else {
                throw new MissingFolderException();
            }
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists()) {
                throw new AlreadyExistsFolderException();
            }
            yield promises_1.default.mkdir(this.path);
        });
    }
    isRootFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.exists()) {
                return this.path === this.ROOT_FOLDER;
            }
            return false;
        });
    }
    getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const dirents = yield promises_1.default.readdir(this.path, { withFileTypes: true });
            return dirents.filter(d => d.isFile()).map(d => file_1.File.fromDirent(d, this));
        });
    }
    getSubdirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            const dirents = yield promises_1.default.readdir(this.path, { withFileTypes: true });
            return dirents.filter(d => d.isDirectory()).map(d => Folder.fromDirent(d, this));
        });
    }
    static fromDirent(dirent, parentFolder) {
        return new Folder(`${parentFolder.path}/${dirent.name}`);
    }
}
exports.Folder = Folder;
class FolderException extends filesystem_1.FileSystemException {
}
class MissingFolderException extends FolderException {
}
class AlreadyExistsFolderException extends FolderException {
}
