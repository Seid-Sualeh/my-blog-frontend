import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdown-editor.css';

const MarkdownEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your content in Markdown...', 
  className = '',
  showPreview = true,
  height = '400px'
}) => {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [isPreviewOpen, setIsPreviewOpen] = useState(showPreview);

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const insertMarkdown = (before, after = '') => {
    const textarea = document.querySelector('.markdown-textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = before + selectedText + after;
      
      if (onChange) {
        onChange(newText);
      }
      
      // Restore cursor position
      setTimeout(() => {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        textarea.focus();
      }, 0);
    }
  };

  const toolbarButtons = [
    {
      icon: 'H1',
      title: 'Heading 1',
      action: () => insertMarkdown('# ', '')
    },
    {
      icon: 'H2',
      title: 'Heading 2', 
      action: () => insertMarkdown('## ', '')
    },
    {
      icon: 'H3',
      title: 'Heading 3',
      action: () => insertMarkdown('### ', '')
    },
    {
      icon: '**',
      title: 'Bold',
      action: () => insertMarkdown('**', '**')
    },
    {
      icon: '*',
      title: 'Italic',
      action: () => insertMarkdown('*', '*')
    },
    {
      icon: '`',
      title: 'Code',
      action: () => insertMarkdown('`', '`')
    },
    {
      icon: '> ',
      title: 'Quote',
      action: () => insertMarkdown('> ', '')
    },
    {
      icon: '- ',
      title: 'List',
      action: () => insertMarkdown('- ', '')
    },
    {
      icon: '1. ',
      title: 'Numbered List',
      action: () => insertMarkdown('1. ', '')
    },
    {
      icon: '[text]',
      title: 'Link',
      action: () => insertMarkdown('[', '](url)')
    },
    {
      icon: '![]',
      title: 'Image',
      action: () => insertMarkdown('![', '](image-url)')
    },
    {
      icon: '---',
      title: 'Horizontal Rule',
      action: () => insertMarkdown('\n---\n', '')
    }
  ];

  return (
    <div className={`markdown-editor ${className}`}>
      <div className="markdown-editor-toolbar">
        <div className="toolbar-section">
          <span className="toolbar-label">Markdown Tools:</span>
          <div className="toolbar-buttons">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                className="toolbar-btn"
                onClick={button.action}
                title={button.title}
                type="button"
              >
                {button.icon}
              </button>
            ))}
          </div>
        </div>
        
        {showPreview && (
          <div className="toolbar-section">
            <div className="tab-toggle">
              <button
                className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveTab('edit')}
                type="button"
              >
                ✏️ Edit
              </button>
              <button
                className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
                type="button"
              >
                👁️ Preview
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="markdown-editor-content">
        {(activeTab === 'edit' || !showPreview) && (
          <textarea
            className="markdown-textarea"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            style={{ height }}
          />
        )}
        
        {activeTab === 'preview' && showPreview && (
          <div className="markdown-preview" style={{ height }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*No content to preview*'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="markdown-help">
        <details className="help-toggle">
          <summary>📖 Markdown Quick Reference</summary>
          <div className="help-content">
            <div className="help-section">
              <h4>Text Formatting</h4>
              <code>**bold**</code> → <strong>bold</strong><br/>
              <code>*italic*</code> → <em>italic</em><br/>
              <code>`code`</code> → <code>code</code>
            </div>
            <div className="help-section">
              <h4>Headings</h4>
              <code># H1</code>, <code>## H2</code>, <code>### H3</code>
            </div>
            <div className="help-section">
              <h4>Lists</h4>
              <code>- item</code> or <code>1. item</code>
            </div>
            <div className="help-section">
              <h4>Links & Images</h4>
              <code>[text](url)</code><br/>
              <code>![alt](image-url)</code>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarkdownEditor;