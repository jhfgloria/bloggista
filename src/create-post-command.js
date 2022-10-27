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
exports.createPostCommand = void 0;
const path_1 = __importDefault(require("path"));
const bloggista_1 = require("./bloggista");
const filesystem_1 = require("./filesystem");
function createPostCommand(fileName, relativeContentFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bloggistaFolder = yield (new bloggista_1.Bloggista()).findRootFolder('.');
            const contentFolder = new filesystem_1.Folder(path_1.default.resolve(bloggistaFolder.path, 'content'));
            yield createRecursiveFolders(contentFolder, relativeContentFolder);
            const createdAt = new Date().toISOString();
            const bloggistaFileName = `${createdAt.replace(/[-.:TZ]/g, '')}-${fileName}`;
            const file = new filesystem_1.File(path_1.default.resolve(contentFolder.path, relativeContentFolder, `${bloggistaFileName}.html`));
            yield file.write('<h1>Title</h1>\n\n<p>Start editing here</p>');
            const bloggistaConfig = yield new bloggista_1.Bloggista().config();
            const bloggistaConfigFile = yield new bloggista_1.Bloggista().configFile();
            bloggistaConfig.posts[bloggistaFileName] = {
                id: bloggistaFileName,
                name: fileName.split(/[-_]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' '),
                relativePath: path_1.default.relative(bloggistaFolder.path + '/dist', file.path.replace('content', 'dist')),
                createdAt,
            };
            bloggistaConfigFile.write(`${JSON.stringify(bloggistaConfig, null, 2)}\n`);
        }
        catch (error) {
            console.log('Error:', error);
        }
    });
}
exports.createPostCommand = createPostCommand;
function createRecursiveFolders(root, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const levels = path.split('/');
        if (levels.length === 0 || levels[0] === '')
            return;
        const folder = new filesystem_1.Folder(path_1.default.resolve(root.path, levels[0]));
        if (!(yield folder.exists())) {
            yield folder.create();
        }
        return createRecursiveFolders(new filesystem_1.Folder(path_1.default.resolve(root.path, levels[0])), levels.slice(1).join('/'));
    });
}
