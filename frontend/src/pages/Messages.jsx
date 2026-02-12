import React, { useMemo, useState } from 'react';

export default function MessagesPage({ user, go }) {
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');

  const conversations = useMemo(
    () => [
      {
        id: 1,
        name: 'Sarah Chen',
        role: 'Investor • Sequoia Capital',
        last: 'The updated pitch deck looks impressive. Let\'s...',
        time: 'Just now',
        unread: true,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCdKfj_71AG6YLvmQHgzYONz1slbr7sc19agZ543JHBs1Xc3xpte37M2FFl7fef6HbMt379FNvNvKAtMW9EqZwc_ocLoRvlHV5De8nvfFjo1zknvtDNQu7ZK1oSQqa7MxbJ9kA-Wniv7NYiQ4AT11PMQhI8Xv6nALHkToqq40lRPJc8w4ZAIKQjEzTbUZf2lbRbP6Z2waZY3mtnvWnwWuRU7TYktKqBwu8ucgksw4hd16uqe9istbQwGdtrWYCia9sr0TRD3GJ0lSQ'
      },
      {
        id: 2,
        name: 'David Miller',
        role: 'Founder • CloudScale AI',
        last: 'Thanks for the feedback on the Series A terms.',
        time: '10:45 AM',
        unread: false,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCAL-NRIwE4CLq6hHhvdYx5uZzcne7WDf6lZaX_1Idz_5GgIE1PJydUw9O1Us7UpRYO9U8hOCyMM-6PQWqezLfNWV7e-DflpekxMRhv8wI1MkFb3H68FybljeG1_YMpz4MUSS_5diOh21HtyIV31fqmWHsIqEu1cuSww3hzy8-7WFXjcCnvqRrg39Hfme2F69gXZabNUpNcoPoYq4AHbTd9JpwOoIf8TSUN3vn0E4awkcV5_R3A_mgAG7ZW1jf9oYmPUPUkZLvE69w'
      },
      {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'VC Partner • Techstars',
        last: 'Can you share the NDA for the due diligence phase?',
        time: 'Yesterday',
        unread: false,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBPBk9X-JqgSE2lNAD9uMiW1peLJY4F-iWgfAsK7vaGjrOBC89Et3KIKczuLICVPHXBaThhW9cWshhLerOSiOPzY5E2FKhQT3nzLWH9t5sIHr13FZa6j1meR5lzLUIZnp1uT_z3CQsutsMLOYoAUEqUeD2tIF0hTFHAftEEqUIHsccWZ5n9ZKQ-lCkUIfUvxFlv-E8KKGsw3tVB67bq05OuQkrlLclptODqZ4Q7PVLFt9xhruDD-PRYxostIDUrnGIgcOk8JuUHvqE'
      },
      {
        id: 4,
        name: 'Marcus Thorne',
        role: 'Angel Investor',
        last: 'Sent a PDF document',
        time: 'Yesterday',
        unread: false,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDR9cC1o7-s_rtB-OqSCqrSeinlA9u4kl9hf7FUKp-pjgRHBu-ZamGYykot60STPdZyqvRY9_xTmgE7Ex56GsxopfaX9G6nHnXh6okWTi1WbVcTBD9tIWEAoEjQF9Kb9KdwN3vsRANyi4uL9doE3YillUZQ8BtngB7DUl15MkOQItsfZbRoHgDaH5gSdHtpXrcqFPgHYFatrehp9VC5AI-HYnzlqbwWMj0mrIgbIbHJTjBHqibevWW6UmZWvZLEp004B59hIKwo55c'
      }
    ],
    []
  );

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const active = filtered.find((c) => c.id === activeId) || filtered[0];

  const handleSend = () => {
    if (!draft.trim()) return;
    setDraft('');
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
    {/* Main Content Area: Messaging Dual-Pane */}
    <main className="flex-1 flex flex-row overflow-hidden bg-[#f5f7f8] dark:bg-[#101b22]">
      {/* Left Pane: Conversation List */}
      <aside className="w-full sm:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] flex flex-col">
        {/* Search & Header */}
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
            <button className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined">edit_square</span>
            </button>
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
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold whitespace-nowrap">
              All
            </button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700">
              Investors
            </button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700">
              Startups
            </button>
            <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700">
              Unread
            </button>
          </div>
        </div>
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {filtered.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveId(chat.id)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors group ${
                chat.id === activeId
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className="size-12 rounded-xl bg-cover bg-center"
                  data-alt={`Avatar of ${chat.name}`}
                  style={{ backgroundImage: `url("${chat.avatar}")` }}
                />
                {chat.id === activeId && (
                  <div className="absolute -bottom-1 -right-1 size-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold truncate">{chat.name}</h3>
                  <span className={`text-[10px] font-medium ${chat.id === activeId ? 'text-primary' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                    {chat.time}
                  </span>
                </div>
                <p className={`text-xs truncate ${chat.id === activeId ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {chat.last}
                </p>
              </div>
              {chat.unread && chat.id === activeId && <div className="size-2 bg-primary rounded-full" />}
            </div>
          ))}
        </div>
        {/* Profile Bottom */}
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
      {/* Right Pane: Active Chat Window */}
      <section className="flex-1 flex flex-col bg-white dark:bg-[#101b22]">
        {/* Chat Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div
              className="size-10 rounded-xl bg-cover bg-center"
              data-alt="Profile of active user"
              style={{ backgroundImage: `url("${active?.avatar}")` }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">{active?.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {active?.role?.split('•')?.[0]?.trim() || 'Investor'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 bg-green-500 rounded-full" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Active now
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              title="Schedule Meeting"
            >
              <span className="material-symbols-outlined">calendar_month</span>
            </button>
            <button
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              title="View Profile"
            >
              <span className="material-symbols-outlined">person</span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>
        {/* Messages History */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {/* Date Separator */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Yesterday
            </span>
            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
          </div>
          {/* Received Message */}
          <div className="flex items-end gap-3 max-w-[80%] lg:max-w-[60%]">
            <div
              className="size-8 rounded-lg bg-cover bg-center shrink-0 mb-1"
              data-alt="Sarah Chen's avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-F_aL4AiDpW8VxTs4KpIetBlR2xsw4zbgIX_RMPpQAvvo2siF7D-goV6IbRecPyzFASKORWuhCfCISoDOTuByruDMEzFwfH6AgzkiAs0R-2ZYgBAhVMcAkF8D9l43VVx7ghY4AXtClEtSyjtL7uIXyW5X8VqZFY54YnFej0PW2C5bpPscTDATpq5m91ei8HGS4SbWcaIW7q0-VAZhjxRQBKNYRlemyVADPU_0gSGroVMswyOK1C2fKlHdFkXnorMYYCo6bbofbRo")'
              }}
            />
            <div className="flex flex-col gap-1">
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed">
                Hi Alex, I've had a chance to review the initial financial
                projections you sent over on Tuesday.
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1">11:20 AM</span>
            </div>
          </div>
          {/* Sent Message */}
          <div className="flex items-end gap-3 justify-end ml-auto max-w-[80%] lg:max-w-[60%]">
            <div className="flex flex-col gap-1 items-end">
              <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-br-none shadow-lg shadow-primary/20 text-sm leading-relaxed">
                Glad to hear that! We tried to be as conservative as possible
                with the CAC estimates for Year 1.
              </div>
              <div className="flex items-center gap-1 px-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">11:24 AM</span>
                <span className="material-symbols-outlined text-[14px] text-primary">
                  done_all
                </span>
              </div>
            </div>
          </div>
          {/* Received Message with File */}
          <div className="flex items-end gap-3 max-w-[80%] lg:max-w-[60%]">
            <div
              className="size-8 rounded-lg bg-cover bg-center shrink-0 mb-1"
              data-alt="Sarah Chen's avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5_59wfqdWmGaqnjFRparKQAH2zsqxFcedkyMIw1Hh1mhsQKrohFTjI2IkxIxCcKL2krq3ilC2rjGB1G8MFJkryxYPC_IyUyOlXckKiQZFrCsi48X5Bx7XmBKcPZo_uqRXRvoc9DhK08NvvAur3ZXV5dGmi_s0lf3KJl9WOHrykFN-33NqTzZrkpV39oGqcRGAgQ8REzlef-lI5No8sMOlj7YwDH-RxALgfbtrTJiVE1S96p9JVJdpoCayMdbmN5SJXVhGePYeihg")'
              }}
            />
            <div className="flex flex-col gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed">
                Understood. Could you please share the updated deck with the new
                roadmap slides? My partners would like to see the Q3 expansion
                plan.
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1">11:26 AM</span>
            </div>
          </div>
          {/* Date Separator */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Today
            </span>
            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
          </div>
          {/* Sent Message with Attachment */}
          <div className="flex items-end gap-3 justify-end ml-auto max-w-[80%] lg:max-w-[60%]">
            <div className="flex flex-col gap-3 items-end w-full">
              <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-br-none shadow-lg shadow-primary/20 text-sm leading-relaxed">
                Absolutely. Here is the revised deck with the detailed roadmap
                on slide 14.
              </div>
              {/* Attachment Card */}
              <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      picture_as_pdf
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      TechVision_Pitch_v2.4.pdf
                    </p>
                    <p className="text-[11px] text-slate-500">
                      4.2 MB • Updated today
                    </p>
                  </div>
                </div>
                <button className="size-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1 px-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">9:41 AM</span>
                <span className="material-symbols-outlined text-[14px] text-primary">
                  done_all
                </span>
              </div>
            </div>
          </div>
          {/* Typing Indicator */}
          <div className="flex items-center gap-3">
            <div
              className="size-8 rounded-lg bg-cover bg-center shrink-0"
              data-alt="Sarah Chen's avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZRAf0s-uT7hJ979O8LHcsLL3YzoTMVQSgHNeLRsTrgYrtJXvjQ3gQI3TXDOvBb9Ik4bbf4kuvSjKPEHmF2SHepWOMjDMANiq5PUeMTGWRHTwG-kvRl-XFpJuhCPogYlh22AdkNtu8GWBi_JUEegunAQo1Llf1qUPGOYaaP2JEU-41JD-Vn8b6knOyISl8zGIaBxkkRua4TiOr3s8xv_rVIqUMC1K1q9j3jUZly_uh0Ui20T1n1YCKkSMXSLOTPUx4SbzDjcMP_cg")'
              }}
            />
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl shadow-sm flex gap-1">
              <span className="size-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
              <span
                className="size-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="size-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
        {/* Input Area */}
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
              />
              <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">mood</span>
              </button>
            </div>
            <button
              onClick={handleSend}
              className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"wght" 700' }}
              >
                send
              </span>
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-4 font-medium uppercase tracking-widest">
            Shift + Enter to add a new line
          </p>
        </footer>
      </section>
    </main>
  </div>
    </>
  );
}
