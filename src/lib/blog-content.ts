const legacyImageAlts: Record<string, string> = {
  "1778705263361-context-stuffing-1.webp":
    "Context stuffing workflow from database or JSON through prompt serialization to an LLM answer",
  "1778705292419-context-stuffing-2.webp":
    "Context stuffing code example with benefits and limitations including token usage and cost",
  "1778705325398-context-stuffing-3.webp":
    "Comparison of language models and their context-window sizes for context stuffing",
  "1779393611232-Screenshot-(1).png":
    "Python example generating sentence embeddings and comparing cosine similarity scores",
};

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function ensureBlogImageAlts(html: string, articleTitle: string) {
  const cleanTitle = articleTitle.replace(/<[^>]*>/g, "").trim();

  const withAccessibleImages = html.replace(/<img\b[^>]*>/gi, (imageTag) => {
    let enhancedTag = imageTag;
    const attributes = [
      ["alt", null],
      ["width", "1200"],
      ["height", "630"],
      ["loading", "lazy"],
      ["decoding", "async"],
    ] as const;

    const src = imageTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || "";
    const filename = src.split("/").pop() || "";
    const alt = legacyImageAlts[filename] || `Illustration for ${cleanTitle}`;

    for (const [attribute, defaultValue] of attributes) {
      if (new RegExp(`\\b${attribute}\\s*=`, "i").test(enhancedTag)) continue;
      const value = attribute === "alt" ? escapeAttribute(alt) : defaultValue;
      enhancedTag = enhancedTag.replace(/^<img\b/i, `<img ${attribute}="${value}"`);
    }

    return enhancedTag;
  });

  // Rich-text editors can produce skipped heading levels. Articles already have
  // an h1, so keep body headings to a predictable h2/h3 hierarchy.
  return withAccessibleImages
    .replace(/<h[3-6](\b[^>]*)>/gi, "<h2$1>")
    .replace(/<\/h[3-6]>/gi, "</h2>");
}
