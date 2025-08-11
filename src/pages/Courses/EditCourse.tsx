// src/pages/Courses/EditCourse.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, Edit, Trash2, Save, ChevronRight, ChevronDown, FolderPlus } from 'lucide-react';
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
  parentTopic?: string | null;
  subTopics?: Topic[];
}

interface Content {
  _id: string;
  title: string;
  type: 'text' | 'code' | 'video' | 'pdf' | 'table' | 'image' | 'link';
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
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [creatingSubtopic, setCreatingSubtopic] = useState<string | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(response.data.course);
      
      // Fetch subtopics for each topic
      const topicsWithSubtopics = await Promise.all(
        response.data.course.topics.map(async (topic: Topic) => {
          try {
            const topicResponse = await axios.get(`http://localhost:5000/api/content/topics/${topic._id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            return topicResponse.data.topic;
          } catch (error) {
            return topic;
          }
        })
      );
      
      setCourse({ ...response.data.course, topics: topicsWithSubtopics });
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
        order: (course?.topics?.filter(t => !t.parentTopic).length || 0) + 1
      });
      
      await fetchCourse();
      setNewTopicTitle('');
      toast.success('Topic created successfully');
    } catch (error) {
      toast.error('Failed to create topic');
    }
  };

  const createSubtopic = async (parentTopicId: string) => {
    if (!newSubtopicTitle.trim()) return;
    
    try {
      await axios.post('http://localhost:5000/api/content/topics', {
        title: newSubtopicTitle,
        courseId: id,
        parentTopicId,
        order: 1
      });
      
      await fetchCourse();
      setNewSubtopicTitle('');
      setCreatingSubtopic(null);
      toast.success('Subtopic created successfully');
    } catch (error) {
      toast.error('Failed to create subtopic');
    }
  };

  const updateTopic = async (topicId: string, title: string) => {
    try {
      await axios.put(`http://localhost:5000/api/content/topics/${topicId}`, { title });
      
      await fetchCourse();
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
      
      await fetchCourse();
      toast.success('Topic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const handleContentSaved = async (topicId: string, content: Content) => {
    await fetchCourse();
    setShowContentEditor(false);
    setEditingContent(null);
  };

  const deleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/content/${contentId}`);
      
      await fetchCourse();
      toast.success('Content deleted successfully');
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬';
      case 'code': return '💻';
      case 'pdf': return '📄';
      case 'table': return '📊';
      case 'image': return '🖼️';
      case 'link': return '🔗';
      default: return '📝';
    }
  };

  const renderTopic = (topic: Topic, level: number = 0) => {
    const isExpanded = expandedTopics.has(topic._id);
    const hasSubtopics = topic.subTopics && topic.subTopics.length > 0;
    const isCreatingSubtopic = creatingSubtopic === topic._id;
    
    return (
      <div key={topic._id} className={`${level > 0 ? 'ml-8' : ''} mb-2`}>
        <div className="border border-gray-200 rounded-lg">
          <div className={`px-4 py-3 ${level === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                {(hasSubtopics || topic.contents.length > 0) && (
                  <button
                    onClick={() => toggleTopic(topic._id)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}
                
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
                      onBlur={(e) => updateTopic(topic._id, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingTopic(null)}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className={`font-medium text-gray-900 ${level > 0 ? 'text-sm' : ''}`}>
                    {topic.title}
                    <span className="text-xs text-gray-500 ml-2">
                      ({topic.contents.length} items{hasSubtopics ? `, ${topic.subTopics.length} subtopics` : ''})
                    </span>
                  </h3>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCreatingSubtopic(topic._id)}
                  className="text-green-600 hover:text-green-800"
                  title="Add Subtopic"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>
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
            </div>
            
            {/* Subtopic creation form */}
            {isCreatingSubtopic && (
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter subtopic title"
                  value={newSubtopicTitle}
                  onChange={(e) => setNewSubtopicTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      createSubtopic(topic._id);
                    }
                  }}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => createSubtopic(topic._id)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setCreatingSubtopic(null);
                    setNewSubtopicTitle('');
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {isExpanded && (
            <div className="p-4">
              {/* Content List */}
              {topic.contents.length > 0 && (
                <div className="space-y-2 mb-4">
                  {topic.contents.map((content, contentIndex) => (
                    <div
                      key={content._id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getContentIcon(content.type)}</span>
                        <div>
                          <span className="font-medium text-sm">{content.title}</span>
                          <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {content.type}
                          </span>
                        </div>
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
              )}
              
              {/* Add Content Button */}
              <button
                onClick={() => {
                  setEditingContent({ topicId: topic._id });
                  setShowContentEditor(true);
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </button>
              
              {/* Render subtopics */}
              {hasSubtopics && (
                <div className="mt-4 space-y-2">
                  {topic.subTopics.map(subtopic => renderTopic(subtopic, level + 1))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        createTopic();
                      }
                    }}
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
                  {course.topics
                    .filter(topic => !topic.parentTopic)
                    .sort((a, b) => a.order - b.order)
                    .map(topic => renderTopic(topic))}
                </div>

                {course.topics.filter(t => !t.parentTopic).length === 0 && (
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={course.category}
                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={course.level}
                    onChange={(e) => setCourse({ ...course, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <button
                  onClick={() => updateCourse({
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    category: course.category,
                    level: course.level
                  })}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Topics</span>
                  <span className="font-medium">{course.topics.filter(t => !t.parentTopic).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Subtopics</span>
                  <span className="font-medium">{course.topics.filter(t => t.parentTopic).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Content Items</span>
                  <span className="font-medium">
                    {course.topics.reduce((acc, topic) => acc + topic.contents.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>
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