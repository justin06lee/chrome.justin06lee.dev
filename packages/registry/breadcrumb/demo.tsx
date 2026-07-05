import { Breadcrumb, crumbsFromPath } from "./breadcrumb";

export default function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <Breadcrumb
        items={[
          { label: "desk", href: "/desk" },
          { label: "articles", href: "/desk/articles" },
          { label: "field notes", href: "/desk/articles/field-notes" },
          { label: "edit" },
        ]}
      />

      <Breadcrumb
        items={crumbsFromPath("/desk/articles/field-notes/edit", {
          basePath: "/desk",
        })}
        homeHref="/"
      />
    </div>
  );
}
