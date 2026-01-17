import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CampaignLayout from './pages/CampaignLayout';
import CampaignList from './pages/CampaignList';
import CampaignCreate from './pages/CampaignCreate';
import CampaignDetail from './pages/CampaignDetail';
import CampaignContent from './pages/CampaignContent';
import CampaignAssets from './pages/CampaignAssets';
import CampaignSchedule from './pages/CampaignSchedule';
import CampaignFeedback from './pages/CampaignFeedback';
import CampaignAnalytics from './pages/CampaignAnalytics';
import CampaignTeam from './pages/CampaignTeam';

// ... (existing imports)

function App() {
  return (
    <div className="min-h-screen bg-primary-bg text-primary-text font-sans">
      {/* Navigation - Conditionally rendered or modified if needed, keeping as is for now but Home has its own TopBar */}
      <nav className="bg-gradient-to-r from-login-bg-start to-login-bg-middle shadow-lg hidden">
        {/* Hidden global nav since using layouts/pages with their own headers ideally, or keep if you want global nav */}
      </nav>

      {/* Main Content */}
      <Routes>
        <Route path="/login" element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        } />

        {/* Protected Home Page at Root */}
        <Route path="/" element={
          <AuthLayout authentication={true}>
            <Home />
          </AuthLayout>
        } />

        {/* Public Landing Page moved to /landing */}
        <Route path="/landing" element={<LandingPage />} />

        <Route path="/dashboard" element={
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        } />

        <Route path="/campaigns" element={
          <AuthLayout authentication={true}>
            <CampaignLayout />
          </AuthLayout>
        }>
          <Route index element={<CampaignList />} />
          {/* ... other campaign routes ... */}
          <Route path="create" element={<CampaignCreate />} />
          <Route path=":id" element={<CampaignDetail />} />
          <Route path=":id/content" element={<CampaignContent />} />
          <Route path=":id/assets" element={<CampaignAssets />} />
          <Route path=":id/schedule" element={<CampaignSchedule />} />
          <Route path=":id/feedback" element={<CampaignFeedback />} />
          <Route path=":id/analytics" element={<CampaignAnalytics />} />
          <Route path=":id/team" element={<CampaignTeam />} />
        </Route>
      </Routes>

      {/* Footer can be kept or managed per page */}
    </div>
  );
}

export default App;
