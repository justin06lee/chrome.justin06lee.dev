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
}
