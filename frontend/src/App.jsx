import { Routes, Route, Link, Navigate } from 'react-router-dom';
import CampaignList from './pages/CampaignList';
import CampaignCreate from './pages/CampaignCreate';
import CampaignDetailLayout from './pages/CampaignDetailLayout';
import CampaignContent from './pages/campaign-tabs/CampaignContent';
import CampaignAssets from './pages/campaign-tabs/CampaignAssets';
import CampaignSchedule from './pages/campaign-tabs/CampaignSchedule';
import CampaignFeedback from './pages/campaign-tabs/CampaignFeedback';
import CampaignAnalytics from './pages/campaign-tabs/CampaignAnalytics';
import CampaignTeam from './pages/campaign-tabs/CampaignTeam';

function App() {
  return (
    <div className="min-h-screen bg-primary-bg text-primary-text font-sans">
      <nav className="bg-secondary-bg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-text">
                HackHiVE
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/campaigns" className="text-primary-text hover:text-primary-accent px-3 py-2 rounded-md text-sm font-medium">
                  Campaigns
                </Link>
                <Link to="/campaigns/create" className="text-primary-text hover:text-primary-accent px-3 py-2 rounded-md text-sm font-medium">
                  Create Campaign
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-secondary-text text-sm">v1.0</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-primary-text mb-4">Welcome to HackHiVE</h1>
              <p className="text-secondary-text mb-8">Manage your campaigns efficiently.</p>
              <Link to="/campaigns" className="bg-primary-accent text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90">
                View Campaigns
              </Link>
            </div>
          } />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/create" element={<CampaignCreate />} />
          <Route path="/campaigns/:id" element={<CampaignDetailLayout />}>
            <Route index element={<Navigate to="content" replace />} />
            <Route path="content" element={<CampaignContent />} />
            <Route path="assets" element={<CampaignAssets />} />
            <Route path="schedule" element={<CampaignSchedule />} />
            <Route path="feedback" element={<CampaignFeedback />} />
            <Route path="analytics" element={<CampaignAnalytics />} />
            <Route path="team" element={<CampaignTeam />} />
          </Route>
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
