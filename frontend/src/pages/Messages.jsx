import React, { useEffect, useMemo, useRef, useState } from 'react';
import client from '../api/client.js';

function formatChatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatListTime(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatDayLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diff = Math.floor((today - target) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function avatarUrl(name) {
  const safeName = encodeURIComponent(String(name || 'User'));
  return `https://ui-avatars.com/api/?name=${safeName}&background=e2e8f0&color=0f172a&size=128`;
}

function isFileMessage(content) {
  const text = String(content || '').trim();
  if (!text) return null;

  const urlFileMatch = text.match(/https?:\/\/\S+\/(?:[^/?#]+\.)?(pdf|docx?|pptx?|xlsx?)\b[^\s]*$/i);
  if (urlFileMatch) {
    const clean = text.split('?')[0];
    const fileName = clean.substring(clean.lastIndexOf('/') + 1) || 'Attachment';
    return { fileName, link: text };
  }

  const nameMatch = text.match(/^([\w\s,-]+\.(pdf|docx?|pptx?|xlsx?))$/i);
  if (nameMatch) {
    return { fileName: nameMatch[1], link: null };
  }

  return null;
}

function normalizeRole(role) {
  const value = String(role || '').toLowerCase();
  if (value.includes('investor')) return 'Investor';
  if (value.includes('startup')) return 'Startup';
  if (!value) return 'Member';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMessageTickStatus(message) {
  if (!message) return { icon: 'check', label: 'Sent', className: 'text-white/80' };
  const isRead = Boolean(message.isRead || message.readAt);
  if (isRead) {
    return { icon: 'done_all', label: 'Read', className: 'text-sky-200' };
  }
  return { icon: 'check', label: 'Sent', className: 'text-white/80' };
}

function formatPresenceStatus(conversation) {
  if (!conversation) return 'Offline';
  if (conversation.partnerIsActive) return 'Active now';
  if (!conversation.partnerLastSeenAt) return 'Offline';
  return `Last seen ${formatListTime(conversation.partnerLastSeenAt).toLowerCase()}`;
}

export default function MessagesPage({ user, go }) {
  const currentUserId = String(user?.id || user?._id || '');
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [partnerFromNavigation, setPartnerFromNavigation] = useState(null);
  const threadRef = useRef(null);

  const dashboardView = user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard';
  const portfolioView = user?.role === 'startup' ? 'startup-profile' : user?.role === 'admin' ? 'admin-users' : 'investor-profile';
  const networkView = user?.role === 'startup' ? 'startup-connect' : user?.role === 'admin' ? 'admin-moderation' : 'investor-connect';

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

  const loadThread = async (partnerId) => {
    if (!partnerId) {
      setThread([]);
      return;
    }

    try {
      const response = await client.get(`/messages/${partnerId}`);
      setThread(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading thread:', error);
      setThread([]);
    }
  };

  useEffect(() => {
    if (!activeId) {
      setThread([]);
      return;
    }

    loadThread(activeId);
  }, [activeId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.hidden) return;

      loadConversations();
      if (activeId) {
        loadThread(activeId);
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [activeId]);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [thread]);

  const filtered = conversations.filter((c) => {
    const name = String(c.partnerName || '').toLowerCase();
    const role = String(c.partnerRole || '').toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = name.includes(query) || role.includes(query);
    if (!matchesSearch) return false;
    if (tab === 'all') return true;
    if (tab === 'unread') return Number(c.unreadCount || 0) > 0;
    if (tab === 'investors') return role.includes('investor');
    if (tab === 'startups') return role.includes('startup');
    return true;
  });

  const unreadCount = useMemo(
    () => conversations.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0),
    [conversations]
  );

  const activeConversation = useMemo(() => {
    const found = conversations.find((c) => String(c.partnerId) === String(activeId));
    if (found) return found;
    if (partnerFromNavigation && String(partnerFromNavigation.id) === String(activeId)) {
      return {
        partnerId: partnerFromNavigation.id,
        partnerName: partnerFromNavigation.name,
        partnerRole: partnerFromNavigation.role,
        partnerSubtitle: partnerFromNavigation.subtitle,
        partnerIsActive: false,
        partnerLastSeenAt: null,
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

  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastLabel = '';
    thread.forEach((item) => {
      const label = formatDayLabel(item.createdAt);
      if (label && label !== lastLabel) {
        groups.push({ type: 'divider', label, key: `divider-${item._id}-${label}` });
        lastLabel = label;
      }
      groups.push({ type: 'message', item, key: item._id });
    });
    return groups;
  }, [thread]);

  const headerStatus = formatPresenceStatus(activeConversation);

  const sidebarItems = [
    { label: 'Dashboard', icon: 'dashboard', view: dashboardView },
    { label: 'Messages', icon: 'chat', view: 'messages' },
    { label: 'Portfolio', icon: 'work', view: portfolioView },
    { label: 'Network', icon: 'groups', view: networkView },
    { label: 'Settings', icon: 'settings', view: 'settings' }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f5f8] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="hidden w-[190px] shrink-0 flex-col border-r border-slate-200 bg-[#f7f8fa] dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <div className="px-5 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">StartupPlatform</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Investor Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const active = item.view === 'messages';
            return (
              <button
                key={item.label}
                onClick={() => go(item.view)}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {initials(user?.name || 'User')}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name || 'User'}</p>
              <p className="truncate text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{normalizeRole(user?.role)}</p>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex w-full min-w-0">
        <aside className="w-full max-w-[390px] border-r border-slate-200 bg-[#f2f4f7] dark:border-slate-800 dark:bg-slate-900/70">
          <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
            <h1 className="text-[32px] font-bold leading-none">Messages</h1>
            <div className="relative mt-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations"
                className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-[13px] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="mt-4 flex items-center gap-5 text-sm">
              {[
                { key: 'all', label: 'All' },
                { key: 'investors', label: 'Investors' },
                { key: 'startups', label: 'Startups' },
                { key: 'unread', label: `Unread${unreadCount > 0 ? ` ${unreadCount}` : ''}` }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setTab(option.key)}
                  className={`border-b-2 pb-2 text-[13px] transition-colors ${tab === option.key ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[calc(100vh-208px)] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-6 text-sm text-slate-500">Loading conversations...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">No conversations found.</div>
            ) : (
              filtered.map((chat) => {
                const isActive = String(chat.partnerId) === String(activeId);
                const fileData = isFileMessage(chat.lastMessage);
                return (
                  <button
                    key={chat.partnerId}
                    onClick={() => setActiveId(String(chat.partnerId))}
                    className={`w-full border-l-[3px] px-5 py-4 text-left transition-colors ${isActive ? 'border-primary bg-white dark:bg-slate-800' : 'border-transparent hover:bg-white/80 dark:hover:bg-slate-800/70'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative mt-0.5">
                        <img
                          src={avatarUrl(chat.partnerName)}
                          alt={chat.partnerName}
                          className="size-11 rounded-full object-cover"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 dark:border-slate-800 ${chat.partnerIsActive ? 'border-slate-100 bg-emerald-500' : 'border-slate-200 bg-slate-400 dark:bg-slate-500'}`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[15px] font-semibold text-slate-900 dark:text-slate-100">{chat.partnerName}</p>
                          <p className="shrink-0 text-[11px] text-slate-400">{formatListTime(chat.lastMessageAt)}</p>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {fileData ? `Sent a file: ${fileData.fileName}` : chat.lastMessage || 'Start chatting'}
                        </p>
                      </div>

                      {Number(chat.unreadCount || 0) > 0 && (
                        <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-[#f7f8fa] dark:bg-slate-900/40">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-7 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <img
                  src={avatarUrl(activeConversation?.partnerName || 'User')}
                  alt={activeConversation?.partnerName || 'User'}
                  className="size-12 rounded-full object-cover"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-slate-900 ${activeConversation?.partnerIsActive ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'}`} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-base font-semibold">{activeConversation?.partnerName || 'Select a conversation'}</h2>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {normalizeRole(activeConversation?.partnerRole)}
                  </span>
                </div>
                <p className={`text-xs ${activeConversation?.partnerIsActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{headerStatus}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-300">
              <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" type="button">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </button>
              <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" type="button">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </button>
              <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" type="button">
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>
            </div>
          </header>

          <div ref={threadRef} className="flex-1 space-y-4 overflow-y-auto px-7 py-6">
            {!activeId ? (
              <div className="text-sm text-slate-500">Select a conversation to start messaging.</div>
            ) : groupedMessages.length === 0 ? (
              <div className="text-sm text-slate-500">No messages yet. Send the first message.</div>
            ) : (
              groupedMessages.map((entry) => {
                if (entry.type === 'divider') {
                  return (
                    <div key={entry.key} className="flex items-center justify-center">
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {entry.label}
                      </span>
                    </div>
                  );
                }

                const message = entry.item;
                const mine = String(message.senderId) === currentUserId;
                const fileData = isFileMessage(message.content);

                return (
                  <div key={entry.key} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[64%] rounded-2xl px-4 py-3 text-[14px] shadow-sm ${mine ? 'rounded-br-md bg-[#0d93f2] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                      {fileData ? (
                        <div>
                          <p className={`mb-2 text-xs ${mine ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>Shared a document</p>
                          <div className={`flex items-center gap-3 rounded-xl px-3 py-2 ${mine ? 'bg-white/15' : 'border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/40'}`}>
                            <span className="material-symbols-outlined text-[20px]">description</span>
                            <div className="min-w-0 flex-1">
                              {fileData.link ? (
                                <a href={fileData.link} target="_blank" rel="noreferrer" className="block truncate text-sm font-semibold underline-offset-2 hover:underline">
                                  {fileData.fileName}
                                </a>
                              ) : (
                                <p className="truncate text-sm font-semibold">{fileData.fileName}</p>
                              )}
                              <p className={`text-[10px] uppercase ${mine ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'}`}>File Document</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      )}

                      <div className={`mt-2 flex items-center gap-1 text-[10px] ${mine ? 'justify-end text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                        <span>{formatChatTime(message.createdAt)}</span>
                        {mine && (() => {
                          const tick = getMessageTickStatus(message);
                          return (
                            <span
                              className={`material-symbols-outlined text-[14px] leading-none ${tick.className}`}
                              title={tick.label}
                              aria-label={tick.label}
                            >
                              {tick.icon}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <footer className="border-t border-slate-200 bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
              <button className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" type="button">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
              </button>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={1}
                placeholder="Type a message..."
                className="h-9 flex-1 resize-none bg-transparent pt-2 text-[14px] outline-none placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button className="rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" type="button">
                <span className="material-symbols-outlined text-[20px]">mood</span>
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!activeId || sending || !draft.trim()}
                className="flex size-11 items-center justify-center rounded-full bg-[#0d93f2] text-white transition hover:bg-[#0b84da] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-400">Shift + Enter to add a new line</p>
          </footer>
        </main>
      </section>
    </div>
  );
}
