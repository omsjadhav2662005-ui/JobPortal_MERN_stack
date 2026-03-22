import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { imgUrl, getAvatar, fmtDate } from '../utils/helpers';
import API from '../api';

export default function UserProfile() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user, refreshUser } = useAuth();
  const { getOrCreateConv }   = useData();

  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setAction]  = useState('');
  const [activeTab, setActiveTab]   = useState('about');

  useEffect(() => {
    setLoading(true);
    API.get(`/users/${id}`)
      .then(r => setProfile(r.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isMe        = user?._id === id;
  const isConnected = user?.connections?.includes(id);
  const hasPending  = user?.connectionRequests?.some(r => r.from === id && r.status === 'pending');

  const handleConnect = async () => {
    if (!user) { navigate('/signin'); return; }
    setAction('connect');
    try {
      if (isConnected) { await API.delete(`/users/connections/${id}`); }
      else             { await API.post(`/users/${id}/connect`); }
      await refreshUser();
    } catch (e) { alert(e.response?.data?.message || 'Action failed'); }
    finally { setAction(''); }
  };

  const handleAccept = async () => {
    setAction('accept');
    try { await API.put(`/users/connections/${id}/respond`, { action: 'accept' }); await refreshUser(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
    finally { setAction(''); }
  };

  const handleMessage = async () => {
    if (!user) { navigate('/signin'); return; }
    setAction('msg');
    try { await getOrCreateConv(id); navigate('/inbox'); }
    finally { setAction(''); }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <i className="fas fa-spinner fa-spin text-blue-600 text-3xl"></i>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-32">
      <i className="fas fa-user-slash text-gray-200 text-5xl mb-4 block"></i>
      <h2 className="text-2xl font-bold text-gray-500">User not found</h2>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mt-2 block mx-auto">Go back</button>
    </div>
  );

  const avatar = profile.profilePicture ? imgUrl(profile.profilePicture) : getAvatar(profile.name);
  const tabs   = ['about', 'experience', 'education', 'skills', 'certifications'];

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-5">

      {/* Cover + Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Cover — clip only this div so the avatar can overflow freely */}
        <div className="h-36 bg-gradient-to-r from-blue-600 to-indigo-600 relative rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=60)', backgroundSize: 'cover' }} />
        </div>

        {/* Avatar + name row */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 relative z-10">
            <img src={avatar} alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" />
            {/* Action buttons */}
            {!isMe && user && (
              <div className="flex flex-wrap gap-2 pb-1">
                {hasPending ? (
                  <button onClick={handleAccept} disabled={actionLoading === 'accept'}
                    className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60">
                    {actionLoading === 'accept' ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-user-check mr-1"></i>}
                    Accept Request
                  </button>
                ) : (
                  <button onClick={handleConnect} disabled={actionLoading === 'connect'}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-60 ${isConnected ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {actionLoading === 'connect' ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className={`fas ${isConnected ? 'fa-user-minus' : 'fa-user-plus'} mr-1`}></i>}
                    {isConnected ? 'Remove Connection' : 'Connect'}
                  </button>
                )}
                <button onClick={handleMessage} disabled={actionLoading === 'msg'}
                  className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-60">
                  {actionLoading === 'msg' ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-comment mr-1"></i>}
                  Message
                </button>
              </div>
            )}
            {isMe && (
              <button onClick={() => navigate('/dashboard')}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                <i className="fas fa-edit mr-1"></i>Edit Profile
              </button>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900">{profile.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profile.role === 'employer' ? 'bg-purple-100 text-purple-700' : profile.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {profile.role}
              </span>
              {isConnected && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium"><i className="fas fa-check mr-1"></i>Connected</span>}
            </div>
            {profile.headline && <p className="text-gray-600 mt-1">{profile.headline}</p>}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              {profile.location && <span><i className="fas fa-map-pin mr-1 text-gray-400"></i>{profile.location}</span>}
              {profile.email    && <span><i className="fas fa-envelope mr-1 text-gray-400"></i>{profile.email}</span>}
              {profile.phone    && <span><i className="fas fa-phone mr-1 text-gray-400"></i>{profile.phone}</span>}
            </div>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span><i className="fas fa-users mr-1 text-blue-400"></i>{profile.connections?.length || 0} connections</span>
              {profile.experience?.some(e => e.current) && (
                <span><i className="fas fa-briefcase mr-1 text-blue-400"></i>
                  {profile.experience.find(e => e.current)?.title} at {profile.experience.find(e => e.current)?.company}
                </span>
              )}
            </div>

            {/* Social links */}
            {profile.socialLinks && (
              <div className="flex gap-3 mt-3">
                {profile.socialLinks.linkedin  && <a href={profile.socialLinks.linkedin}  target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-lg"><i className="fab fa-linkedin"></i></a>}
                {profile.socialLinks.github    && <a href={profile.socialLinks.github}    target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black text-lg"><i className="fab fa-github"></i></a>}
                {profile.socialLinks.twitter   && <a href={profile.socialLinks.twitter}   target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700 text-lg"><i className="fab fa-twitter"></i></a>}
                {profile.socialLinks.portfolio && <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 text-lg"><i className="fas fa-globe"></i></a>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-3.5 text-sm font-semibold capitalize whitespace-nowrap transition border-b-2 ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* About */}
          {activeTab === 'about' && (
            <div>
              {profile.about ? <p className="text-gray-700 leading-relaxed">{profile.about}</p>
                : <p className="text-gray-400 text-sm italic">No bio provided.</p>}
            </div>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-5">
              {profile.experience?.length ? profile.experience.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-briefcase text-blue-600 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{exp.title}</p>
                      {exp.current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Current</span>}
                    </div>
                    <p className="text-blue-600 font-medium text-sm">{exp.company}</p>
                    {exp.duration && <p className="text-gray-400 text-xs mt-0.5"><i className="fas fa-calendar mr-1"></i>{exp.duration}</p>}
                    {exp.description && <p className="text-gray-600 text-sm mt-1 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              )) : <p className="text-gray-400 text-sm italic">No experience added.</p>}
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div className="space-y-5">
              {profile.education?.length ? profile.education.map((edu, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-graduation-cap text-indigo-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-indigo-600 font-medium text-sm">{edu.institution}</p>
                    {edu.year && <p className="text-gray-400 text-xs mt-0.5"><i className="fas fa-calendar mr-1"></i>{edu.year}</p>}
                    {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
                  </div>
                </div>
              )) : <p className="text-gray-400 text-sm italic">No education added.</p>}
            </div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <div>
              {profile.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              ) : <p className="text-gray-400 text-sm italic">No skills added.</p>}
            </div>
          )}

          {/* Certifications */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              {profile.certifications?.length ? profile.certifications.map((cert, i) => (
                <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-100 transition">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-certificate text-amber-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{cert.name}</p>
                    <p className="text-amber-600 font-medium text-sm">{cert.issuer}</p>
                    {cert.year && <p className="text-gray-400 text-xs mt-0.5">{cert.year}</p>}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        <i className="fas fa-external-link-alt mr-1"></i>View credential
                      </a>
                    )}
                  </div>
                </div>
              )) : <p className="text-gray-400 text-sm italic">No certifications added.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
