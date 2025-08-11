import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Code, Type, Video, FileText } from 'lucide-react';
import ReactQuill from 'react-quill';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

interface Content {
  _id?: string;
  title: string;
  type: 'text' | 'code' | 'video' | 'pdf';
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
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const contentTypes = [
    { value: 'text', label: 'Rich Text', icon: Type },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'pdf', label: 'PDF', icon: FileText },
  ];

  const codeLanguages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 
    'html', 'css', 'php', 'ruby', 'go', 'rust', 'sql'
  ];

  useEffect(() => {
    // Initialize data based on content type
    if (!content) {
      switch (contentData.type) {
        case 'text':
          setContentData(prev => ({ ...prev, data: { text: '' } }));
          break;
        case 'code':
          setContentData(prev => ({ ...prev, data: { language: 'javascript', code: '' } }));
          break;
        case 'video':
          setContentData(prev => ({ ...prev, data: { url: '', duration: 0 } }));
          break;
        case 'pdf':
          setContentData(prev => ({ ...prev, data: { filename: '', originalName: '', size: 0 } }));
          break;
      }
    }
  }, [contentData.type, content]);

  const handleSave = async () => {
    if (!contentData.title.trim()) {
      toast.error('Please enter a content title');
      return;
    }

    setLoading(true);

    try {
      const endpoint = contentData._id 
        ? `http://localhost:5000/api/content/${contentData._id}`
        : 'http://localhost:5000/api/content';
      
      const method = contentData._id ? 'put' : 'post';
      
      const payload = {
        title: contentData.title,
        type: contentData.type,
        data: contentData.data,
        topicId,
        order: contentData.order,
      };

      const response = await axios[method](endpoint, payload);
      
      onSave(topicId, response.data.content);
      toast.success(`Content ${contentData._id ? 'updated' : 'created'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post('http://localhost:5000/api/content/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setContentData(prev => ({
        ...prev,
        data: {
          filename: response.data.file.filename,
          originalName: response.data.file.originalName,
          size: response.data.file.size,
        },
      }));

      toast.success('PDF uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderContentEditor = () => {
    switch (contentData.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <ReactQuill
              theme="snow"
              value={contentData.data.text || ''}
              onChange={(value) =>
                setContentData(prev => ({
                  ...prev,
                  data: { ...prev.data, text: value },
                }))
              }
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['blockquote', 'code-block'],
                  ['link'],
                  ['clean'],
                ],
              }}
              style={{ height: '300px' }}
            />
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
                  onChange={handlePdfUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadingPdf && (
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

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
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
        <div className="p-6 max-h-96 overflow-y-auto">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{type.label}</span>
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
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