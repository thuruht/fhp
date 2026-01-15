import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import './RichTextEditor.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await res.json();
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <label className="upload-btn">
          IMG
          <input type="file" accept="image/*" onChange={uploadImage} hidden />
        </label>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
