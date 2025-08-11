// src/pages/Courses/CourseDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Users, Star, Clock, PlayCircle, FileText, Code, Video, Table, ChevronRight, ChevronDown, Lock, Image, ExternalLink, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  thumbnail: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  students: string[];
  rating: number;
  numReviews: number;
  topics: Topic[];
  published: boolean;
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

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    // Auto-select first content if user has access
    if (course && canAccess && course.topics.length > 0 && !selectedContent) {
      const firstTopic = findFirstTopicWithContent(course.topics);
      if (firstTopic && firstTopic.contents.length > 0) {
        setSelectedContent(firstTopic.contents[0]);
        setSelectedTopic(firstTopic);
        expandToTopic(firstTopic._id);
      }
    }
  }, [course]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const findFirstTopicWithContent = (topics: Topic[]): Topic | null => {
    for (const topic of topics) {
      if (topic.contents && topic.contents.length > 0) {
        return topic;
      }
      if (topic.subTopics) {
        const found = findFirstTopicWithContent(topic.subTopics);
        if (found) return found;
      }
    }
    return null;
  };

  const expandToTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    newExpanded.add(topicId);
    
    // Also expand parent topics
    const expandParents = (topics: Topic[], targetId: string): boolean => {
      for (const topic of topics) {
        if (topic._id === targetId) {
          return true;
        }
        if (topic.subTopics && expandParents(topic.subTopics, targetId)) {
          newExpanded.add(topic._id);
          return true;
        }
      }
      return false;
    };
    
    if (course) {
      expandParents(course.topics, topicId);
    }
    
    setExpandedTopics(newExpanded);
  };

  const enrollInCourse = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      await axios.post(`http://localhost:5000/api/courses/${id}/enroll`);
      setCourse(prev => prev ? {
        ...prev,
        students: [...prev.students, user._id]
      } : null);
      toast.success('Successfully enrolled in course!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
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

  const isEnrolled = course && user && course.students.includes(user._id);
  const canAccess = isEnrolled || (course && user && course.instructor._id === user._id);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Get content data handling both old and new structures
  const getData = (content: Content, type: string) => {
    if (!content.data) return null;
    
    switch (type) {
      case 'text':
        return content.data.text !== undefined ? { text: content.data.text } : content.data;
      case 'code':
        return content.data.code !== undefined && typeof content.data.code === 'object' ? content.data.code : content.data;
      case 'video':
        return content.data.video !== undefined ? content.data.video : content.data;
      case 'pdf':
        return content.data.pdf !== undefined ? content.data.pdf : content.data;
      case 'table':
        return content.data.table !== undefined ? content.data.table : content.data;
      case 'image':
        return content.data.image !== undefined ? content.data.image : content.data;
      case 'link':
        return content.data.link !== undefined ? content.data.link : content.data;
      default:
        return content.data;
    }
  };

  const renderContent = (content: Content) => {
    switch (content.type) {
      case 'text':
        const textData = getData(content, 'text');
        return (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: textData?.text || '' }}
          />
        );
      
      case 'code':
        const codeData = getData(content, 'code');
        return (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <div className="text-sm text-gray-400 mb-2">
              {codeData?.language || 'javascript'}
            </div>
            <pre className="text-green-400">
              <code>{codeData?.code || ''}</code>
            </pre>
          </div>
        );
      
      case 'video':
        const videoData = getData(content, 'video');
        if (videoData?.url) {
          const videoId = videoData.videoId || videoData.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
          if (videoId) {
            return (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={content.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            );
          }
        }
        return <div className="text-gray-500">Video not available</div>;
      
      case 'pdf':
        const pdfData = getData(content, 'pdf');
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium">{pdfData?.originalName || 'PDF Document'}</p>
                <p className="text-sm text-gray-500">
                  PDF Document • {pdfData?.size ? (pdfData.size / 1024 / 1024).toFixed(2) : '0'} MB
                </p>
              </div>
            </div>
            {pdfData?.url && (
              <a
                href={pdfData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Open PDF
              </a>
            )}
          </div>
        );
      
      case 'table':
        const tableData = getData(content, 'table');
        const tableStyle = tableData?.style || 'default';
        
        return (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 ${
              tableStyle === 'bordered' ? 'border border-gray-300' : ''
            } rounded-lg overflow-hidden`}>
              <thead className="bg-gray-50">
                <tr>
                  {tableData?.headers?.map((header: string, index: number) => (
                    <th
                      key={index}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        tableStyle === 'bordered' ? 'border border-gray-300' : ''
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData?.rows?.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className={
                    tableStyle === 'striped' && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }>
                    {row.map((cell: string, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                          tableStyle === 'bordered' ? 'border border-gray-300' : ''
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'image':
        const imageData = getData(content, 'image');
        return (
          <div className="space-y-2">
            {imageData?.url && (
              <img
                src={imageData.url}
                alt={imageData.alt || content.title}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            )}
            {imageData?.caption && (
              <p className="text-sm text-gray-600 italic text-center">{imageData.caption}</p>
            )}
          </div>
        );
      
      case 'link':
        const linkData = getData(content, 'link');
        return (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <a
                  href={linkData?.url || '#'}
                  target={linkData?.openInNewTab !== false ? '_blank' : '_self'}
                  rel={linkData?.openInNewTab !== false ? 'noopener noreferrer' : ''}
                  className="text-lg font-medium text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {linkData?.title || linkData?.url || 'External Link'}
                </a>
                {linkData?.description && (
                  <p className="mt-1 text-sm text-gray-600">{linkData.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-500">Content not available</div>;
    }
  };

  const renderTopic = (topic: Topic, level: number = 0) => {
    const hasContent = topic.contents && topic.contents.length > 0;
    const hasSubtopics = topic.subTopics && topic.subTopics.length > 0;
    const isExpanded = expandedTopics.has(topic._id);
    
    return (
      <div key={topic._id} className={level > 0 ? 'ml-4' : ''}>
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleTopic(topic._id)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h3 className={`font-medium text-gray-900 ${level > 0 ? 'text-sm' : 'text-base'}`}>
                {topic.title}
              </h3>
              {(hasContent || hasSubtopics) && (
                <p className="text-xs text-gray-600 mt-1">
                  {hasContent && `${topic.contents.length} item${topic.contents.length !== 1 ? 's' : ''}`}
                  {hasContent && hasSubtopics && ' • '}
                  {hasSubtopics && `${topic.subTopics.length} subtopic${topic.subTopics.length !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>
            {(hasContent || hasSubtopics) && (
              <ChevronDown className={`h-4 w-4 text-gray-400 transform transition-transform ${
                isExpanded ? '' : '-rotate-90'
              }`} />
            )}
          </button>
          
          {isExpanded && (
            <div className="bg-gray-50">
              {/* Render contents */}
              {topic.contents?.map((content, contentIndex) => (
                <button
                  key={content._id}
                  onClick={() => {
                    if (canAccess) {
                      setSelectedContent(content);
                      setSelectedTopic(topic);
                    }
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 transition-colors text-sm ${
                    selectedContent?._id === content._id ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' : ''
                  } ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!canAccess}
                >
                  {getContentIcon(content.type)}
                  <span className="flex-1 truncate">
                    {contentIndex + 1}. {content.title}
                  </span>
                  {!canAccess && <Lock className="h-3 w-3 text-gray-400" />}
                </button>
              ))}
              
              {/* Render subtopics */}
              {topic.subTopics?.map(subtopic => renderTopic(subtopic, level + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const findPreviousNextContent = () => {
    if (!course || !selectedContent) return { previous: null, next: null };

    const allContents: { content: Content; topic: Topic }[] = [];
    
    const collectContents = (topics: Topic[]) => {
      topics.forEach(topic => {
        topic.contents?.forEach(content => {
          allContents.push({ content, topic });
        });
        if (topic.subTopics) {
          collectContents(topic.subTopics);
        }
      });
    };
    
    collectContents(course.topics);
    
    const currentIndex = allContents.findIndex(item => item.content._id === selectedContent._id);
    
    return {
      previous: currentIndex > 0 ? allContents[currentIndex - 1] : null,
      next: currentIndex < allContents.length - 1 ? allContents[currentIndex + 1] : null
    };
  };

  const { previous, next } = findPreviousNextContent();

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
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <p className="text-gray-600 mt-2">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {course.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-blue-100 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{course.rating.toFixed(1)} ({course.numReviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{course.students.length} students</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>{course.level}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-blue-100">Created by <span className="font-semibold">{course.instructor.name}</span></p>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900">
                <div className="text-3xl font-bold text-center mb-4">
                  ${course.price}
                </div>
                
                {user ? (
                  isEnrolled ? (
                    <div className="text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                        ✓ Enrolled
                      </div>
                      <p className="text-sm text-gray-600">
                        You have access to all course content
                      </p>
                    </div>
                  ) : course.instructor._id === user._id ? (
                    <div className="text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                        Your Course
                      </div>
                      <p className="text-sm text-gray-600">
                        You are the instructor of this course
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={enrollInCourse}
                      disabled={enrolling}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Please login to enroll in this course
                    </p>
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Login to Enroll
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <PlayCircle className="h-4 w-4 mr-2 text-gray-400" />
                      {course.topics.reduce((acc, topic) => {
                        const count = topic.contents?.filter(c => c.type === 'video').length || 0;
                        const subCount = topic.subTopics?.reduce((subAcc, sub) => 
                          subAcc + (sub.contents?.filter(c => c.type === 'video').length || 0), 0) || 0;
                        return acc + count + subCount;
                      }, 0)} video lessons
                    </li>
                    <li className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      {course.topics.reduce((acc, topic) => {
                        const count = topic.contents?.filter(c => c.type === 'pdf').length || 0;
                        const subCount = topic.subTopics?.reduce((subAcc, sub) => 
                          subAcc + (sub.contents?.filter(c => c.type === 'pdf').length || 0), 0) || 0;
                        return acc + count + subCount;
                      }, 0)} downloadable resources
                    </li>
                    <li className="flex items-center">
                      <Code className="h-4 w-4 mr-2 text-gray-400" />
                      {course.topics.reduce((acc, topic) => {
                        const count = topic.contents?.filter(c => c.type === 'code').length || 0;
                        const subCount = topic.subTopics?.reduce((subAcc, sub) => 
                          subAcc + (sub.contents?.filter(c => c.type === 'code').length || 0), 0) || 0;
                        return acc + count + subCount;
                      }, 0)} coding exercises
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Course Topics */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300`}>
            <div className="bg-white rounded-lg shadow sticky top-6">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className={`text-lg font-semibold text-gray-900 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                  Course Content
                </h2>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className={`h-5 w-5 text-gray-600 transform transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
                </button>
              </div>
              
              <div className={`${sidebarCollapsed ? 'hidden' : 'block'} max-h-[calc(100vh-200px)] overflow-y-auto`}>
                {course.topics.filter(topic => !topic.parentTopic).map(topic => renderTopic(topic))}
              </div>

              {course.topics.length === 0 && !sidebarCollapsed && (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="mx-auto h-12 w-12 mb-3" />
                  <p className="text-sm">No content available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-8">
              {selectedContent && canAccess ? (
                <div>
                  {/* Content Header */}
                  <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{selectedTopic?.title}</span>
                      <ChevronRight className="h-4 w-4 mx-2" />
                      <span>{selectedContent.title}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h2>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      {getContentIcon(selectedContent.type)}
                      <span className="ml-2 capitalize">{selectedContent.type} Content</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="mt-6">
                    {renderContent(selectedContent)}
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
                    <button 
                      onClick={() => {
                        if (previous) {
                          setSelectedContent(previous.content);
                          setSelectedTopic(previous.topic);
                          expandToTopic(previous.topic._id);
                        }
                      }}
                      disabled={!previous}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>
                    <button 
                      onClick={() => {
                        if (next) {
                          setSelectedContent(next.content);
                          setSelectedTopic(next.topic);
                          expandToTopic(next.topic._id);
                        }
                      }}
                      disabled={!next}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ) : selectedContent && !canAccess ? (
                <div className="text-center py-16">
                  <Lock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Locked</h3>
                  <p className="text-gray-600">Enroll in the course to access this content</p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <PlayCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Content to Begin</h3>
                  <p className="text-gray-600">Choose a lesson from the course content on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;