import { Breadcrumb, crumbsFromPath } from "./breadcrumb";

export default function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <Breadcrumb
        items={[
          { label: "desk", href: "#" },
          { label: "articles", href: "#" },
          { label: "field notes", href: "#" },
          { label: "edit" },
        ]}
      />

      <Breadcrumb
        items={crumbsFromPath("/desk/articles/field-notes/edit", {
          basePath: "#",
        })}
        homeHref="/"
      />
    </div>
  );
}
