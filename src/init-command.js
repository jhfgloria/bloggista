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
exports.initCommand = void 0;
const filesystem_1 = require("./filesystem");
const path_1 = __importDefault(require("path"));
const package_json_1 = __importDefault(require("../package.json"));
function initCommand(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const humanizedName = name.split(/[-_]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
        const projectFolder = new filesystem_1.Folder(path_1.default.resolve('./' + name));
        yield projectFolder.create();
        const bloggistaJSON = new filesystem_1.File(path_1.default.resolve(projectFolder.path + '/bloggista.json'));
        yield bloggistaJSON.write(JSONTemplate(humanizedName));
        const contentFolder = new filesystem_1.Folder(path_1.default.resolve(projectFolder.path + '/content'));
        yield contentFolder.create();
        const configFolder = new filesystem_1.Folder(path_1.default.resolve(projectFolder.path + '/config'));
        yield configFolder.create();
        const indexFile = new filesystem_1.File(path_1.default.resolve(configFolder.path + '/index.html'));
        yield indexFile.write(HTMLTemplate(humanizedName));
        const customCSSFile = new filesystem_1.File(path_1.default.resolve(configFolder.path + '/custom.css'));
        yield customCSSFile.write(customCSSTemplate);
        const exampleHTMLFile = new filesystem_1.File(path_1.default.resolve(contentFolder.path + '/index.html'));
        yield exampleHTMLFile.write(HTMLTemplate(exampleHTMLTemplate));
        const packageJSONFile = new filesystem_1.File(path_1.default.resolve(projectFolder.path + '/package.json'));
        yield packageJSONFile.write(packageJSONTemplate(name));
    });
}
exports.initCommand = initCommand;
const JSONTemplate = (name) => `{
  "name": "${name}",
  "posts": {
  }
}
`;
const HTMLTemplate = (name) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="bloggista.css">
    <link rel="stylesheet" href="custom.css">
    <title>${name}</title>
  </head>

  <body>
    <div id="header">{{header}}</div>
    <div id="content">{{body}}</div>
    <p id="footer">${name} ♥️ 2022</p>
  </body>
</html>
`;
const customCSSTemplate = `/** You're custom styles go in here **/`;
const exampleHTMLTemplate = `<p>Start editing here</p>`;
const packageJSONTemplate = (name) => `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "dependencies": {
    "bloggista": "^${package_json_1.default.version}"
  }
}`;
