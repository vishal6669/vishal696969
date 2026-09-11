import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check student access status
  if (user.role === 'student' && user.accountStatus === 'disabled') {
    return <Navigate to="/login?disabled=true" replace />;
  }

  // Check role authorization
  if (allowedRole) {
    const userRoleNormalized = user.role === 'admin' ? 'tpo' : user.role;
    const allowedRoleNormalized = allowedRole === 'admin' ? 'tpo' : allowedRole;

    if (userRoleNormalized !== allowedRoleNormalized) {
      // Unauthorized cross-role access -> redirect to proper dashboard
      if (userRoleNormalized === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      } else {
        return <Navigate to="/tpo/dashboard" replace />;
      }
    }
  }

  return children ? children : <Outlet />;
}
