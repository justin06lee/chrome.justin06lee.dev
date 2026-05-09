import { Button } from "./button";

export default function ButtonDemo() {
  return (
    <div className="flex gap-3 items-center">
      <Button href="#">link</Button>
      <Button href="#" variant="ghost">link ghost</Button>
      <Button>action</Button>
      <Button size="sm" variant="ghost">small</Button>
    </div>
  );
}
