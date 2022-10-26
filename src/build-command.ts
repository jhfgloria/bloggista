import path from "path";
import { Bloggista } from "./bloggista";
import { File, Folder } from "./filesystem";

export async function buildCommand(): Promise<void> {
  const bloggista = new Bloggista();
  const rootFolder = "./";
  const bloggistaRootFolder = await bloggista.findRootFolder(rootFolder);

  await resetDistributionFolder(bloggistaRootFolder);
  
  const htmlTemplateFile = await getTemplateFromConfig(bloggistaRootFolder);
  const template = await htmlTemplateFile.read()
  
  const contentRootFolder = new Folder(path.resolve(bloggistaRootFolder.path) + "/content");
  await generateBlogEntries(contentRootFolder, template);
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
  
  Promise.all(files.filter(f => f.name !== ".keep").map(f => generateFile(currentDistribuitonFolder, f, htmlTemplate)));
  await Promise.all(subdirectories.map(dir => generateBlogEntries(dir, htmlTemplate)));
}

async function generateFile(destinationFolder: Folder, sourceFile: File, htmlTemplate: string): Promise<void> {
  const content = await sourceFile.read();
  const parsedContent = htmlTemplate.replace("{{body}}", content);
  const newFile = new File(`${destinationFolder.path}/${sourceFile.name}`);
  await newFile.write(parsedContent);
}