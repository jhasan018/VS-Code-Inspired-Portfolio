-- Fix axe-core image-alt violations in legacy rich-text blog content.
-- Safe to run repeatedly in the Supabase SQL editor.

UPDATE blogs
SET content = replace(
  replace(
    replace(
      content,
      '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1778705263361-context-stuffing-1.webp"/>',
      '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1778705263361-context-stuffing-1.webp" alt="Context stuffing workflow from database or JSON through prompt serialization to an LLM answer"/>'
    ),
    '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1778705292419-context-stuffing-2.webp"/>',
    '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1778705292419-context-stuffing-2.webp" alt="Context stuffing code example with benefits and limitations including token usage and cost"/>'
  ),
  '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1778705325398-context-stuffing-3.webp"/>',
  '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1778705325398-context-stuffing-3.webp" alt="Comparison of language models and their context-window sizes for context stuffing"/>'
), updated_at = NOW()
WHERE slug = 'context-stuffing-everything-you-need-to-know';

UPDATE blogs
SET content = replace(
  content,
  '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1779393611232-Screenshot-(1).png"/>',
  '<img class="editor-image" src="https://pxlgiqfrfsyyfmatcdkh.supabase.co/storage/v1/object/public/portfolio/1779393611232-Screenshot-(1).png" alt="Python example generating sentence embeddings and comparing cosine similarity scores"/>'
), updated_at = NOW()
WHERE slug = 'what-are-llm-embeddings-a-beginners-guide-to-how-ai-understands-language';
