// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Attendance from "./pages/Attendance";
import AttendanceRecord from "./pages/AttendanceRecord";
import Login from "./pages/Login";
import store from './store';
import Denied from './pages/Denied';
import RequireAuth from './components/Auth/RequireAuth';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAttendances from './pages/AdminAttendances';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';


function App() {
  const [rehydrated, setRehydrated] = React.useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (!store.getState().auth.isLoggedIn) {
          store.dispatch({ type: 'auth/setAuthData', payload: { user, token } });
        }
      } catch {}
    }
    setRehydrated(true);
  }, []);
  if (!rehydrated) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Attendance />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth allowedRoles={['admin', 'user']}/>}> 
            <Route path="/attendances" element={<AttendanceRecord />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['admin']} />}> 
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/admin/users/edit/:id" element={<EditUser />} />
            <Route path="/admin/attendances" element={<AdminAttendances />} />
          </Route>
          <Route path="/denied" element={<Denied/>} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
