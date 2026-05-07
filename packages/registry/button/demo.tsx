import { Button } from "./button";

export default function ButtonDemo() {
  return (
    <div className="flex gap-3 items-center">
      <Button>click me</Button>
      <Button variant="ghost">ghost</Button>
      <Button size="sm">small</Button>
    </div>
  );
}
