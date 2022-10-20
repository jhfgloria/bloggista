import { Dirent } from "fs";
import fs from "fs/promises";
import { File } from "./file";
import { FileSystem, FileSystemException } from "./filesystem";

export class Folder extends FileSystem {
  private ROOT_FOLDER: string = '/' as const;

  constructor(path: string) {
    super(path);
  }

  public async remove(): Promise<void> {
    if (await this.exists()) {
      await fs.rmdir(this.path, { recursive: true });
    } else {
      throw new MissingFolderException();
    }
  }

  public async create(): Promise<void> {
    if (await this.exists()) {
      throw new AlreadyExistsFolderException();
    }
    await fs.mkdir(this.path);
  }

  public async isRootFolder(): Promise<boolean> {
    if (await this.exists()) {
      return this.path === this.ROOT_FOLDER;
    }
    return false;
  }

  public async getFiles(): Promise<Array<File>> {
    const dirents = await fs.readdir(this.path, { withFileTypes: true });    
    return dirents.filter(d => d.isFile()).map(d => File.fromDirent(d, this));
  }

  public async getSubdirectories(): Promise<Array<Folder>> {
    const dirents = await fs.readdir(this.path, { withFileTypes: true });
    return dirents.filter(d => d.isDirectory()).map(d => Folder.fromDirent(d, this));
  }

  private static fromDirent(dirent: Dirent, parentFolder: Folder): Folder {
    return new Folder(`${parentFolder.path}/${dirent.name}`);
  }
}

class FolderException extends FileSystemException {}
class MissingFolderException extends FolderException {}
class AlreadyExistsFolderException extends FolderException {}
