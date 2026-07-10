import { cn } from "@/lib/utils";

export function Button(props: { children: string }) {
  return <button className={cn("button")}>{props.children}</button>;
}
