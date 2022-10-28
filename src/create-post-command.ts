import Path from "path";
import { Bloggista } from "./bloggista";
import { File, Folder } from "./filesystem";

export async function createPostCommand(fileName: string, relativeContentFolder?: string) {
  try {
    const bloggistaFolder = await (new Bloggista()).findRootFolder('.')
    const contentFolder = new Folder(Path.resolve(bloggistaFolder.path, 'content'));
    
    if (relativeContentFolder) await createRecursiveFolders(contentFolder, relativeContentFolder);

    const createdAt = new Date().toISOString();
    const bloggistaFileName = `${createdAt.replace(/[-.:TZ]/g, '')}-${fileName}`;
    const file = new File(Path.resolve(contentFolder.path, relativeContentFolder || '', `${bloggistaFileName}.html`));
    
    await file.write('<h1>Title</h1>\n\n<p>Start editing here</p>');
    const bloggistaConfig = await new Bloggista().config();
    const bloggistaConfigFile = await new Bloggista().configFile();

    bloggistaConfig.posts[bloggistaFileName] = {
      id: bloggistaFileName,
      name: fileName.split(/[-_]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' '),
      relativePath: `/${Path.relative(bloggistaFolder.path + '/dist', file.path.replace('content', 'dist'))}`,
      createdAt,
    };

    bloggistaConfigFile.write(`${JSON.stringify(bloggistaConfig, null, 2)}\n`);
  } catch (error) {
    console.log('Error:', error);
  }
}

async function createRecursiveFolders(root: Folder, path: string): Promise<void> {
  const levels = path.split('/');

  if (levels.length === 0 || levels[0] === '') return;

  const folder = new Folder(Path.resolve(root.path, levels[0]));

  if (!(await folder.exists())) {
    await folder.create();
  }

  return createRecursiveFolders(
    new Folder(Path.resolve(root.path, levels[0])),
    levels.slice(1).join('/'),
  );
}
