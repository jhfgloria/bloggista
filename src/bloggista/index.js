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
exports.Bloggista = void 0;
const filesystem_1 = require("../filesystem");
const path_1 = __importDefault(require("path"));
class Bloggista {
    findRootFolder(relativePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseFolder = new filesystem_1.Folder(relativePath);
            if (yield baseFolder.isRootFolder()) {
                throw Error("This command should be run from a bloggista project.");
            }
            const pathToCheck = path_1.default.resolve(relativePath) + "/bloggista.json";
            const folderToCheck = new filesystem_1.Folder(pathToCheck);
            if (yield folderToCheck.exists()) {
                return new filesystem_1.Folder(relativePath);
            }
            const parentFolder = path_1.default.resolve(relativePath, "..");
            return this.findRootFolder(parentFolder);
        });
    }
    configFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const bloggistaRoot = yield this.findRootFolder('.');
            return new filesystem_1.File(path_1.default.resolve(bloggistaRoot.path, 'bloggista.json'));
        });
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            const bloggistaJSON = yield this.configFile();
            const configuration = yield bloggistaJSON.read();
            const JSONConfiguration = JSON.parse(configuration);
            return {
                version: JSONConfiguration.version,
                name: JSONConfiguration.name,
                posts: JSONConfiguration.posts,
            };
        });
    }
}
exports.Bloggista = Bloggista;
