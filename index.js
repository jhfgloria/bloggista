#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootFolder = "./";
const bloggistaRootFolder = findBloggistaProjectRoot(rootFolder);
resetDistributionFolder(bloggistaRootFolder);

const htmlTemplate = getTemplateFromConfig(bloggistaRootFolder);
generateBlogEntries(path.resolve(bloggistaRootFolder) + "/content", htmlTemplate);

function findBloggistaProjectRoot(baseFolder) {
  if (hasReachedRootFolder(baseFolder)) {
    throw Error("This command should be run from a bloggista project.")
  }
  
  try {
    const folderToCheck = path.resolve(baseFolder) + "/bloggista.json";
    checkForFolder(folderToCheck);
    
    return baseFolder;

  } catch (error) {
    const parentFolder = path.resolve(baseFolder, "..");

    return findBloggistaProjectRoot(parentFolder);
  }
}

function checkForFolder(folderToCheck) {
  fs.statSync(folderToCheck);
}

function hasReachedRootFolder(folderToCheck) {
  return folderToCheck === "/";
}

// handle dist directory
function resetDistributionFolder(bloggistaFolder) {
  const distributionFolder = path.resolve(bloggistaFolder) + "/dist";
  
  try {
    checkForFolder(distributionFolder);
    fs.rmdirSync(distributionFolder, { recursive: true });
  } catch (_) {
    console.log("/dist folder does not exist yet");
  } finally {
    console.log("creating /dist folder", distributionFolder);
    fs.mkdirSync(distributionFolder);
  }
}

// get template from templating file
function getTemplateFromConfig(bloggistaFolder) {
  const htmlTemplate = path.resolve(bloggistaFolder) + "/config/index.html";

  try {
    const fileDescriptor = fs.openSync(htmlTemplate);
    const content = fs.readFileSync(fileDescriptor, 'utf8');
    fs.closeSync(fileDescriptor);

    return content;

  } catch (error) {
    console.error(error, "The index.html file is missing from the config folder");
  }
}

// generate blog entries
function generateBlogEntries(bloggistaContentRootFolder, htmlTemplate) {
  const currentDistribuitonFolder = bloggistaContentRootFolder.replace("/content", "/dist");
  
  try {
    checkForFolder(currentDistribuitonFolder);
  } catch (_) {
    fs.mkdirSync(currentDistribuitonFolder);
  }

  const files = fs.readdirSync(bloggistaContentRootFolder, { withFileTypes: true });
  
  files.forEach(file => {
    if (file.isDirectory()) {
      generateBlogEntries(bloggistaContentRootFolder + `/${file.name}`, htmlTemplate);
    } else if (file.name === ".keep") {
      // ignore
    } else {
      generateFile(currentDistribuitonFolder, bloggistaContentRootFolder, file.name, htmlTemplate);
    }
  });
}

function generateFile(destinationFolder, sourceFolder, filename, htmlTemplate) {
  try {
    const sourceFileDescriptor = fs.openSync(sourceFolder + `/${filename}`);
    const content = fs.readFileSync(sourceFileDescriptor, 'utf8');
    fs.closeSync(sourceFileDescriptor);

    const parsedContent = htmlTemplate.replace("{{body}}", content);

    fs.writeFileSync(destinationFolder + `/${filename}`, parsedContent);

  } catch (error) {
    console.error(error);
  }
}