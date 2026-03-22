import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import API from '../api';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [jobs, setJobs]             = useState([]);
  const [companies, setCompanies]   = useState([]);
  const [users, setUsers]           = useState([]);
  const [conversations, setConvs]   = useState([]);
  const [myApplications, setMyApps] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [jobMeta, setJobMeta]       = useState({ total: 0, page: 1, pages: 1 });

  // Polling refs
  const pollRef      = useRef(null);
  const pollActive   = useRef(false);

  useEffect(() => {
    fetchJobs(); fetchCompanies();
    if (localStorage.getItem('token')) { fetchUsers(); fetchConversations(); fetchMyApplications(); }
  }, []);

  // ── Polling: refresh conversations every 3 s when user is logged in ──
  const startPolling = useCallback(() => {
    if (pollActive.current) return;
    pollActive.current = true;
    pollRef.current = setInterval(async () => {
      if (!localStorage.getItem('token')) { stopPolling(); return; }
      try {
        const { data } = await API.get('/conversations');
        setConvs(data);
      } catch { /* silently ignore */ }
    }, 3000);
  }, []);

  const stopPolling = useCallback(() => {
    pollActive.current = false;
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) startPolling();
    return stopPolling;
  }, [startPolling, stopPolling]);

  const fetchJobs = async (params = {}) => {
    try { setLoading(true); const q = new URLSearchParams({ limit:12, ...params }).toString(); const { data } = await API.get(`/jobs?${q}`); setJobs(data.jobs); setJobMeta({ total:data.total, page:data.page, pages:data.pages }); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const fetchCompanies     = async () => { try { const { data } = await API.get('/companies'); setCompanies(data); } catch {} };
  const fetchUsers         = async (q='') => { try { const { data } = await API.get(`/users${q?`?search=${q}`:''}`); setUsers(data); } catch {} };
  const fetchConversations = async () => { try { const { data } = await API.get('/conversations'); setConvs(data); } catch {} };
  const fetchMyApplications= async () => { try { const { data } = await API.get('/applications/my'); setMyApps(data); } catch {} };

  const addJob    = async (d) => { const { data } = await API.post('/jobs', d); setJobs(p => [data,...p]); return data; };
  const updateJob = async (id, d) => { const { data } = await API.put(`/jobs/${id}`, d); setJobs(p => p.map(j => j._id===id ? data : j)); return data; };
  const deleteJob = async (id) => { await API.delete(`/jobs/${id}`); setJobs(p => p.filter(j => j._id!==id)); };

  const applyToJob   = async (jobId, coverNote='') => { const { data } = await API.post('/applications', { jobId, coverNote }); await fetchMyApplications(); return data; };
  const withdrawApp  = async (id) => { await API.delete(`/applications/${id}`); await fetchMyApplications(); };
  const getJobApps   = async (jobId) => { const { data } = await API.get(`/applications/job/${jobId}`); return data; };
  const updateStatus = async (id, status, extra={}) => { const { data } = await API.put(`/applications/${id}/status`, { status, ...extra }); return data; };

  const getCompanyByName = async (n) => { try { const { data } = await API.get(`/companies/${encodeURIComponent(n)}`); return data; } catch { return null; } };
  const addReview = async (name, review) => { const { data } = await API.put(`/companies/${encodeURIComponent(name)}`, { review }); setCompanies(p => p.map(c => c.name===name ? data : c)); return data; };

  const sendConnectionRequest = async (id) => API.post(`/users/${id}/connect`);
  const respondToConnection   = async (fromId, action) => API.put(`/users/connections/${fromId}/respond`, { action });
  const removeConnection      = async (id) => { await API.delete(`/users/connections/${id}`); };

  const getOrCreateConv = async (recipientId) => { const { data } = await API.post('/conversations', { recipientId }); await fetchConversations(); return data; };
  const sendMessage     = async (convId, text) => {
    const { data } = await API.post(`/conversations/${convId}/messages`, { text });
    setConvs(p => p.map(c => c._id===convId ? data : c));
    return data;
  };
  const markMsgsRead    = async (convId) => { await API.put(`/conversations/${convId}/read`); };

  return <DataContext.Provider value={{
    jobs, companies, users, conversations, myApplications, loading, jobMeta,
    fetchJobs, fetchCompanies, fetchUsers, fetchConversations, fetchMyApplications,
    addJob, updateJob, deleteJob, applyToJob, withdrawApp, getJobApps, updateStatus,
    getCompanyByName, addReview,
    sendConnectionRequest, respondToConnection, removeConnection,
    getOrCreateConv, sendMessage, markMsgsRead,
    startPolling, stopPolling,
  }}>{children}</DataContext.Provider>;
};
