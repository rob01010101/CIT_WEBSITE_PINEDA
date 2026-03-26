import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Announcements from './pages/Announcements';
import HallOfFame from './pages/HallOfFame';
import Organization from './pages/Organization';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageAnnouncements from './pages/ManageAnnouncements';
import ManageGalleries from './pages/ManageGalleries';
import ManageOrganization from './pages/ManageOrganization';
import ManageEvents from './pages/ManageEvents';
import ManageContacts from './pages/ManageContacts';
import ManageRegistrations from './pages/ManageRegistrations';
import './App.css';

// Layout component for public pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Admin Routes - No Navbar/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute>
                  <ManageAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/galleries"
              element={
                <ProtectedRoute>
                  <ManageGalleries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/organization"
              element={
                <ProtectedRoute>
                  <ManageOrganization />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <ManageEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <ManageContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute>
                  <ManageRegistrations />
                </ProtectedRoute>
              }
            />

            {/* Public Routes - With Navbar/Footer */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
            <Route path="/announcements" element={<PublicLayout><Announcements /></PublicLayout>} />
            <Route path="/hall-of-fame" element={<PublicLayout><HallOfFame /></PublicLayout>} />
            <Route path="/organization" element={<PublicLayout><Organization /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><Organization /></PublicLayout>} />
            <Route path="/contacts" element={<PublicLayout><Contacts /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
