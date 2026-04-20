import { Route, Routes } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import DashboardPage from '../../Pages/DashboardPage/DashboardPage';
import WeeklyPage from '../../Pages/WeeklyPage/WeeklyPage';
import StudyPage from '../../Pages/StudyPage/StudyPage';
import MoneyPage from '../../Pages/MoneyPage/MoneyPage';
import SettingsPage from '../../Pages/SettingsPage/SettingsPage';
import Page404 from '../../Pages/Page404/Page404';

function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f9f4ef] text-[#2f2a26]">
      <Sidebar />

      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto min-h-[calc(100vh-2rem)] max-w-7xl rounded-[32px] border border-[#eadfd7] bg-[#fcfaf8] p-5 shadow-[0_10px_30px_rgba(97,72,57,0.05)] md:p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/weekly" element={<WeeklyPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/money" element={<MoneyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default Layout;