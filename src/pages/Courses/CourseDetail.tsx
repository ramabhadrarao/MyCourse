import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Users, Star, Clock, PlayCircle, FileText, Code, Video } from 'lucide-react';
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
}

interface Content {
  _id: string;
  title: string;
  type: 'text' | 'code' | 'video' | 'pdf';
  data: any;
  order: number;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

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
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderContent = (content: Content) => {
    switch (content.type) {
      case 'text':
        return (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content.data.text }}
          />
        );
      
      case 'code':
        return (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <div className="text-sm text-gray-400 mb-2">
              {content.data.language}
            </div>
            <pre className="text-green-400">
              <code>{content.data.code}</code>
            </pre>
          </div>
        );
      
      case 'video':
        if (content.data.url) {
          const videoId = content.data.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
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
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium">{content.data.originalName}</p>
                <p className="text-sm text-gray-500">
                  PDF Document • {(content.data.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <a
              href={`http://localhost:5000/uploads/${content.data.filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Open PDF
            </a>
          </div>
        );
      
      default:
        return <div className="text-gray-500">Content not available</div>;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {course.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>
              
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
              
              <div className="mt-6">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Topics */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
            
            <div className="space-y-4">
              {course.topics.map((topic, index) => (
                <div key={topic._id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedTopic(
                      expandedTopic === topic._id ? null : topic._id
                    )}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {index + 1}. {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {topic.contents.length} item{topic.contents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      {expandedTopic === topic._id ? '−' : '+'}
                    </div>
                  </button>
                  
                  {expandedTopic === topic._id && (
                    <div className="border-t border-gray-200">
                      {topic.contents.map((content, contentIndex) => (
                        <button
                          key={content._id}
                          onClick={() => canAccess ? setSelectedContent(content) : null}
                          className={`w-full px-6 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                            !canAccess ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={!canAccess}
                        >
                          {getContentIcon(content.type)}
                          <span className="flex-1">
                            {contentIndex + 1}. {content.title}
                          </span>
                          {!canAccess && (
                            <span className="text-xs text-gray-500">🔒</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {course.topics.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="mx-auto h-16 w-16 mb-4" />
                <p>No content available yet.</p>
              </div>
            )}
          </div>

          {/* Content Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedContent ? selectedContent.title : 'Select content to view'}
              </h3>
              
              {selectedContent && canAccess ? (
                <div className="space-y-4">
                  {renderContent(selectedContent)}
                </div>
              ) : selectedContent && !canAccess ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🔒</div>
                  <p>Enroll in the course to access this content</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PlayCircle className="mx-auto h-16 w-16 mb-4" />
                  <p>Click on any topic item to view the content</p>
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