import React from 'react';
import { Send, Paperclip, MoreVertical, Search, Box } from 'lucide-react';
// import { View } from '../types'; // REMOVE THIS: You don't need types in JSX
import { cn } from '../utils';

// Removed the : React.FC and the generic type definitions
export const Chat = ({ setView }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 h-[750px] flex gap-8">
      {/* Sidebar */}
      <aside className="w-80 bg-white rounded-3xl shadow-agri border border-primary/5 flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-gray-50 space-y-4">
          <h2 className="font-heading text-2xl font-bold">Messages</h2>
          <div className="bg-bg-warm px-4 py-2 rounded-full flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search chats..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {[
            { name: 'Farmer Maria', last: 'Will send the box by 4pm today', time: '12:45', online: true },
            { name: 'Farmer Amit', last: 'The honey is back in stock!', time: 'Yesterday', online: false },
            { name: 'Farmer David', last: 'Regarding the potatoes inquiry', time: 'Mon', online: true },
          ].map((chat, idx) => (
            <div key={idx} className={cn("p-4 rounded-2xl flex gap-3 cursor-pointer transition-all", idx === 0 ? "bg-primary/5 border border-primary/10" : "hover:bg-bg-warm/50")}>
              <div className="relative shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${chat.name}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="avatar" />
                {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                  <span className="text-[10px] font-medium text-gray-400">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.last}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 bg-white rounded-3xl shadow-agri border border-primary/5 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <img src="https://i.pravatar.cc/150?u=Maria" className="w-12 h-12 rounded-full border-2 border-primary/10" alt="Maria" />
             <div>
                <h3 className="font-bold">Farmer Maria</h3>
                <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Online</span>
             </div>
          </div>
          <button className="p-2 hover:bg-bg-warm rounded-full transition-colors text-gray-400"><MoreVertical size={20} /></button>
        </header>

        {/* Product Context Widget */}
        <div className="bg-bg-warm/50 px-6 py-3 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <Box size={18} className="text-primary" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Regarding: 5kg Heritage Potatoes</span>
          </div>
          <button className="text-[10px] font-bold text-primary hover:underline">View Product</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-center">
            <span className="bg-gray-100 text-[10px] font-bold text-gray-400 px-4 py-1.5 rounded-full uppercase tracking-widest">Today</span>
          </div>

          <div className="flex flex-col gap-2 max-w-[70%]">
             <div className="bg-bg-warm px-6 py-4 rounded-3xl rounded-tl-none font-medium text-sm text-gray-700 shadow-sm border border-black/5">
                Hello! I saw your order for the heritage potatoes. Just wanted to let you know they were harvested just 2 hours ago.
             </div>
             <span className="text-[10px] font-medium text-gray-400 px-2 italic">10:30 AM</span>
          </div>

          <div className="flex flex-col items-end gap-2 ml-auto max-w-[70%]">
             <div className="bg-primary px-6 py-4 rounded-3xl rounded-tr-none font-medium text-sm text-white shadow-lg">
                That sounds amazing! I can't wait to try them. Will they be delivered together with the spinach?
             </div>
             <span className="text-[10px] font-medium text-gray-400 px-2 italic">10:32 AM</span>
          </div>

          <div className="flex flex-col gap-2 max-w-[70%]">
             <div className="bg-bg-warm px-6 py-4 rounded-3xl rounded-tl-none font-medium text-sm text-gray-700 shadow-sm border border-black/5">
                Yes, both are in the same crate. Will send the box by 4pm today!
             </div>
             <span className="text-[10px] font-medium text-gray-400 px-2 italic">10:35 AM</span>
          </div>
        </div>

        {/* Input */}
        <footer className="p-6 border-t border-gray-50">
          <div className="bg-bg-warm rounded-2xl p-2 flex items-center gap-2">
            <button className="p-3 hover:bg-white rounded-xl transition-colors text-gray-400"><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Type your message here..." 
              className="flex-1 bg-transparent border-none outline-none px-2 text-sm font-medium" 
            />
            <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-light shadow-lg transition-all active:scale-90">
              <Send size={20} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};