import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import CareerDetails from './pages/CareerDetails';
import Roadmap from './pages/Roadmap';
import Opportunities from './pages/Opportunities';
import Notifications from './pages/Notifications';
import MockInterview from './pages/MockInterview';
import Mascot from './components/Mascot';
import GuidanceSelection from './pages/GuidanceSelection';
import EducationalDomain from './pages/EducationalDomain';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { MascotProvider } from './context/MascotContext';
import { ResumeProvider } from './context/ResumeContext';

function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <MascotProvider>
        <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route path="select-path" element={<GuidanceSelection />} />
          <Route path="educational-domain" element={<EducationalDomain />} />
          <Route path="upload" element={<Upload />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="career/:role" element={<CareerDetails />} />
          <Route path="roadmap/:role" element={<Roadmap />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
      <Mascot />
    </Router>
    </MascotProvider>
    </ResumeProvider>
    </AuthProvider>
  );
}

export default App;
