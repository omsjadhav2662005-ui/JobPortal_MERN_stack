import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { imgUrl, getAvatar, fmtDate } from '../utils/helpers';

export default function Inbox() {
  const { user } = useAuth();
  const { conversations, fetchConversations, sendMessage, markMsgsRead } = useData();
  const navigate = useNavigate();
  const [selected, setSelected]   = useState(null);
  const [text, setText]           = useState('');
  const [sending, setSending]     = useState(false);
  const [searchConv, setSearch]   = useState('');
  const bottomRef = useRef();

  useEffect(() => { fetchConversations(); }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected?._id, selected?.messages?.length]);

  // Keep selected conv in sync with the polled conversations list
  useEffect(() => {
    if (selected) {
      const updated = conversations.find(c => c._id === selected._id);
      if (updated) setSelected(updated);
    }
  }, [conversations]);

  const openConv = (conv) => { setSelected(conv); markMsgsRead(conv._id); };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected) return;
    setSending(true);
    const updated = await sendMessage(selected._id, text.trim());
    setText('');
    if (updated) setSelected(updated);
    setSending(false);
  };

  const getOther = (conv) => conv.participants?.find(p => p._id !== user._id);
  const unread   = (conv) => conv.messages?.filter(m => !m.read && (m.from?._id || m.from) !== user._id).length || 0;
  const lastMsg  = (conv) => conv.messages?.[conv.messages.length - 1];

  const sorted = [...conversations]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .filter(c => { const o = getOther(c); return !searchConv || o?.name?.toLowerCase().includes(searchConv.toLowerCase()); });

  const totalUnread = conversations.reduce((s, c) => s + unread(c), 0);

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 160px)', minHeight: '500px' }}>

        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-black text-lg text-gray-900">
              Messages{totalUnread > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{totalUnread}</span>}
            </h2>
            <input
              className="mt-3 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search conversations..."
              value={searchConv} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {sorted.length === 0 ? (
              <div className="text-center py-12 px-4">
                <i className="fas fa-comment-dots text-gray-200 text-3xl mb-2 block"></i>
                <p className="text-gray-400 text-sm">No conversations yet</p>
                <p className="text-gray-300 text-xs mt-1">Go to Network to message someone</p>
              </div>
            ) : sorted.map(conv => {
              const other = getOther(conv);
              const u     = unread(conv);
              const last  = lastMsg(conv);
              const src   = other?.profilePicture ? imgUrl(other.profilePicture) : getAvatar(other?.name);
              const isMe  = (last?.from?._id || last?.from) === user._id;
              return (
                <div key={conv._id} onClick={() => openConv(conv)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${selected?._id === conv._id ? 'bg-blue-50' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <img src={src} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    {u > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{u}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate ${u > 0 ? 'font-bold' : 'font-semibold'}`}>{other?.name}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{last && fmtDate(last.createdAt)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${u > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {last ? `${isMe ? 'You: ' : ''}${last.text}` : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <i className="fas fa-comment-dots text-5xl text-gray-200 mb-4"></i>
              <p className="font-semibold">Select a conversation</p>
              <p className="text-sm text-gray-300 mt-1">Choose from your messages on the left</p>
            </div>
          ) : (
            <>
              {/* Header — click name to go to profile */}
              {(() => {
                const other = getOther(selected);
                const src   = other?.profilePicture ? imgUrl(other.profilePicture) : getAvatar(other?.name);
                return (
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white">
                    <img src={src} className="w-9 h-9 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <button onClick={() => navigate(`/profile/${other?._id}`)}
                        className="font-bold text-sm hover:text-blue-600 transition text-left">
                        {other?.name}
                      </button>
                      <p className="text-xs text-gray-400">{other?.headline || other?.email}</p>
                    </div>
                    <button onClick={() => navigate(`/profile/${getOther(selected)?._id}`)}
                      className="text-xs text-blue-600 hover:underline px-2 py-1 rounded-lg border border-blue-100 hover:bg-blue-50 transition">
                      View Profile
                    </button>
                  </div>
                );
              })()}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
                {selected.messages?.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">Say hello! 👋</div>
                )}
                {selected.messages?.map((msg, i) => {
                  const isMe     = (msg.from?._id || msg.from) === user._id;
                  const prev     = selected.messages[i - 1];
                  const sameUser = prev && (prev.from?._id || prev.from) === (msg.from?._id || msg.from);
                  const nextMsg  = selected.messages[i + 1];
                  const isLast   = !nextMsg || (nextMsg?.from?._id || nextMsg?.from) !== (msg.from?._id || msg.from);
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!sameUser && !isMe && <span className="text-xs text-gray-400 mb-1 ml-1">{msg.from?.name}</span>}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'}`}>
                          {msg.text}
                        </div>
                        {isLast && (
                          <span className="text-[10px] mt-1 text-gray-400 mx-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <i className={`fas ${msg.read ? 'fa-check-double text-blue-400' : 'fa-check text-gray-400'} ml-1 text-[9px]`}></i>}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex gap-2 px-4 py-3 border-t border-gray-100 bg-white">
                <input
                  type="text" value={text} onChange={e => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <button type="submit" disabled={sending || !text.trim()}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition disabled:opacity-50 flex-shrink-0">
                  {sending ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-paper-plane text-xs"></i>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
