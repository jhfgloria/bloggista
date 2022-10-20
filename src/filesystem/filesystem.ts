import Path from "path";
import fs from "fs/promises";

export abstract class FileSystem {
  private _exists: boolean | undefined = undefined;
  
  constructor(public readonly path: string) {}

  get name(): string { return Path.basename(this.path); }

  public async exists(): Promise<boolean> {
    if (this._exists !== undefined) return this._exists;

    try {
      await fs.stat(this.path);

      return true;
    } catch (error) {
      console.error(error);
      
      return false;
    }
  }
}

export class FileSystemException extends Error {}
