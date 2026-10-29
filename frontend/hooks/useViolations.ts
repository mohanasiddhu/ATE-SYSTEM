import { useState, useEffect } from 'react';
import { violationApi, challanApi } from '../api/index.js';

export function useViolations() {
  const [violations, setViolations] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [vRes, cRes] = await Promise.all([
        violationApi.getAll(),
        challanApi.getAll()
      ]);
      if (vRes.success) setViolations(vRes.data);
      if (cRes.success) setChallans(cRes.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { violations, challans, loading, refreshData };
}
