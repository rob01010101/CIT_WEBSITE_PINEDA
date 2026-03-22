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
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/hall-of-fame" element={<HallOfFame />} />
                    <Route path="/organization" element={<Organization />} />
                    <Route path="/events" element={<Organization />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/faq" element={<FAQ />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
