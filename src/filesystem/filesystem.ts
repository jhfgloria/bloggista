import Path from "path";
import fs from "fs";

export abstract class FileSystem {
  private _exists?: boolean = undefined;
  
  constructor(public readonly path: string) {}

  get name() { return Path.basename(this.path); }

  public exists(): boolean {
    if (this._exists !== undefined) return this._exists;

    try {
      if (fs.existsSync(this.path)) {
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }
}

export class FileSystemException extends Error {}
