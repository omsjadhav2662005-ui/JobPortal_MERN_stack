import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { imgUrl, getAvatar } from '../utils/helpers';
import API from '../api';

export default function Network() {
  const { user, refreshUser } = useAuth();
  const { users, fetchUsers, getOrCreateConv } = useData();
  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => { fetchUsers(search); }, [search]);

  const isConnected = (uid) => user?.connections?.includes(uid);
  const isPending   = (uid) => user?.connectionRequests?.some(r => r.from === uid && r.status === 'pending');

  const handleConnect = async (uid) => {
    if (!user) { navigate('/signin'); return; }
    setActionLoading(uid);
    try {
      if (isConnected(uid)) { await API.delete(`/users/connections/${uid}`); }
      else                  { await API.post(`/users/${uid}/connect`); }
      await refreshUser();
    } catch (e) { alert(e.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(''); }
  };

  const handleRespond = async (fromId, action) => {
    setActionLoading(fromId);
    try { await API.put(`/users/connections/${fromId}/respond`, { action }); await refreshUser(); }
    catch (e) { alert(e.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(''); }
  };

  const handleMessage = async (targetId) => {
    if (!user) { navigate('/signin'); return; }
    setActionLoading('msg-' + targetId);
    try { await getOrCreateConv(targetId); navigate('/inbox'); }
    finally { setActionLoading(''); }
  };

  const pendingRequests = user?.connectionRequests?.filter(r => r.status === 'pending') || [];

  const filtered = users.filter(u => {
    if (filter === 'connected') return isConnected(u._id);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">

      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 mb-6">
          <h2 className="font-bold mb-3 text-blue-700"><i className="fas fa-user-clock mr-2"></i>Connection Requests ({pendingRequests.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingRequests.map(req => {
              const sender = users.find(u => u._id === req.from);
              if (!sender) return null;
              const src = sender.profilePicture ? imgUrl(sender.profilePicture) : getAvatar(sender.name);
              return (
                <div key={req.from} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
                  <img src={src} onClick={() => navigate(`/profile/${sender._id}`)}
                    className="w-10 h-10 rounded-xl object-cover cursor-pointer hover:opacity-80 transition" alt="" />
                  <div className="flex-1 min-w-0">
                    <button onClick={() => navigate(`/profile/${sender._id}`)}
                      className="font-semibold text-sm hover:text-blue-600 transition text-left">{sender.name}</button>
                    <p className="text-xs text-gray-500 truncate">{sender.headline}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(req.from, 'accept')} disabled={actionLoading === req.from}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">Accept</button>
                    <button onClick={() => handleRespond(req.from, 'reject')} disabled={actionLoading === req.from}
                      className="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition">Decline</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-900"><i className="fas fa-users mr-2 text-blue-600"></i>Your Network</h1>
            <p className="text-gray-500 text-sm mt-0.5">{user?.connections?.length || 0} connections · {users.length} professionals</p>
          </div>
          <div className="flex gap-2">
            {['all', 'connected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${filter === f ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {f === 'all' ? 'Everyone' : 'Connected'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Search by name, headline, or skill..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>

        {!user && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-800">
            <i className="fas fa-info-circle mr-2"></i>
            <button onClick={() => navigate('/signin')} className="underline font-semibold">Sign in</button> to connect and message professionals.
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16"><i className="fas fa-users text-gray-200 text-5xl mb-3 block"></i><p className="text-gray-400">No users found</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(u => {
              const connected = isConnected(u._id);
              const src       = u.profilePicture ? imgUrl(u.profilePicture) : getAvatar(u.name);
              const loading   = actionLoading === u._id;
              return (
                <div key={u._id} className="border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={src} onClick={() => navigate(`/profile/${u._id}`)}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-100 cursor-pointer hover:opacity-80 transition" alt="" />
                    <div className="flex-1 min-w-0">
                      <button onClick={() => navigate(`/profile/${u._id}`)}
                        className="font-bold text-sm text-gray-900 hover:text-blue-600 transition text-left">{u.name}</button>
                      {u.headline && <p className="text-xs text-gray-500 leading-tight line-clamp-2">{u.headline}</p>}
                      {u.location && <p className="text-xs text-gray-400 mt-0.5"><i className="fas fa-map-pin mr-1"></i>{u.location}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-lg font-medium flex-shrink-0 ${u.role === 'employer' ? 'bg-purple-100 text-purple-600' : u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {u.role}
                    </span>
                  </div>
                  {u.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {u.skills.slice(0, 3).map(s => <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{s}</span>)}
                      {u.skills.length > 3 && <span className="text-xs text-gray-400">+{u.skills.length - 3}</span>}
                    </div>
                  )}
                  {user && (
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/profile/${u._id}`)}
                        className="flex-none px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition">
                        <i className="fas fa-user mr-1"></i>Profile
                      </button>
                      <button onClick={() => handleConnect(u._id)} disabled={loading}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-60 ${connected ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className={`fas ${connected ? 'fa-user-check' : 'fa-user-plus'} mr-1`}></i>{connected ? 'Connected' : 'Connect'}</>}
                      </button>
                      <button onClick={() => handleMessage(u._id)} disabled={actionLoading === 'msg-' + u._id}
                        className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-60">
                        {actionLoading === 'msg-' + u._id ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-comment mr-1"></i>Message</>}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
