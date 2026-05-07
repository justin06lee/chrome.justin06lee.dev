import type { ComponentMeta } from "./schema";

export function defineComponent<T extends ComponentMeta>(meta: T): T {
  return meta;
}
