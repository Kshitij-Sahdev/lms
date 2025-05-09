import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { User, UserRole } from '../../types';

const ManageUsers = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        // const token = await getToken();
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();
        
        // Mock data
        const mockUsers = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: UserRole.STUDENT,
            profilePicture: '',
            requires2FA: false
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            role: UserRole.TEACHER,
            profilePicture: '',
            requires2FA: true
          },
          {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@example.com',
            role: UserRole.STUDENT,
            profilePicture: '',
            requires2FA: false
          },
          {
            id: '4',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.williams@example.com',
            role: UserRole.TEACHER,
            profilePicture: '',
            requires2FA: true
          },
          {
            id: '5',
            firstName: 'Alex',
            lastName: 'Brown',
            email: 'alex.brown@example.com',
            role: UserRole.ADMIN,
            profilePicture: '',
            requires2FA: true
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [getToken]);
  
  // Filter users based on search term and role filter
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(term) || 
        user.lastName.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between">
          <div className="h-8 bg-surface-light rounded w-1/4"></div>
          <div className="h-10 bg-surface-light rounded w-32"></div>
        </div>
        <div className="h-12 bg-surface-light rounded w-full mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface p-4 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  const handleDeleteUser = (userId: string) => {
    // This would be an API call in a real implementation
    console.log(`Delete user with ID: ${userId}`);
    // After successful delete, update the users list
    setUsers(users.filter(user => user.id !== userId));
  };
  
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    // This would be an API call in a real implementation
    console.log(`Change role for user ${userId} to ${newRole}`);
    // After successful update, update the users list
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Link 
          to="/admin/users/create" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create User
        </Link>
      </div>
      
      {/* Filters/Search */}
      <div className="bg-surface p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
          />
        </div>
        <select 
          className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value={UserRole.STUDENT}>Students</option>
          <option value={UserRole.TEACHER}>Teachers</option>
          <option value={UserRole.ADMIN}>Admins</option>
        </select>
      </div>
      
      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-lg">
          <h2 className="text-xl mb-3">No users found</h2>
          <p className="text-text-secondary mb-6">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="bg-surface rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-light">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">2FA</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-surface-light">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-light mr-3 overflow-hidden">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-secondary">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select 
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                      className="p-1 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
                    >
                      <option value={UserRole.STUDENT}>Student</option>
                      <option value={UserRole.TEACHER}>Teacher</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.requires2FA ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                    }`}>
                      {user.requires2FA ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/admin/users/${user.id}`}
                        className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-error hover:bg-error/80 text-white px-4 py-2 rounded transition-colors"
                      >
                        Delete
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
  );
};

export default ManageUsers; 