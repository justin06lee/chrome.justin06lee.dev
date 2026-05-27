"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { Check, Copy } from "lucide-react";
import "katex/dist/katex.min.css";

export type ProseProps = {
  /** Markdown source. */
  children: string;
  /** Prefix for relative image srcs (e.g. a GitHub raw base). */
  imageBaseUrl?: string;
  className?: string;
};

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function isResolved(src: string): boolean {
  return /^(https?:|data:|\/)/.test(src);
}

const HEADING_SCROLL = { scrollMarginTop: "var(--sticky-header-offset, 80px)" };

function PreBlock({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async () => {
    const code = ref.current?.querySelector("code");
    const text = (code ?? ref.current)?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <pre
      ref={ref}
      className="group relative my-5 overflow-x-auto border border-white/10 bg-white/[0.03] p-4 font-mono text-[13px] leading-6"
      {...props}
    >
      {children}
      <button
        type="button"
        onClick={copy}
        aria-label="copy code"
        className="absolute right-2 top-2 text-white/40 opacity-0 transition hover:text-white focus:opacity-100 focus:outline-none group-hover:opacity-100"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </pre>
  );
}

/**
 * Markdown renderer with the justin06lee.dev prose styling — GFM, math (KaTeX),
 * heading slugs, and copy-on-hover code blocks. Dark-only. Pass markdown as the
 * single string child.
 */
export function Prose({ children, imageBaseUrl, className }: ProseProps) {
  const components: Components = {
    h1: ({ children, ...p }) => (
      <h1 className="mb-4 mt-10 text-3xl font-semibold tracking-tight text-white first:mt-0" style={HEADING_SCROLL} {...p}>{children}</h1>
    ),
    h2: ({ children, ...p }) => (
      <h2 className="mb-3 mt-10 text-2xl font-semibold tracking-tight text-white" style={HEADING_SCROLL} {...p}>{children}</h2>
    ),
    h3: ({ children, ...p }) => (
      <h3 className="mb-2 mt-8 text-xl font-semibold tracking-tight text-white" style={HEADING_SCROLL} {...p}>{children}</h3>
    ),
    h4: ({ children, ...p }) => (
      <h4 className="mb-2 mt-6 text-lg font-semibold text-white" style={HEADING_SCROLL} {...p}>{children}</h4>
    ),
    p: ({ children, ...p }) => <p className="my-4 text-[15px] leading-7 text-white/85" {...p}>{children}</p>,
    a: ({ children, href }) => {
      const value = typeof href === "string" ? href : "";
      const cls = "text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white";
      return (
        <a
          href={value || undefined}
          className={cls}
          {...(isExternal(value) && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </a>
      );
    },
    strong: ({ children, ...p }) => <strong className="font-semibold text-white" {...p}>{children}</strong>,
    em: ({ children, ...p }) => <em className="italic" {...p}>{children}</em>,
    ul: ({ children, ...p }) => <ul className="my-4 ml-6 list-disc space-y-1.5 text-white/85" {...p}>{children}</ul>,
    ol: ({ children, ...p }) => <ol className="my-4 ml-6 list-decimal space-y-1.5 text-white/85" {...p}>{children}</ol>,
    li: ({ children, ...p }) => <li className="text-[15px] leading-7" {...p}>{children}</li>,
    blockquote: ({ children, ...p }) => (
      <blockquote className="my-5 border-l-2 border-white/30 pl-4 italic text-white/60" {...p}>{children}</blockquote>
    ),
    code: ({ children, className: cls, node, ...p }) => {
      const text = String(children).replace(/\n$/, "");
      const multiline =
        node?.position?.start.line !== undefined &&
        node.position.end.line !== undefined &&
        node.position.start.line !== node.position.end.line;
      const block = cls?.includes("language-") || multiline;
      if (block) {
        return <code className={`block font-mono text-[13px] leading-6 text-white/90 ${cls ?? ""}`} {...p}>{text}</code>;
      }
      return <code className="border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-white" {...p}>{children}</code>;
    },
    pre: PreBlock,
    table: ({ children, ...p }) => (
      <div className="my-5 overflow-x-auto">
        <table className="w-full border-collapse border border-white/10 text-sm" {...p}>{children}</table>
      </div>
    ),
    th: ({ children, ...p }) => <th className="border border-white/10 bg-white/[0.04] px-4 py-2 text-left font-semibold text-white" {...p}>{children}</th>,
    td: ({ children, ...p }) => <td className="border border-white/10 px-4 py-2 text-white/85" {...p}>{children}</td>,
    hr: (p) => <hr className="my-10 border-white/10" {...p} />,
    img: ({ src, alt, ...p }) => {
      const s = typeof src === "string" ? src : "";
      const resolved = s && imageBaseUrl && !isResolved(s) ? `${imageBaseUrl}/${s.replace(/^\.\//, "")}` : s;
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={resolved} alt={alt || ""} loading="lazy" className="my-5 max-w-full border border-white/10" {...p} />;
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
