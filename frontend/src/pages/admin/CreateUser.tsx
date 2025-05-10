import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { UserRole } from '../../types';
import Input from '../../components/common/Input';
import { useToasts } from '../../components/common/Feedback';

// Icons
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const CreateUser = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { success, error: showError } = useToasts();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT, // Default to student
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Prepare the data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // Get auth token
      const token = await getToken();
      
      // Call the API to create the user
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Check if baseUrl already includes /api prefix
      const apiPrefix = baseUrl.includes('/api') ? '' : '/api';
      
      const response = await fetch(`${baseUrl}${apiPrefix}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      success(`${formData.role} account created successfully!`);
      navigate('/admin/users');
    } catch (err) {
      showError((err as Error).message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New User</h1>
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-surface-light hover:bg-surface text-white px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
      
      <div className="bg-surface p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              leftIcon={<UserIcon />}
              variant="dark"
              error={errors.firstName}
              required
            />
            
            <Input
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              leftIcon={<UserIcon />}
              variant="dark"
              error={errors.lastName}
              required
            />
          </div>
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<EmailIcon />}
            variant="dark"
            error={errors.email}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<LockIcon />}
              variant="dark"
              error={errors.password}
              required
              helperText="Must be at least 8 characters"
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<LockIcon />}
              variant="dark"
              error={errors.confirmPassword}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">
              User Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
              required
            >
              <option value={UserRole.STUDENT}>Student</option>
              <option value={UserRole.TEACHER}>Teacher</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
            {errors.role && <p className="text-error text-xs mt-1">{errors.role}</p>}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors w-full"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser; 