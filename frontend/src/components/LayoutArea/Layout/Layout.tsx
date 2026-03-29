import { Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';
import DashboardPage from '../../Pages/DashboardPage/DashboardPage';
import WeeklyPage from '../../Pages/WeeklyPage/WeeklyPage';
import StudyPage from '../../Pages/StudyPage/StudyPage';
import MoneyPage from '../../Pages/MoneyPage/MoneyPage';
import SettingsPage from '../../Pages/SettingsPage/SettingsPage';
import Page404 from '../../Pages/Page404/Page404';

function Layout() {
  return (
    <div className="layout-shell">
      <Header />

      <div className="layout-body">
        <Sidebar />

        <main className="layout-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/weekly" element={<WeeklyPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/money" element={<MoneyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;