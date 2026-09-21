import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import BookAppointment from './pages/BookAppointment';
import AppointmentList from './pages/AppointmentList';
import DoctorSchedule from './pages/DoctorSchedule';
function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Clinic Management System</h1>
                <p className="text-gray-600">Please use the navigation menu to access your modules.</p>
              </div>
            </div>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Patient Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:id/edit" element={<PatientForm />} />

            <Route path="/appointments/book" element={<BookAppointment />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
