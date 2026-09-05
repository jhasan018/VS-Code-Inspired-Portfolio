"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  ListBulletIcon, 
  NumberedListIcon,
  PhotoIcon, 
  CodeBracketIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { useRef, useState, useEffect } from "react";
import { uploadImage } from "@/lib/supabase/storage";
import toast from "react-hot-toast";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: Props) {
  const [isCodeView, setIsCodeView] = useState(false);
  const [codeValue, setCodeValue] = useState(content);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setCodeValue(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose-vsc-editor focus:outline-none min-h-[300px] p-4',
      },
    },
    immediatelyRender: false,
  });

  // Keep codeValue in sync if content changes from outside (e.g. initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setCodeValue(content);
    }
  }, [content, editor]);

  const toggleView = () => {
    if (isCodeView) {
      // Switching back to Visual
      editor?.commands.setContent(codeValue);
    }
    setIsCodeView(!isCodeView);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCodeValue(val);
    onChange(val);
  };

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const alt = window.prompt(
      "Describe what this image communicates for someone who cannot see it:",
    )?.trim();
    if (!alt) {
      toast.error("Image alt text is required");
      e.target.value = "";
      return;
    }
    
    const loadingToast = toast.loading("Uploading image...");
    try {
      const url = await uploadImage(file);
      if (url) {
        editor?.chain().focus().setImage({ src: url, alt }).run();
        toast.success("Image added!", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Upload failed", { id: loadingToast });
    }
  };

  if (!editor) return null;

  const MenuButton = ({ onClick, active, children, title, disabled }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        padding: '6px 10px',
        borderRadius: '4px',
        background: active ? 'var(--vsc-accent)' : 'transparent',
        color: active ? '#fff' : (disabled ? '#444' : 'var(--vsc-text-dim)'),
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        minWidth: '32px',
      }}
      className={!disabled ? "hover:bg-vsc-bg-alt" : ""}
    >
      {children}
    </button>
  );

  return (
    <div style={{ 
      border: '1px solid var(--vsc-border)', 
      borderRadius: '8px', 
      overflow: 'hidden',
      background: 'var(--vsc-bg)',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px', 
        borderBottom: '1px solid var(--vsc-border)',
        background: 'var(--vsc-bg-alt)',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive('bold')}
            disabled={isCodeView}
            title="Bold"
          >
            B
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive('italic')}
            disabled={isCodeView}
            title="Italic"
          >
            I
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            active={editor.isActive('heading', { level: 1 })}
            disabled={isCodeView}
            title="H1"
          >
            H1
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            active={editor.isActive('heading', { level: 2 })}
            disabled={isCodeView}
            title="H2"
          >
            H2
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            active={editor.isActive('bulletList')}
            disabled={isCodeView}
            title="Bullet List"
          >
            <ListBulletIcon style={{ width: 18 }} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            active={editor.isActive('orderedList')}
            disabled={isCodeView}
            title="Ordered List"
          >
            <NumberedListIcon style={{ width: 18 }} />
          </MenuButton>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--vsc-border)', margin: '0 8px' }} />

          <MenuButton 
            onClick={() => fileInputRef.current?.click()}
            disabled={isCodeView}
            title="Insert Image"
          >
            <PhotoIcon style={{ width: 18 }} />
          </MenuButton>
        </div>

        <button
          type="button"
          onClick={toggleView}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '4px',
            background: isCodeView ? 'var(--vsc-accent)' : 'var(--vsc-bg)',
            color: '#fff',
            border: '1px solid var(--vsc-border)',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {isCodeView ? (
            <><EyeIcon style={{ width: 14 }} /> Visual View</>
          ) : (
            <><CodeBracketIcon style={{ width: 14 }} /> Code View</>
          )}
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={addImage}
        />
      </div>

      {isCodeView ? (
        <textarea
          value={codeValue}
          onChange={handleCodeChange}
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '16px',
            background: '#1e1e1e',
            color: '#d4d4d4',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.6',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder="Paste your HTML here..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      <style jsx global>{`
        .prose-vsc-editor {
          color: var(--vsc-text);
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.6;
          outline: none;
        }
        .prose-vsc-editor .tiptap {
          outline: none !important;
        }
        .prose-vsc-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--vsc-text-dim);
          pointer-events: none;
          height: 0;
        }
        .prose-vsc-editor h1 { font-size: 1.8em; font-weight: 700; color: #fff; margin: 0.5em 0; }
        .prose-vsc-editor h2 { font-size: 1.4em; font-weight: 600; color: #fff; margin: 0.5em 0; }
        .prose-vsc-editor ul { list-style: disc; padding-left: 1.5em; margin: 1em 0; }
        .prose-vsc-editor ol { list-style: decimal; padding-left: 1.5em; margin: 1em 0; }
        .editor-image {
          max-width: 100%;
          border-radius: 8px;
          border: 1px solid var(--vsc-border);
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
}
