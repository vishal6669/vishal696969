import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from '../api/client';
import { mockData } from '../data/mockData';

const AuthContext = createContext(null);

// Demo credentials fallback
const DEMO_ACCOUNTS = {
  student: { id: 'STU1001', password: 'student123', role: 'student', name: 'Aarav Sharma' },
  admin: { id: 'admin', password: 'admin123', role: 'admin', name: 'Dr. Rajesh Kumar' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aipp_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('aipp_user', JSON.stringify(user));
    else {
      localStorage.removeItem('aipp_user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (id, password, role) => {
    try {
      // 1. Try real JWT backend authentication first
      const response = await loginApi({ id, password, role });
      if (response.data && response.data.success) {
        const { token, user: apiUser } = response.data;
        if (token) localStorage.setItem('token', token);
        const userData = {
          id: apiUser.id || id,
          role: apiUser.role || role,
          name: apiUser.name,
          department: apiUser.department || 'CSE',
          accountStatus: apiUser.accountStatus || 'active'
        };
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (apiErr) {
      if (apiErr.response && apiErr.response.data && apiErr.response.data.disabled) {
        return {
          success: false,
          disabled: true,
          error: apiErr.response.data.message || 'Your student portal access has been temporarily disabled.'
        };
      }
    }

    // 2. Offline / local fallback authentication
    if (role === 'student') {
      const studentId = id.trim().toUpperCase();
      const s = mockData.getStudent(studentId);
      
      if (!s && !studentId.startsWith('STU')) {
        return { success: false, error: 'Student ID not found in institutional directory.' };
      }

      if (password !== 'student123' && (!s || password !== s.password)) {
        return { success: false, error: 'Invalid password. Please try again.' };
      }

      if (s && (s.accountStatus === 'disabled' || s.account_status === 'disabled')) {
        return {
          success: false,
          disabled: true,
          error: 'Your student portal access has been temporarily disabled. Please contact the Training & Placement Office.'
        };
      }

      const userData = {
        id: studentId,
        role: 'student',
        name: s ? s.name : `Student ${studentId}`,
        department: s ? s.department : 'CSE',
        accountStatus: s ? s.accountStatus : 'active'
      };
      setUser(userData);
      return { success: true, user: userData };
    }

    if (role === 'admin') {
      const account = DEMO_ACCOUNTS.admin;
      if (id !== account.id && id !== 'admin@sapthagiri.edu.in' && password !== 'admin123') {
        return { success: false, error: 'Invalid Admin ID or password' };
      }
      const userData = { id: account.id, role: 'admin', name: account.name };
      setUser(userData);
      return { success: true, user: userData };
    }

    return { success: false, error: 'Unknown role' };
  };

  const loginAsStudent = (sId = 'STU1001') => {
    const s = mockData.getStudent(sId);
    const userData = {
      id: sId,
      role: 'student',
      name: s ? s.name : `Student ${sId}`,
      department: s ? s.department : 'CSE',
      accountStatus: s ? (s.accountStatus || s.account_status) : 'active'
    };
    setUser(userData);
    return userData;
  };

  const loginAsAdmin = () => {
    const userData = { id: 'admin', role: 'admin', name: 'Dr. Rajesh Kumar' };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('aipp_user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAsStudent, loginAsAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
