// src/pages/Admin/InstructorManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, UserCheck, UserX, ArrowLeft, Mail, Key, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  isApproved: boolean;
  createdCourses: Array<{ _id: string; title: string }>;
  createdAt: string;
}

const InstructorManagement: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'active' | 'inactive'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructors();
  }, [searchTerm, filterStatus]);

  const fetchInstructors = async () => {
    try {
      const params = new URLSearchParams();
      params.append('role', 'instructor');
      if (searchTerm) params.append('search', searchTerm);
      
      if (filterStatus === 'pending') {
        params.append('isApproved', 'false');
      } else if (filterStatus === 'approved') {
        params.append('isApproved', 'true');
      } else if (filterStatus === 'active') {
        params.append('isActive', 'true');
      } else if (filterStatus === 'inactive') {
        params.append('isActive', 'false');
      }

      const response = await axios.get(`http://localhost:5000/api/users?${params}`);
      setInstructors(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  const approveInstructor = async (instructorId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${instructorId}/status`, {
        isApproved: true
      });

      setInstructors(instructors.map(instructor => 
        instructor._id === instructorId 
          ? { ...instructor, isApproved: true }
          : instructor
      ));

      toast.success('Instructor approved successfully');
    } catch (error) {
      toast.error('Failed to approve instructor');
    }
  };

  const toggleInstructorStatus = async (instructorId: string, currentStatus: boolean) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${instructorId}/status`, {
        isActive: !currentStatus
      });

      setInstructors(instructors.map(instructor => 
        instructor._id === instructorId 
          ? { ...instructor, isActive: !currentStatus }
          : instructor
      ));

      toast.success(`Instructor ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update instructor status');
    }
  };

  const resetPassword = async (instructorId: string, instructorName: string) => {
    if (!window.confirm(`Reset password for ${instructorName} to default (Password123)?`)) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${instructorId}/reset-password`);
      toast.success('Password reset to: Password123');
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingCount = instructors.filter(i => !i.isApproved).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Instructor Management</h1>
                <p className="text-gray-600">Approve and manage instructor accounts</p>
              </div>
            </div>
            {pendingCount > 0 && (
              <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Instructors</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Instructors ({instructors.length})
            </h2>
          </div>

          {instructors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No instructors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructors.map((instructor) => (
                    <tr key={instructor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {instructor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {instructor.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2" />
                          {instructor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {instructor.createdCourses.length} courses
                        </div>
                        {instructor.createdCourses.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {instructor.createdCourses.slice(0, 2).map(course => course.title).join(', ')}
                            {instructor.createdCourses.length > 2 && ' ...'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(instructor.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {instructor.isApproved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          instructor.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {instructor.isActive ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {!instructor.isApproved && (
                            <button
                              onClick={() => approveInstructor(instructor._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleInstructorStatus(instructor._id, instructor.isActive)}
                            className={`${
                              instructor.isActive
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={instructor.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {instructor.isActive ? <UserX className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => resetPassword(instructor._id, instructor.name)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reset Password"
                          >
                            <Key className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorManagement;