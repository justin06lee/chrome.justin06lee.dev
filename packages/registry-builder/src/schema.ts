export type RegistryItemType =
  | "registry:ui"
  | "registry:lib"
  | "registry:theme"
  | "registry:hook";

export interface RegistryFile {
  path: string;
  content: string;
  type: RegistryItemType;
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
   *  to ship a headless hook alongside a `registry:ui` styled component. */
  type?: RegistryItemType;
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
