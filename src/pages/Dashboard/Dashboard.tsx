import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Plus, Users, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  published: boolean;
  students: string[];
  rating: number;
  numReviews: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'instructor' || user?.role === 'admin') {
      fetchInstructorCourses();
    } else {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchInstructorCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/instructor/my`);
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      // For students, we would fetch their enrolled courses
      // For now, we'll just show an empty state
      setCourses([]);
    } catch (error) {
      toast.error('Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const togglePublishCourse = async (courseId: string, published: boolean) => {
    try {
      await axios.put(`${API_URL}/courses/${courseId}`, {
        published: !published
      });
      
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, published: !published }
          : course
      ));
      
      toast.success(`Course ${!published ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'instructor' || user?.role === 'admin' 
              ? 'Instructor Dashboard' 
              : 'Student Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'instructor' || user?.role === 'admin' 
              ? 'Manage your courses and track student progress' 
              : 'Track your learning progress and enrolled courses'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {user?.role === 'instructor' || user?.role === 'admin' ? 'Total Courses' : 'Enrolled Courses'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((total, course) => total + course.students.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Published Courses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.filter(course => course.published).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.role === 'instructor' || user?.role === 'admin' ? 'My Courses' : 'Enrolled Courses'}
            </h2>
            {(user?.role === 'instructor' || user?.role === 'admin') && (
              <Link
                to="/create-course"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            )}
          </div>

          <div className="p-6">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user?.role === 'instructor' || user?.role === 'admin' 
                    ? 'No courses created yet' 
                    : 'No enrolled courses yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {user?.role === 'instructor' || user?.role === 'admin' 
                    ? 'Create your first course to get started' 
                    : 'Browse available courses to start learning'}
                </p>
                {user?.role === 'instructor' || user?.role === 'admin' ? (
                  <Link
                    to="/create-course"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-sm text-gray-500">{course.level}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>₹{course.price}</span>
                      <span>{course.students.length} students</span>
                    </div>

                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/edit-course/${course._id}`}
                          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                        
                        <button
                          onClick={() => togglePublishCourse(course._id, course.published)}
                          className={`flex items-center px-3 py-1 rounded-md transition-colors text-sm ${
                            course.published
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {course.published ? 'Unpublish' : 'Publish'}
                        </button>
                        
                        <button
                          onClick={() => deleteCourse(course._id)}
                          className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;