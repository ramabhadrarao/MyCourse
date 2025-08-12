// src/components/Course/ContentEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, Code, Type, Video, FileText, Table, Plus, Trash2, Image, Link, Copy, ClipboardPaste } from 'lucide-react';
import ReactQuill from 'react-quill';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

interface Content {
  _id?: string;
  title: string;
  type: 'text' | 'code' | 'video' | 'pdf' | 'table' | 'image' | 'link';
  data: any;
  order: number;
}

interface ContentEditorProps {
  topicId: string;
  content?: Content;
  onSave: (topicId: string, content: Content) => void;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  topicId,
  content,
  onSave,
  onCancel,
}) => {
  const [contentData, setContentData] = useState<Content>({
    title: '',
    type: 'text',
    data: {},
    order: 1,
    ...content,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pasteAreaRef = useRef<HTMLTextAreaElement>(null);

  const contentTypes = [
    { value: 'text', label: 'Rich Text', icon: Type },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'table', label: 'Table', icon: Table },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'link', label: 'External Link', icon: Link },
  ];

  const codeLanguages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 
    'html', 'css', 'php', 'ruby', 'go', 'rust', 'sql', 'jsx', 'tsx'
  ];

  const tableStyles = [
    { value: 'default', label: 'Default' },
    { value: 'striped', label: 'Striped Rows' },
    { value: 'bordered', label: 'Bordered' },
  ];

  // Quill modules configuration with all formatting options
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  // Quill formats
  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'check', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  useEffect(() => {
    // Initialize data based on content type
    if (!content || !content.data) {
      switch (contentData.type) {
        case 'text':
          setContentData(prev => ({ ...prev, data: { text: prev.data?.text || '' } }));
          break;
        case 'code':
          setContentData(prev => ({ 
            ...prev, 
            data: { 
              language: prev.data?.language || 'javascript', 
              code: prev.data?.code || '' 
            } 
          }));
          break;
        case 'video':
          setContentData(prev => ({ 
            ...prev, 
            data: { 
              url: prev.data?.url || '', 
              duration: prev.data?.duration || 0 
            } 
          }));
          break;
        case 'pdf':
          setContentData(prev => ({ 
            ...prev, 
            data: { 
              filename: prev.data?.filename || '', 
              originalName: prev.data?.originalName || '', 
              size: prev.data?.size || 0 
            } 
          }));
          break;
        case 'table':
          setContentData(prev => ({ 
            ...prev, 
            data: { 
              headers: prev.data?.headers || ['Column 1', 'Column 2'],
              rows: prev.data?.rows || [['', '']],
              style: prev.data?.style || 'default'
            } 
          }));
          break;
        case 'image':
          setContentData(prev => ({ 
            ...prev, 
            data: { 
              filename: prev.data?.filename || '', 
              originalName: prev.data?.originalName || '', 
              size: prev.data?.size || 0,
              url: prev.data?.url || '',
              alt: prev.data?.alt || '',
              caption: prev.data?.caption || ''
            } 
          }));
          break;
        case 'link':
          setContentData(prev => ({ 
            ...prev, 
            data: { 
              url: prev.data?.url || '',
              title: prev.data?.title || '',
              description: prev.data?.description || '',
              openInNewTab: prev.data?.openInNewTab !== false
            } 
          }));
          break;
      }
    } else if (content) {
      // Map backend data structure to frontend
      let mappedData = {};
      
      switch (content.type) {
        case 'text':
          mappedData = { text: content.data.text || '' };
          break;
        case 'code':
          mappedData = content.data.code || { language: 'javascript', code: '' };
          break;
        case 'video':
          mappedData = content.data.video || { url: '', duration: 0 };
          break;
        case 'pdf':
          mappedData = content.data.pdf || { filename: '', originalName: '', size: 0 };
          break;
        case 'table':
          mappedData = content.data.table || { headers: ['Column 1', 'Column 2'], rows: [['', '']], style: 'default' };
          break;
        case 'image':
          mappedData = content.data.image || { filename: '', originalName: '', size: 0, url: '', alt: '', caption: '' };
          break;
        case 'link':
          mappedData = content.data.link || { url: '', title: '', description: '', openInNewTab: true };
          break;
      }
      
      setContentData(prev => ({
        ...prev,
        data: mappedData
      }));
    }
  }, [contentData.type]);

  const handleSave = async () => {
    if (!contentData.title.trim()) {
      toast.error('Please enter a content title');
      return;
    }

    // Validate content based on type
    if (contentData.type === 'text' && !contentData.data.text?.trim()) {
      toast.error('Please add some content');
      return;
    }

    // Validate table data
    if (contentData.type === 'table') {
      if (!contentData.data.headers || contentData.data.headers.length === 0) {
        toast.error('Please add at least one column header');
        return;
      }
      if (!contentData.data.rows || contentData.data.rows.length === 0) {
        toast.error('Please add at least one row');
        return;
      }
      
      // Ensure all rows have the same number of columns as headers
      const numCols = contentData.data.headers.length;
      const validRows = contentData.data.rows.map((row: string[]) => {
        const newRow = [...row];
        while (newRow.length < numCols) {
          newRow.push('');
        }
        return newRow.slice(0, numCols);
      });
      
      contentData.data.rows = validRows;
    }

    setLoading(true);

    try {
      const endpoint = contentData._id 
        ? `${API_URL}/content/${contentData._id}`
        : `${API_URL}/content`;
      
      const method = contentData._id ? 'put' : 'post';
      
      const payload = {
        title: contentData.title,
        type: contentData.type,
        data: contentData.data,
        topicId: contentData._id ? undefined : topicId,
        order: contentData.order,
      };

      const response = await axios[method](endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      onSave(topicId, response.data.content);
      toast.success(`Content ${contentData._id ? 'updated' : 'created'} successfully`);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = {
      pdf: 'application/pdf',
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    };

    if (contentData.type === 'pdf' && file.type !== validTypes.pdf) {
      toast.error('Please select a PDF file');
      return;
    }

    if (contentData.type === 'image' && !validTypes.image.includes(file.type)) {
      toast.error('Please select an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/content/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (contentData.type === 'pdf') {
        setContentData(prev => ({
          ...prev,
          data: {
            filename: response.data.file.filename,
            originalName: response.data.file.originalName,
            size: response.data.file.size,
            url: response.data.file.url
          },
        }));
      } else if (contentData.type === 'image') {
        setContentData(prev => ({
          ...prev,
          data: {
            ...prev.data,
            filename: response.data.file.filename,
            originalName: response.data.file.originalName,
            size: response.data.file.size,
            url: response.data.file.url
          },
        }));
      }

      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Parse pasted table data
  const parsePastedTable = (pastedData: string) => {
    // Split by lines
    const lines = pastedData.trim().split(/\r?\n/);
    if (lines.length === 0) return null;

    // Try to detect delimiter (tab, comma, or pipe)
    const delimiters = ['\t', ',', '|'];
    let delimiter = '\t'; // Default to tab
    
    // Check first line for most common delimiter
    for (const d of delimiters) {
      if (lines[0].includes(d)) {
        delimiter = d;
        break;
      }
    }

    // Parse rows
    const rows = lines.map(line => {
      // Handle pipe delimiter with optional spaces
      if (delimiter === '|') {
        return line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
      }
      return line.split(delimiter).map(cell => cell.trim());
    });

    // Filter out empty rows
    const filteredRows = rows.filter(row => row.length > 0 && row.some(cell => cell !== ''));

    if (filteredRows.length === 0) return null;

    // First row as headers
    const headers = filteredRows[0];
    const dataRows = filteredRows.slice(1);

    // Ensure all rows have same number of columns
    const colCount = headers.length;
    const normalizedRows = dataRows.map(row => {
      const newRow = [...row];
      while (newRow.length < colCount) {
        newRow.push('');
      }
      return newRow.slice(0, colCount);
    });

    return {
      headers,
      rows: normalizedRows.length > 0 ? normalizedRows : [['']]
    };
  };

  // Handle paste for table
  const handleTablePaste = () => {
    navigator.clipboard.readText().then(text => {
      const tableData = parsePastedTable(text);
      if (tableData) {
        setContentData(prev => ({
          ...prev,
          data: {
            ...prev.data,
            headers: tableData.headers,
            rows: tableData.rows
          }
        }));
        toast.success('Table data pasted successfully');
      } else {
        toast.error('Could not parse table data. Please check the format.');
      }
    }).catch(err => {
      toast.error('Failed to read clipboard');
    });
  };

  // Table manipulation functions
  const addColumn = () => {
    const newHeaders = [...(contentData.data.headers || []), `Column ${(contentData.data.headers?.length || 0) + 1}`];
    const newRows = (contentData.data.rows || [[]]).map((row: string[]) => [...row, '']);
    
    setContentData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        headers: newHeaders,
        rows: newRows
      }
    }));
  };

  const removeColumn = (index: number) => {
    if (!contentData.data.headers || contentData.data.headers.length <= 1) {
      toast.error('Table must have at least one column');
      return;
    }

    const newHeaders = contentData.data.headers.filter((_: string, i: number) => i !== index);
    const newRows = (contentData.data.rows || []).map((row: string[]) => 
      row.filter((_: string, i: number) => i !== index)
    );
    
    setContentData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        headers: newHeaders,
        rows: newRows
      }
    }));
  };

  const addRow = () => {
    const numCols = contentData.data.headers?.length || 2;
    const newRow = new Array(numCols).fill('');
    
    setContentData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        headers: prev.data.headers || ['Column 1', 'Column 2'],
        rows: [...(prev.data.rows || []), newRow]
      }
    }));
  };

  const removeRow = (index: number) => {
    if (!contentData.data.rows || contentData.data.rows.length <= 1) {
      toast.error('Table must have at least one row');
      return;
    }

    const newRows = contentData.data.rows.filter((_: string[], i: number) => i !== index);
    
    setContentData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        rows: newRows
      }
    }));
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...(contentData.data.headers || [])];
    newHeaders[index] = value;
    
    setContentData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        headers: newHeaders
      }
    }));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...(contentData.data.rows || [])];
    if (newRows[rowIndex]) {
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = value;
    }
    
    setContentData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        rows: newRows
      }
    }));
  };

  const renderContentEditor = () => {
    switch (contentData.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="min-h-[400px]">
              <ReactQuill
                theme="snow"
                value={contentData.data.text || ''}
                onChange={(value) =>
                  setContentData(prev => ({
                    ...prev,
                    data: { text: value },
                  }))
                }
                modules={quillModules}
                formats={quillFormats}
                className="h-full"
                style={{ minHeight: '350px' }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-12 pt-4">
              <p>• Use the toolbar above to format your text (bold, italic, lists, etc.)</p>
              <p>• All formatting will be preserved when saving</p>
              <p>• You can paste formatted content from other sources</p>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <select
                value={contentData.data.language || 'javascript'}
                onChange={(e) =>
                  setContentData(prev => ({
                    ...prev,
                    data: { ...prev.data, language: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {codeLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <Editor
                  height="300px"
                  language={contentData.data.language || 'javascript'}
                  value={contentData.data.code || ''}
                  onChange={(value) =>
                    setContentData(prev => ({
                      ...prev,
                      data: { ...prev.data, code: value || '' },
                    }))
                  }
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={contentData.data.url || ''}
                onChange={(e) => {
                  const url = e.target.value;
                  const videoId = extractVideoId(url);
                  setContentData(prev => ({
                    ...prev,
                    data: { ...prev.data, url, videoId },
                  }));
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {contentData.data.url && extractVideoId(contentData.data.url) && (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(contentData.data.url)}`}
                  title="Video preview"
                  className="w-full h-full rounded-md"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF File
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && (
                  <div className="text-sm text-gray-500">Uploading...</div>
                )}
              </div>
            </div>
            {contentData.data.originalName && (
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">{contentData.data.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {(contentData.data.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && (
                  <div className="text-sm text-gray-500">Uploading...</div>
                )}
              </div>
            </div>
            
            {contentData.data.url && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <img
                    src={contentData.data.url}
                    alt={contentData.data.alt || 'Preview'}
                    className="max-w-full h-auto rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={contentData.data.alt || ''}
                    onChange={(e) =>
                      setContentData(prev => ({
                        ...prev,
                        data: { ...prev.data, alt: e.target.value },
                      }))
                    }
                    placeholder="Describe the image..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (optional)
                  </label>
                  <input
                    type="text"
                    value={contentData.data.caption || ''}
                    onChange={(e) =>
                      setContentData(prev => ({
                        ...prev,
                        data: { ...prev.data, caption: e.target.value },
                      }))
                    }
                    placeholder="Add a caption..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Link URL
              </label>
              <input
                type="url"
                value={contentData.data.url || ''}
                onChange={(e) =>
                  setContentData(prev => ({
                    ...prev,
                    data: { ...prev.data, url: e.target.value },
                  }))
                }
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Title
              </label>
              <input
                type="text"
                value={contentData.data.title || ''}
                onChange={(e) =>
                  setContentData(prev => ({
                    ...prev,
                    data: { ...prev.data, title: e.target.value },
                  }))
                }
                placeholder="Enter link title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={contentData.data.description || ''}
                onChange={(e) =>
                  setContentData(prev => ({
                    ...prev,
                    data: { ...prev.data, description: e.target.value },
                  }))
                }
                placeholder="Brief description of the link..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="openInNewTab"
                checked={contentData.data.openInNewTab !== false}
                onChange={(e) =>
                  setContentData(prev => ({
                    ...prev,
                    data: { ...prev.data, openInNewTab: e.target.checked },
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="openInNewTab" className="ml-2 text-sm text-gray-700">
                Open in new tab
              </label>
            </div>
          </div>
        );

      case 'table':
        const tableData = contentData.data || { headers: ['Column 1', 'Column 2'], rows: [['', '']], style: 'default' };
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Table Editor
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={tableData.style || 'default'}
                  onChange={(e) =>
                    setContentData(prev => ({
                      ...prev,
                      data: { ...prev.data, style: e.target.value },
                    }))
                  }
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tableStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleTablePaste}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  title="Paste table from Excel, Word, or HTML"
                >
                  <ClipboardPaste className="h-4 w-4 inline mr-1" />
                  Paste Table
                </button>
                <button
                  type="button"
                  onClick={addColumn}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add Column
                </button>
                <button
                  type="button"
                  onClick={addRow}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add Row
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto border border-gray-300 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {tableData.headers?.map((header: string, index: number) => (
                      <th key={index} className="px-3 py-2 relative group">
                        <input
                          type="text"
                          value={header || ''}
                          onChange={(e) => updateHeader(index, e.target.value)}
                          className="w-full px-2 py-1 text-sm font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          placeholder="Header"
                        />
                        {tableData.headers.length > 1 && (
                          <button
                            onClick={() => removeColumn(index)}
                            className="absolute top-0 right-0 p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.rows?.map((row: string[], rowIndex: number) => (
                    <tr key={rowIndex} className="group">
                      {row.map((cell: string, colIndex: number) => (
                        <td key={colIndex} className="px-3 py-2">
                          <input
                            type="text"
                            value={cell || ''}
                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                            className="w-full px-2 py-1 text-sm text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                            placeholder="Cell value"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2">
                        {tableData.rows.length > 1 && (
                          <button
                            onClick={() => removeRow(rowIndex)}
                            className="p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>• Click on any cell to edit its content</p>
              <p>• Use "Paste Table" to paste from Excel, Word, or HTML (tab or comma separated)</p>
              <p>• Supported formats: Tab-separated, Comma-separated (CSV), Pipe-separated</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {content ? 'Edit Content' : 'Add New Content'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-6">
            {/* Content Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Title
              </label>
              <input
                type="text"
                value={contentData.title}
                onChange={(e) =>
                  setContentData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter content title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setContentData(prev => ({ ...prev, type: type.value as any }))
                      }
                      className={`p-3 border rounded-md flex flex-col items-center space-y-2 transition-colors ${
                        contentData.type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Editor */}
            {renderContentEditor()}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;