import Image from "next/image";
import parse, { Element, type HTMLReactParserOptions } from "html-react-parser";
import { ensureBlogImageAlts } from "@/lib/blog-content";

interface BlogContentProps {
  html: string;
  articleTitle: string;
}

export default function BlogContent({ html, articleTitle }: BlogContentProps) {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element) || node.name !== "img") return;

      const { src, alt = "", width, height, class: className } = node.attribs;
      if (!src) return <></>;

      return (
        <Image
          src={src}
          alt={alt}
          width={Number(width) || 1200}
          height={Number(height) || 630}
          sizes="(max-width: 768px) 100vw, 900px"
          className={className}
          style={{ width: "100%", height: "auto" }}
        />
      );
    },
  };

  return <>{parse(ensureBlogImageAlts(html, articleTitle), options)}</>;
}
