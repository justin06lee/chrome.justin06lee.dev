"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardBody,
  CardActions,
} from "./card";

export default function CardDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle href="https://example.com">chrome registry</CardTitle>
          <CardMeta>2026</CardMeta>
        </CardHeader>
        <CardBody>
          own-the-code components ported from justin06lee.dev. install via the cli.
        </CardBody>
        <CardActions>
          <a href="#" className="text-sm underline-offset-4 hover:underline">
            view code
          </a>
          <a href="#" className="text-sm underline-offset-4 hover:underline">
            live
          </a>
        </CardActions>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>no link, no actions</CardTitle>
          <CardMeta>draft</CardMeta>
        </CardHeader>
        <CardBody>compose the slots you need; drop the ones you don&apos;t.</CardBody>
      </Card>
    </div>
  );
}
