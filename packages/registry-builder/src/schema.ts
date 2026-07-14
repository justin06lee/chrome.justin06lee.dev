export type RegistryItemType =
  | "registry:ui"
  | "registry:lib"
  | "registry:theme"
  | "registry:hook";

/** Per-file types are the item types plus `registry:page`, which installs a
 *  framework page file (e.g. `app/not-found.tsx`) relative to the Next.js app
 *  directory instead of a component alias. Only valid on individual files. */
export type RegistryFileType = RegistryItemType | "registry:page";

export interface RegistryFile {
  path: string;
  content: string;
  type: RegistryFileType;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: RegistryItemType;
  description?: string;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  cssVars?: Record<string, Record<string, string>>;
  tailwind?: Record<string, unknown>;
  /** Content of the component's CSS file, if it ships one. */
  css?: string;
}

export interface PropDoc {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description?: string;
}

export interface MetaFile {
  source: string;
  target: string;
  /** Per-file type override. Defaults to the component's `type`. Use `registry:hook`
   *  to ship a headless hook alongside a `registry:ui` styled component, or
   *  `registry:page` to install a page file under the Next.js app directory
   *  (target like `app/not-found.tsx`). */
  type?: RegistryFileType;
}

export interface ComponentMeta {
  name: string;
  type: RegistryItemType;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: MetaFile[];
  cssVars?: Record<string, Record<string, string>>;
  props?: PropDoc[];
  /** Source filename of a CSS file (relative to the component dir) to ship alongside the component. */
  cssFile?: string;
}
