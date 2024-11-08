import { File, Folder } from "../filesystem";
import path from "path";

interface BloogistaConfig {
  version: string;
  name: string;
  posts: { [key: string]: BloggistaPost };
}

interface BloggistaPost {
  id: string;
  name: string;
  relativePath: string;
  createdAt: string;
}

export class Bloggista {
  static async findRootFolder(relativePath: string): Promise<Folder> {
    const baseFolder = new Folder(relativePath);

    if (await baseFolder.isRootFolder()) {
      throw Error("This command should be run from a bloggista project.")
    }
    
    const pathToCheck = path.resolve(relativePath) + "/bloggista.json";
    const folderToCheck = new Folder(pathToCheck);

    if (folderToCheck.exists()) {
      return new Folder(relativePath);
    }
    
    const parentFolder = path.resolve(relativePath, "..")
    return Bloggista.findRootFolder(parentFolder);
  }

  static async configFile(): Promise<File> {
    const bloggistaRoot = await Bloggista.findRootFolder('.');
    return new File(path.resolve(bloggistaRoot.path, 'bloggista.json'));
  }

  static async config(): Promise<BloogistaConfig> {
    const bloggistaJSON = await Bloggista.configFile();
    const configuration = await bloggistaJSON.read();
    const JSONConfiguration = JSON.parse(configuration);

    return {
      version: JSONConfiguration.version,
      name: JSONConfiguration.name,
      posts: JSONConfiguration.posts,
    };
  }
}
