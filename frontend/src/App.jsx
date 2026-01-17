import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import AuthLayout from './components/AuthLayout';
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
import LandingPage from './pages/LandingPage';
// import CampaignList from './pages/CampaignList';
// import CampaignCreate from './pages/CampaignCreate';
// import CampaignDetailLayout from './pages/CampaignDetailLayout';
// import CampaignContent from './pages/campaign-tabs/CampaignContent';
// import CampaignAssets from './pages/campaign-tabs/CampaignAssets';
// import CampaignSchedule from './pages/campaign-tabs/CampaignSchedule';
// import CampaignFeedback from './pages/campaign-tabs/CampaignFeedback';
// import CampaignAnalytics from './pages/campaign-tabs/CampaignAnalytics';
// import CampaignTeam from './pages/campaign-tabs/CampaignTeam';

function App() {
  return (
    <div className="min-h-screen bg-primary-bg text-primary-text font-sans">
      <nav className="bg-gradient-to-r from-login-bg-start to-login-bg-middle shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity">
                HackHiVE
              </Link>
              <div className="ml-10 flex items-baseline space-x-6">
                <Link to="/campaigns" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Campaigns
                </Link>
                <Link to="/campaigns/create" className="text-login-bg-start bg-primary-accent hover:bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                  Create Campaign
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-xs font-medium bg-white/10 px-2 py-1 rounded">v1.0</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
          <Route path="/dashboard" element={
            <Dashboard />
          } />





          <Route path="/campaigns" element={<CampaignLayout />}>
            <Route index element={<CampaignList />} />
            <Route path="create" element={<CampaignCreate />} />
            <Route path=":id" element={<CampaignDetail />} />
            <Route path=":id/content" element={<CampaignContent />} />
            <Route path=":id/assets" element={<CampaignAssets />} />
            <Route path=":id/schedule" element={<CampaignSchedule />} />
            <Route path=":id/feedback" element={<CampaignFeedback />} />
            <Route path=":id/analytics" element={<CampaignAnalytics />} />
            <Route path=":id/team" element={<CampaignTeam />} />
          </Route>

          <Route path="/" element={<LandingPage />} />

          {/* <Route path="/campaigns" element={
            <AuthLayout authentication={true}>
              <CampaignList />
            </AuthLayout>
          } />
          <Route path="/campaigns/create" element={
            <AuthLayout authentication={true}>
              <CampaignCreate />
            </AuthLayout>
          } />
          <Route path="/campaigns/:id" element={
            <AuthLayout authentication={true}>
              <CampaignDetailLayout />
            </AuthLayout>
          }>
            <Route index element={<Navigate to="content" replace />} />
            <Route path="content" element={<CampaignContent />} />
            <Route path="assets" element={<CampaignAssets />} />
            <Route path="schedule" element={<CampaignSchedule />} />
            <Route path="feedback" element={<CampaignFeedback />} />
            <Route path="analytics" element={<CampaignAnalytics />} />
            <Route path="team" element={<CampaignTeam />} />
          </Route> */}
        </Routes>
      </main>

      <footer className="bg-dark-contrast text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; 2026 HackHiVE. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
