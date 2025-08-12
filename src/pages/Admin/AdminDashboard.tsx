// src/pages/Admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, BookOpen, Shield, Activity } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  pendingApprovals: number;
  totalCourses: number;
  activeUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    pendingApprovals: 0,
    totalCourses: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, coursesResponse] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/courses`)
      ]);

      const users = usersResponse.data.users;
      const courses = coursesResponse.data.courses;

      setStats({
        totalUsers: users.length,
        totalStudents: users.filter((u: any) => u.role === 'student').length,
        totalInstructors: users.filter((u: any) => u.role === 'instructor').length,
        pendingApprovals: users.filter((u: any) => u.role === 'instructor' && !u.isApproved).length,
        totalCourses: courses.length,
        activeUsers: users.filter((u: any) => u.isActive).length
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
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
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, courses, and platform settings</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Instructors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalInstructors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-teal-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/users/instructors"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <UserCheck className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Instructors</h3>
                    <p className="text-sm text-gray-500">Approve or reject instructor accounts</p>
                    {stats.pendingApprovals > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                        {stats.pendingApprovals} pending
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users/students"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Students</h3>
                    <p className="text-sm text-gray-500">View and manage student accounts</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/courses"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Courses</h3>
                    <p className="text-sm text-gray-500">Overview of all platform courses</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <Activity className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <p>Activity tracking coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;