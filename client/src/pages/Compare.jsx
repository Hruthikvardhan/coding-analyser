import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { getProfiles, compareProfiles } from '../utils/api';
import ProfileCompareCard from '../components/ProfileCompareCard';
import ScoreGauge from '../components/UI/ScoreGauge';

export default function Compare() {
  const [profiles, setProfiles] = useState([]);
  const [id1, setId1] = useState('');
  const [id2, setId2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfiles()
      .then(({ data }) => setProfiles(data.data))
      .catch(() => toast.error('Failed to load saved profiles'));
  }, []);

  const handleCompare = async () => {
    if (!id1 || !id2) {
      toast.error('Select two saved profiles to compare');
      return;
    }
    if (id1 === id2) {
      toast.error('Pick two different profiles');
      return;
    }
    setLoading(true);
    try {
      const { data } = await compareProfiles(id1, id2);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Compare Profiles</h1>
      <p className="text-slate-400 text-sm mb-6">
        Pick two saved profiles to see a category-by-category breakdown.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <select className="input-field" value={id1} onChange={(e) => setId1(e.target.value)}>
          <option value="">Select profile 1</option>
          {profiles.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <select className="input-field" value={id2} onChange={(e) => setId2(e.target.value)}>
          <option value="">Select profile 2</option>
          {profiles.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleCompare} disabled={loading} className="btn-primary mb-8">
        {loading ? 'Comparing…' : 'Compare'}
      </button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="card p-6 flex items-center justify-around">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">{result.profiles.p1.name}</p>
              <ScoreGauge score={result.profiles.p1.overallScore} size={120} strokeWidth={9} />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">Overall winner</p>
              <p className="font-stat text-lg text-amber-400">
                {result.overallWinner === 'tie'
                  ? "It's a tie"
                  : result.overallWinner === 'p1'
                  ? result.profiles.p1.name
                  : result.profiles.p2.name}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">{result.profiles.p2.name}</p>
              <ScoreGauge score={result.profiles.p2.overallScore} size={120} strokeWidth={9} />
            </div>
          </div>

          <ProfileCompareCard
            categories={result.categories}
            p1Name={result.profiles.p1.name}
            p2Name={result.profiles.p2.name}
          />
        </motion.div>
      )}
    </div>
  );
}
