import { Checkbox } from "./checkbox";
export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="published" defaultChecked />
      <Checkbox label="hidden test case" />
      <Checkbox label="disabled" disabled />
    </div>
  );
}
