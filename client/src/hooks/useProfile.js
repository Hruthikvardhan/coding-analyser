import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProfiles, saveProfile as saveProfileApi, deleteProfile as deleteProfileApi } from '../utils/api';

export default function useProfile(autoLoad = true) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProfiles();
      setProfiles(data.data);
    } catch (err) {
      toast.error('Failed to load saved profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(
    async (payload) => {
      try {
        await saveProfileApi(payload);
        toast.success('Profile saved');
        await load();
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save profile');
        return false;
      }
    },
    [load]
  );

  const remove = useCallback(async (id) => {
    try {
      await deleteProfileApi(id);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      toast.success('Profile deleted');
    } catch (err) {
      toast.error('Failed to delete profile');
    }
  }, []);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  return { profiles, loading, load, save, remove };
}
