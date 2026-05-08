import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useCallback } from 'react';

const COLORS = [
  '#000000', '#374151', '#6b7280', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
];

const HIGHLIGHTS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff',
  '#fed7aa', '#f0fdf4', '#fdf4ff',
];

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        padding: '4px 8px',
        border: '1px solid',
        borderColor: active ? '#1f2937' : '#d1d5db',
        borderRadius: '4px',
        background: active ? '#1f2937' : '#fff',
        color: active ? '#fff' : '#374151',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: active ? '700' : '400',
        lineHeight: '1.2',
        minWidth: '28px',
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span style={{ width: '1px', background: '#d1d5db', margin: '0 4px', alignSelf: 'stretch' }} />;
}

function Toolbar({ editor }) {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center',
      padding: '8px', borderBottom: '1px solid #d1d5db',
      background: '#f9fafb', borderRadius: '6px 6px 0 0',
    }}>
      {/* Headings */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">H1</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarButton>
      <Divider />

      {/* Inline styles */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><b>B</b></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><i>I</i></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><u>U</u></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarButton>
      <Divider />

      {/* Lists */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">• List</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">1. List</ToolbarButton>
      <Divider />

      {/* Align */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">≡L</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">≡C</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">≡R</ToolbarButton>
      <Divider />

      {/* Blockquote & Code */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">"</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">{`</>`}</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">{ `{ }` }</ToolbarButton>
      <Divider />

      {/* Link */}
      <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Add link">🔗</ToolbarButton>
      <Divider />

      {/* Text color swatches */}
      <span style={{ fontSize: '11px', color: '#6b7280', alignSelf: 'center' }}>Color:</span>
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(color).run(); }}
          title={color}
          style={{
            width: '20px', height: '20px', borderRadius: '3px',
            background: color, border: editor.isActive('textStyle', { color }) ? '2px solid #000' : '1px solid #9ca3af',
            cursor: 'pointer', padding: 0,
          }}
        />
      ))}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
        title="Remove color"
        style={{ fontSize: '11px', cursor: 'pointer', background: 'none', border: '1px solid #d1d5db', borderRadius: '3px', padding: '2px 5px', color: '#374151' }}
      >✕</button>
      <Divider />

      {/* Highlight swatches */}
      <span style={{ fontSize: '11px', color: '#6b7280', alignSelf: 'center' }}>Highlight:</span>
      {HIGHLIGHTS.map((color) => (
        <button
          key={color}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight({ color }).run(); }}
          title={color}
          style={{
            width: '20px', height: '20px', borderRadius: '3px',
            background: color, border: editor.isActive('highlight', { color }) ? '2px solid #000' : '1px solid #9ca3af',
            cursor: 'pointer', padding: 0,
          }}
        />
      ))}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); }}
        title="Remove highlight"
        style={{ fontSize: '11px', cursor: 'pointer', background: 'none', border: '1px solid #d1d5db', borderRadius: '3px', padding: '2px 5px', color: '#374151' }}
      >✕</button>
      <Divider />

      {/* Undo / Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolbarButton>
    </div>
  );
}

function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. when editing an existing guide)
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  return (
    <div style={{
      border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden',
      fontFamily: 'inherit',
    }}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        style={{ minHeight: '320px', padding: '12px 16px', outline: 'none', fontSize: '15px', lineHeight: '1.7' }}
      />
    </div>
  );
}

export default RichTextEditor;
