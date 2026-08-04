// file-type is ESM-only and its package.json "exports" map isn't resolvable
// under this project's classic (non-bundler) moduleResolution -- this
// minimal ambient declaration covers the one function we dynamically import.
declare module "file-type" {
  export interface FileTypeResult {
    ext: string;
    mime: string;
  }
  export function fileTypeFromFile(path: string): Promise<FileTypeResult | undefined>;
}
