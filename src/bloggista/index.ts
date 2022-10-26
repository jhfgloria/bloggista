import { Folder } from "../filesystem";
import path from "path";

export class Bloggista {
  public async findRootFolder(relativePath: string): Promise<Folder> {
    const baseFolder = new Folder(relativePath);

    if (await baseFolder.isRootFolder()) {
      throw Error("This command should be run from a bloggista project.")
    }
    
    const pathToCheck = path.resolve(relativePath) + "/bloggista.json";
    const folderToCheck = new Folder(pathToCheck);

    if (await folderToCheck.exists()) {
      return new Folder(relativePath);
    }
    
    const parentFolder = path.resolve(relativePath, "..")
    return this.findRootFolder(parentFolder);
  }
}
