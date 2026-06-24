import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { NotificationToast } from './components/NotificationToast';
import { Dashboard } from './pages/Dashboard';
import { MilestoneDetail } from './pages/MilestoneDetail';
import { NewsPage } from './pages/NewsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/milestone/:id" element={<MilestoneDetail />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
      <NotificationToast />
    </BrowserRouter>
  );
}