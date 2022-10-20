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
exports.buildCommand = void 0;
const path_1 = __importDefault(require("path"));
const filesystem_1 = require("./filesystem");
function buildCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootFolder = "./";
        const bloggistaRootFolder = yield findBloggistaProjectRoot(rootFolder);
        yield resetDistributionFolder(bloggistaRootFolder);
        const htmlTemplateFile = yield getTemplateFromConfig(bloggistaRootFolder);
        const template = yield htmlTemplateFile.read();
        const contentRootFolder = new filesystem_1.Folder(path_1.default.resolve(bloggistaRootFolder.path) + "/content");
        yield generateBlogEntries(contentRootFolder, template);
    });
}
exports.buildCommand = buildCommand;
function findBloggistaProjectRoot(basePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseFolder = new filesystem_1.Folder(basePath);
        if (yield baseFolder.isRootFolder()) {
            throw Error("This command should be run from a bloggista project.");
        }
        const pathToCheck = path_1.default.resolve(basePath) + "/bloggista.json";
        const folderToCheck = new filesystem_1.Folder(pathToCheck);
        if (yield folderToCheck.exists()) {
            return new filesystem_1.Folder(basePath);
        }
        const parentFolder = path_1.default.resolve(basePath, "..");
        return findBloggistaProjectRoot(parentFolder);
    });
}
function resetDistributionFolder(bloggistaFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const distributionPath = path_1.default.resolve(bloggistaFolder.path) + "/dist";
        const distributionFolder = new filesystem_1.Folder(distributionPath);
        if (yield distributionFolder.exists()) {
            yield distributionFolder.remove();
        }
        else {
            console.log("/dist folder does not exist yet");
        }
        yield distributionFolder.create();
    });
}
function getTemplateFromConfig(bloggistaFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlTemplatePath = path_1.default.resolve(bloggistaFolder.path) + "/config/index.html";
        return new filesystem_1.File(htmlTemplatePath);
    });
}
function generateBlogEntries(bloggistaContentRootFolder, htmlTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDistribuitonPath = bloggistaContentRootFolder.path.replace("/content", "/dist");
        const currentDistribuitonFolder = new filesystem_1.Folder(currentDistribuitonPath);
        if (!(yield currentDistribuitonFolder.exists())) {
            currentDistribuitonFolder.create();
        }
        const files = yield bloggistaContentRootFolder.getFiles();
        const subdirectories = yield bloggistaContentRootFolder.getSubdirectories();
        yield Promise.all(files.filter(f => f.name !== ".keep").map(f => generateFile(currentDistribuitonFolder, f, htmlTemplate)));
        yield Promise.all(subdirectories.map(dir => generateBlogEntries(dir, htmlTemplate)));
    });
}
function generateFile(destinationFolder, sourceFile, htmlTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield sourceFile.read();
        const parsedContent = htmlTemplate.replace("{{body}}", content);
        const newFile = new filesystem_1.File(`${destinationFolder.path}/${sourceFile.name}`);
        yield newFile.write(parsedContent);
    });
}
