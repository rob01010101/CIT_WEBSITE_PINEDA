import React, { useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Type,
  Trash2,
} from 'lucide-react';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter announcement content...',
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      onChange('');
    }
  };

  const toggleBold = () => {
    applyFormat('bold');
  };

  const toggleItalic = () => {
    applyFormat('italic');
  };

  const toggleUnorderedList = () => {
    applyFormat('insertUnorderedList');
  };

  const toggleOrderedList = () => {
    applyFormat('insertOrderedList');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button
          className="editor-btn"
          onClick={toggleBold}
          title="Bold (Ctrl+B)"
          type="button"
        >
          <Bold size={18} />
        </button>
        <button
          className="editor-btn"
          onClick={toggleItalic}
          title="Italic (Ctrl+I)"
          type="button"
        >
          <Italic size={18} />
        </button>

        <div className="editor-separator"></div>

        <button
          className="editor-btn"
          onClick={toggleUnorderedList}
          title="Bullet List"
          type="button"
        >
          <List size={18} />
        </button>
        <button
          className="editor-btn"
          onClick={toggleOrderedList}
          title="Numbered List"
          type="button"
        >
          <ListOrdered size={18} />
        </button>

        <div className="editor-separator"></div>

        <button
          className="editor-btn"
          onClick={insertLink}
          title="Insert Link"
          type="button"
        >
          <LinkIcon size={18} />
        </button>

        <div className="editor-separator"></div>

        <button
          className="editor-btn delete-btn"
          onClick={handleClear}
          title="Clear all content"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
      />

      <div className="editor-hint">
        <Type size={14} />
        <small>Use the toolbar above to format your content. Supports bold, italic, lists, and links.</small>
      </div>
    </div>
  );
};

export default RichTextEditor;
