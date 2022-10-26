import { File, Folder } from "./filesystem";
import path from "path";
import Package from "../package.json";

export async function initCommand(name: string): Promise<void> {
  const humanizedName = name.split(/[-_]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ');

  const projectFolder = new Folder(path.resolve('./' + name));
  await projectFolder.create();

  const bloggistaJSON = new File(path.resolve(projectFolder.path + '/bloggista.json'));
  await bloggistaJSON.write(JSONTemplate(humanizedName));

  const contentFolder = new Folder(path.resolve(projectFolder.path  + '/content'));
  await contentFolder.create();

  const configFolder = new Folder(path.resolve(projectFolder.path  + '/config'));
  await configFolder.create();

  const indexFile = new File(path.resolve(configFolder.path  + '/index.html'));
  await indexFile.write(HTMLTemplate(humanizedName));

  const customCSSFile = new File(path.resolve(configFolder.path  + '/custom.css'));
  await customCSSFile.write(customCSSTemplate);

  const exampleHTMLFile = new File(path.resolve(contentFolder.path  + '/index.html'));
  await exampleHTMLFile.write(HTMLTemplate(exampleHTMLTemplate));

  const packageJSONFile = new File(path.resolve(projectFolder.path + '/package.json'));
  await packageJSONFile.write(packageJSONTemplate(name));
}

const JSONTemplate = (name: string) => `{
  "name": "${name}",
  "posts": {
  }
}
`;

const HTMLTemplate = (name: string) => `<!DOCTYPE html>
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

const packageJSONTemplate = (name: string) => `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "dependencies": {
    "bloggista": "^${Package.version}"
  }
}`;
