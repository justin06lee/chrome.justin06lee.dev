import { cn } from "@/lib/utils";

export function Badge(props: { children: string }) {
  return <span className={cn("badge")}>{props.children}</span>;
}
