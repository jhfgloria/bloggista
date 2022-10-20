import { Dirent } from "fs";
import fs from "fs/promises";
import { FileSystem } from "./filesystem";
import { Folder } from "./folder";

export class File extends FileSystem {
  constructor(path: string) {
    super(path)
  }

  public async read(): Promise<string> {
    if (await this.exists()) {
      const file = await fs.open(this.path, 'r');
      const content = await file.readFile({ encoding: 'utf-8' });
      await file.close();
      return content;
    }
    throw new MissingFileException();
  }

  public async write(data: string): Promise<void> {
    console.log("Been here", this.path);
    await fs.writeFile(this.path, data);
  }

  public static fromDirent(dirent: Dirent, parentFolder: Folder): File {
    return new File(`${parentFolder.path}/${dirent.name}`);
  }
}

class FileException extends Error {}
class MissingFileException extends FileException {}
