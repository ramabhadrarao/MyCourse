import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ContentEditor from '../../components/Course/ContentEditor';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  published: boolean;
  topics: Topic[];
}

interface Topic {
  _id: string;
  title: string;
  order: number;
  contents: Content[];
}

interface Content {
  _id: string;
  title: string;
  type: 'text' | 'code' | 'video' | 'pdf';
  data: any;
  order: number;
}

const EditCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<{ topicId: string; content?: Content } | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      toast.error('Failed to fetch course');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (updates: Partial<Course>) => {
    try {
      await axios.put(`http://localhost:5000/api/courses/${id}`, updates);
      setCourse(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Course updated successfully');
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const createTopic = async () => {
    if (!newTopicTitle.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/content/topics', {
        title: newTopicTitle,
        courseId: id,
        order: (course?.topics?.length || 0) + 1
      });
      
      const newTopic = response.data.topic;
      setCourse(prev => prev ? {
        ...prev,
        topics: [...prev.topics, { ...newTopic, contents: [] }]
      } : null);
      
      setNewTopicTitle('');
      toast.success('Topic created successfully');
    } catch (error) {
      toast.error('Failed to create topic');
    }
  };

  const updateTopic = async (topicId: string, title: string) => {
    try {
      await axios.put(`http://localhost:5000/api/content/topics/${topicId}`, { title });
      
      setCourse(prev => prev ? {
        ...prev,
        topics: prev.topics.map(topic => 
          topic._id === topicId ? { ...topic, title } : topic
        )
      } : null);
      
      setEditingTopic(null);
      toast.success('Topic updated successfully');
    } catch (error) {
      toast.error('Failed to update topic');
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!window.confirm('Are you sure? This will delete the topic and all its contents.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/content/topics/${topicId}`);
      
      setCourse(prev => prev ? {
        ...prev,
        topics: prev.topics.filter(topic => topic._id !== topicId)
      } : null);
      
      toast.success('Topic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const handleContentSaved = (topicId: string, content: Content) => {
    setCourse(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        topics: prev.topics.map(topic => {
          if (topic._id === topicId) {
            const existingIndex = topic.contents.findIndex(c => c._id === content._id);
            if (existingIndex >= 0) {
              // Update existing content
              const updatedContents = [...topic.contents];
              updatedContents[existingIndex] = content;
              return { ...topic, contents: updatedContents };
            } else {
              // Add new content
              return { ...topic, contents: [...topic.contents, content] };
            }
          }
          return topic;
        })
      };
    });
    
    setShowContentEditor(false);
    setEditingContent(null);
  };

  const deleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/content/${contentId}`);
      
      setCourse(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          topics: prev.topics.map(topic => ({
            ...topic,
            contents: topic.contents.filter(content => content._id !== contentId)
          }))
        };
      });
      
      toast.success('Content deleted successfully');
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">Edit course content and structure</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateCourse({ published: !course.published })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  course.published
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {course.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Topics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
              </div>
              
              <div className="p-6">
                {/* Add New Topic */}
                <div className="flex items-center space-x-3 mb-6">
                  <input
                    type="text"
                    placeholder="Enter topic title"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={createTopic}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </button>
                </div>

                {/* Topics List */}
                <div className="space-y-4">
                  {course.topics.map((topic, topicIndex) => (
                    <div key={topic._id} className="border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        {editingTopic === topic._id ? (
                          <div className="flex-1 flex items-center space-x-2">
                            <input
                              type="text"
                              defaultValue={topic.title}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateTopic(topic._id, e.currentTarget.value);
                                }
                              }}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => setEditingTopic(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium text-gray-900">
                              {topicIndex + 1}. {topic.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingTopic(topic._id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteTopic(topic._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="p-4">
                        {/* Content List */}
                        <div className="space-y-2 mb-4">
                          {topic.contents.map((content, contentIndex) => (
                            <div
                              key={content._id}
                              className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">
                                  {contentIndex + 1}.
                                </span>
                                <span className="font-medium">{content.title}</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {content.type}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingContent({ topicId: topic._id, content });
                                    setShowContentEditor(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteContent(content._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Add Content Button */}
                        <button
                          onClick={() => {
                            setEditingContent({ topicId: topic._id });
                            setShowContentEditor(true);
                          }}
                          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                          <Plus className="h-4 w-4 mx-auto mb-1" />
                          Add Content
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {course.topics.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="mx-auto h-12 w-12 mb-4" />
                    <p>No topics added yet. Create your first topic to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={() => updateCourse({
                    title: course.title,
                    description: course.description,
                    price: course.price
                  })}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Editor Modal */}
      {showContentEditor && editingContent && (
        <ContentEditor
          topicId={editingContent.topicId}
          content={editingContent.content}
          onSave={handleContentSaved}
          onCancel={() => {
            setShowContentEditor(false);
            setEditingContent(null);
          }}
        />
      )}
    </div>
  );
};

export default EditCourse;