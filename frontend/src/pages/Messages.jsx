import React, { useEffect, useMemo, useState } from 'react';
import client from '../api/client.js';

function formatChatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatListTime(value) {
  if (!value) return 'Now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Now';
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

export default function MessagesPage({ user, go }) {
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [partnerFromNavigation, setPartnerFromNavigation] = useState(null);

  const loadConversations = async () => {
    try {
      const response = await client.get('/messages/conversations');
      const list = Array.isArray(response.data) ? response.data : [];
      setConversations(list);

      const savedPartnerRaw = localStorage.getItem('messagePartner');
      if (savedPartnerRaw) {
        const parsed = JSON.parse(savedPartnerRaw);
        if (parsed?.id) {
          setPartnerFromNavigation(parsed);
          setActiveId(String(parsed.id));
          localStorage.removeItem('messagePartner');
          return;
        }
      }

      if (!activeId && list.length) {
        setActiveId(String(list[0].partnerId));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeId) {
      setThread([]);
      return;
    }

    const loadThread = async () => {
      try {
        const response = await client.get(`/messages/${activeId}`);
        setThread(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error loading thread:', error);
        setThread([]);
      }
    };

    loadThread();
  }, [activeId]);

  const filtered = conversations.filter((c) => {
    const name = String(c.partnerName || '').toLowerCase();
    const role = String(c.partnerRole || '').toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || role.includes(query);
  });

  const activeConversation = useMemo(() => {
    const found = conversations.find((c) => String(c.partnerId) === String(activeId));
    if (found) return found;
    if (partnerFromNavigation && String(partnerFromNavigation.id) === String(activeId)) {
      return {
        partnerId: partnerFromNavigation.id,
        partnerName: partnerFromNavigation.name,
        partnerRole: partnerFromNavigation.role,
        partnerSubtitle: partnerFromNavigation.subtitle,
        lastMessage: '',
        unreadCount: 0,
        lastMessageAt: null
      };
    }
    return null;
  }, [activeId, conversations, partnerFromNavigation]);

  const handleSend = async () => {
    if (!activeId || !draft.trim() || sending) return;
    try {
      setSending(true);
      const response = await client.post(`/messages/${activeId}`, { content: draft.trim() });
      const newMessage = response.data;
      setThread((prev) => [...prev, newMessage]);
      setDraft('');
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="flex h-screen w-full bg-[#f5f7f8] dark:bg-[#101b22] text-slate-900 dark:text-white">
    <main className="flex-1 flex flex-row overflow-hidden bg-[#f5f7f8] dark:bg-[#101b22]">
      <aside className="w-full sm:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard')}
                className="h-9 px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>
          </div>
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="Search chats..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {loading ? (
            <div className="px-3 py-4 text-sm text-slate-500">Loading conversations...</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-4 text-sm text-slate-500">No conversations yet.</div>
          ) : filtered.map((chat) => (
            <div
              key={chat.partnerId}
              onClick={() => setActiveId(String(chat.partnerId))}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors group ${
                String(chat.partnerId) === String(activeId)
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className="size-12 rounded-xl bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]"
                  data-alt={`Avatar of ${chat.partnerName}`}
                />
                {String(chat.partnerId) === String(activeId) && (
                  <div className="absolute -bottom-1 -right-1 size-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold truncate">{chat.partnerName}</h3>
                  <span className={`text-[10px] font-medium ${String(chat.partnerId) === String(activeId) ? 'text-primary' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                    {formatListTime(chat.lastMessageAt)}
                  </span>
                </div>
                <p className={`text-xs truncate ${String(chat.partnerId) === String(activeId) ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {chat.lastMessage || 'Start chatting'}
                </p>
              </div>
              {Number(chat.unreadCount || 0) > 0 && <div className="size-2 bg-primary rounded-full" />}
            </div>
          ))}
        </div>
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div
              className="size-10 rounded-full bg-cover bg-center shrink-0 border-2 border-primary"
              data-alt="Profile avatar of founder Alex Rivers"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLDrYgssQ2DzRJCNMOGtmUbIl1NQZByl3yPuqjS_i1ECxqGQYcf13oGlIfpFtu1sIb4bZtMCwEAgOjczltd9CPPYfGmK43ifqxwGGABmZDSPL8SMF7nH8rJZD1RhVDoJB0vB0N3e5RTbOowMffg1BoD9VryRvxfoa9-LOymrZYS8BjWyGOemRVLLSnDoPLGdft-N330uezFrg-e7OcrwSaD7P1HfftvnWHY0vSlpw2hRvqXM_4kIprdBtCf34YyHS4BNoOD_2U7dc")'
              }}
            />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || 'Alex Rivers'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.company || 'TechVision AI'}</p>
            </div>
          </div>
        </div>
      </aside>
      <section className="flex-1 flex flex-col bg-white dark:bg-[#101b22]">
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div
              className="size-10 rounded-xl bg-gradient-to-br from-[#0d93f2] to-[#0ea5e9]"
              data-alt="Profile of active user"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">{activeConversation?.partnerName || 'Select a conversation'}</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {activeConversation?.partnerRole || 'Member'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 bg-green-500 rounded-full" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Conversation
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {!activeId ? (
            <div className="text-sm text-slate-500">Select a conversation to start messaging.</div>
          ) : thread.length === 0 ? (
            <div className="text-sm text-slate-500">No messages yet. Send the first message.</div>
          ) : thread.map((message) => {
            const mine = String(message.senderId) === String(user?.id);
            return (
              <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${mine ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-bl-none'}`}>
                  <p>{message.content}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-white/80' : 'text-slate-400'}`}>{formatChatTime(message.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <footer className="p-6 bg-white dark:bg-[#111a22] border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-end p-2 px-3 border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">add_circle</span>
              </button>
              <textarea
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 resize-none max-h-32 scrollbar-hide text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Type a message..."
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">mood</span>
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!activeId || sending || !draft.trim()}
              className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"wght" 700' }}
              >
                send
              </span>
            </button>
          </div>
        </footer>
      </section>
    </main>
  </div>
    </>
  );
}
