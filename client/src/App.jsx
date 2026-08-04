import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import Compare from './pages/Compare';
import SavedProfiles from './pages/SavedProfiles';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <div className="min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#111A2C', color: '#e2e8f0', border: '1px solid #243252' }
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/saved" element={<SavedProfiles />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}
