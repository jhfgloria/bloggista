import path from "path";
import { File, Folder } from "./filesystem";

export async function buildCommand(): Promise<void> {
  const rootFolder = "./";
  const bloggistaRootFolder = await findBloggistaProjectRoot(rootFolder);
  await resetDistributionFolder(bloggistaRootFolder);
  const htmlTemplateFile = await getTemplateFromConfig(bloggistaRootFolder);
  const template = await htmlTemplateFile.read()
  const contentRootFolder = new Folder(path.resolve(bloggistaRootFolder.path) + "/content");
  await generateBlogEntries(contentRootFolder, template);
}

async function findBloggistaProjectRoot(basePath: string): Promise<Folder> {
  const baseFolder = new Folder(basePath);

  if (await baseFolder.isRootFolder()) {
    throw Error("This command should be run from a bloggista project.")
  }
  
  const pathToCheck = path.resolve(basePath) + "/bloggista.json";
  const folderToCheck = new Folder(pathToCheck);

  if (await folderToCheck.exists()) {
    return new Folder(basePath);
  }
  
  const parentFolder = path.resolve(basePath, "..")
  return findBloggistaProjectRoot(parentFolder);
}

async function resetDistributionFolder(bloggistaFolder: Folder): Promise<void> {
  const distributionPath = path.resolve(bloggistaFolder.path) + "/dist";
  const distributionFolder = new Folder(distributionPath);

  if (await distributionFolder.exists()) {
    await distributionFolder.remove();
  } else {
    console.log("/dist folder does not exist yet");
  }
  
  await distributionFolder.create();
}

async function getTemplateFromConfig(bloggistaFolder: Folder): Promise<File>  {
  const htmlTemplatePath = path.resolve(bloggistaFolder.path) + "/config/index.html";
  return new File(htmlTemplatePath);
}

async function generateBlogEntries(bloggistaContentRootFolder: Folder, htmlTemplate: string): Promise<void> {
  const currentDistribuitonPath = bloggistaContentRootFolder.path.replace("/content", "/dist");
  const currentDistribuitonFolder = new Folder(currentDistribuitonPath);
  
  if (!await currentDistribuitonFolder.exists()) {
    currentDistribuitonFolder.create();
  }

  const files = await bloggistaContentRootFolder.getFiles();
  const subdirectories = await bloggistaContentRootFolder.getSubdirectories();
  
  await Promise.all(files.filter(f => f.name !== ".keep").map(f => generateFile(currentDistribuitonFolder, f, htmlTemplate)));
  await Promise.all(subdirectories.map(dir => generateBlogEntries(dir, htmlTemplate)));
}

async function generateFile(destinationFolder: Folder, sourceFile: File, htmlTemplate: string): Promise<void> {
  const content = await sourceFile.read();
  const parsedContent = htmlTemplate.replace("{{body}}", content);
  const newFile = new File(`${destinationFolder.path}/${sourceFile.name}`);
  await newFile.write(parsedContent);
}