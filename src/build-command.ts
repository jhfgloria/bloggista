import path from "path";
import { Bloggista } from "./bloggista";
import { File, Folder } from "./filesystem";

export async function buildCommand(): Promise<void> {
  try {
    console.time('Build time');
    const rootFolder = "./";
    const bloggistaRootFolder = await Bloggista.findRootFolder(rootFolder);
    
    await resetDistributionFolder(bloggistaRootFolder);
    
    const htmlTemplateFile = await getTemplateFromConfig(bloggistaRootFolder);
    const template = await htmlTemplateFile.read()
    
    const contentRootFolder = new Folder(path.resolve(bloggistaRootFolder.path) + "/content");
    await generateBlogEntries(contentRootFolder, template);
    
    await copyCSSFiles(bloggistaRootFolder);

    await copyMediaAssets(bloggistaRootFolder);

    console.timeEnd('Build time');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function resetDistributionFolder(bloggistaFolder: Folder): Promise<void> {
  const distributionPath = path.resolve(bloggistaFolder.path) + "/dist";
  const distributionFolder = new Folder(distributionPath);

  if (distributionFolder.exists()) {
    await distributionFolder.remove();
  } else {
    console.log("Creating dist/ from scratch");
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
  
  if (!currentDistribuitonFolder.exists()) {
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
  await newFile.write(await parseLinks(await parseLinkBlocks(parsedContent)));
}

async function copyCSSFiles(bloggistaFolder: Folder): Promise<void> {
  const configFolder = new Folder(path.resolve(bloggistaFolder.path, 'config'));
  const distFolder = new Folder(path.resolve(bloggistaFolder.path, 'dist'));
  const customCSSFile = new File(path.resolve(configFolder.path, 'custom.css'));
  await customCSSFile.copyTo(distFolder);
}

async function copyMediaAssets(bloggistaFolder: Folder): Promise<void> {
  const assetsFolder = new Folder(path.resolve(bloggistaFolder.path, 'assets'));
  
  const distAssetsFolder = new Folder(path.resolve(bloggistaFolder.path, 'dist', 'assets'));
  await distAssetsFolder.create();
  
  for (const file of await assetsFolder.getFiles()) {
    file.copyTo(distAssetsFolder);
  }
}

async function parseLinkBlocks(content: string): Promise<string> {
  const startRegex = /{{link-to:(?<postId>([\w-])*) do}}/g;
  const openLinkTags = content.matchAll(startRegex);
  const postsRegistry = (await Bloggista.config()).posts;

  for (const link of openLinkTags) {
    const post = postsRegistry[link.groups?.postId!];
    content = content.replace(link[0], `<a href="${post.relativePath}">`);
  }

  const endRegex = /{{link-to:(?<postId>([\w-])*) end}}/g;
  const closingLinkTags = content.matchAll(endRegex);
  
  for (const link of closingLinkTags) {
    content = content.replace(link[0], '</a>');
  }

  return content;
}

async function parseLinks(content: string): Promise<string> {
  const regex = /{{link-to:(?<postId>([\w-])*)}}/g;
  const links = content.matchAll(regex);
  const postsRegistry = (await Bloggista.config()).posts;

  for (const link of links) {
    const post = postsRegistry[link.groups?.postId!];
    content = content.replace(link[0], `<a href="${post.relativePath}">${post.name}</a>`);
  }

  return content;
}