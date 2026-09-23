import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PatientList from './pages/PatientList';
import DoctorList from './pages/DoctorList';
import AppointmentList from './pages/AppointmentList';
import BookAppointment from './pages/BookAppointment';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
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

          {/* Receptionist Routes */}
          <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/patients" element={<PatientList />} />
            <Route path="/receptionist/doctors" element={<DoctorList />} />
            <Route path="/receptionist/appointments" element={<AppointmentList />} />
          </Route>

          {/* Normal User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['normal']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/appointments/book" element={<BookAppointment />} />
            <Route path="/user/appointments" element={<AppointmentList />} />
            <Route path="/user/doctors" element={<DoctorList />} />
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
