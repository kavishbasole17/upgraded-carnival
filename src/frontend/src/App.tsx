import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import Database from './pages/Database';
import Triage from './pages/Triage';

function App() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/database" element={<Database />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
