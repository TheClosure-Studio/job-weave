"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Track({ items, onAdd, onDelete, onUpdate }) {
  const [statusOptions] = useState(["Wishlist", "Applied", "Interview", "Offer", "Rejected"]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-neutral-900/50 border border-white/5 rounded backdrop-blur-sm">
      <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-[50px_100px_1fr_1fr_1fr_120px_1fr_50px] gap-4 p-4 border-b border-white/10 text-xs font-space text-neutral-500 uppercase tracking-wider font-medium sticky top-0 bg-neutral-900/95 z-10 backdrop-blur-md">
                  <div className="text-center">S.No</div>
                  <div>Date</div>
                  <div>Company</div>
                  <div>Role</div>
                  <div>JD / Link</div>
                  <div>Status</div>
                  <div>Remarks</div>
                  <div className="text-center">Act</div>
              </div>

              {/* Table Body */}
              <div className="p-2 space-y-1">
                  {/* Add Row Button */}
                  <button 
                    onClick={onAdd}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-neutral-600 hover:text-white hover:bg-white/5 transition-colors mb-2 group"
                  >
                      <span className="group-hover:scale-110 transition-transform">+</span>
                      <span>Add Entry</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {items.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            className="grid grid-cols-[50px_100px_1fr_1fr_1fr_120px_1fr_50px] gap-4 p-3 items-center hover:bg-white/5 rounded-xl transition-colors text-sm group"
                        >
                            <div className="text-center text-neutral-500 font-space">{index + 1}</div>
                            <div className="text-neutral-400 font-space text-xs">{item.date}</div>
                            
                            {/* Company */}
                            <input 
                                type="text" 
                                value={item.company}
                                onChange={(e) => onUpdate(item.id, 'company', e.target.value)}
                                placeholder="Company"
                                className="bg-transparent border-none focus:outline-none text-neutral-400 focus:text-white placeholder-neutral-700 w-full"
                            />

                            {/* Role */}
                            <input 
                                type="text" 
                                value={item.role}
                                onChange={(e) => onUpdate(item.id, 'role', e.target.value)}
                                placeholder="Role"
                                className="bg-transparent border-none focus:outline-none text-neutral-400 focus:text-white placeholder-neutral-700 w-full"
                            />

                            {/* JD */}
                            <input 
                                type="text" 
                                value={item.jd}
                                onChange={(e) => onUpdate(item.id, 'jd', e.target.value)}
                                placeholder="Link/Desc"
                                className="bg-transparent border-none focus:outline-none text-neutral-400 focus:text-white placeholder-neutral-700 w-full truncate"
                            />

                            {/* Status */}
                            <div className="relative">
                                <select 
                                    value={item.status}
                                    onChange={(e) => onUpdate(item.id, 'status', e.target.value)}
                                    className={`appearance-none bg-neutral-950 border border-white/10 rounded-lg px-3 py-1.5 w-full text-xs focus:outline-none cursor-pointer
                                        ${item.status === 'Wishlist' ? 'text-neutral-400' : ''}
                                        ${item.status === 'Applied' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : ''}
                                        ${item.status === 'Interview' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : ''}
                                        ${item.status === 'Offer' ? 'text-green-400 bg-green-500/10 border-green-500/20' : ''}
                                        ${item.status === 'Rejected' ? 'text-red-400 bg-red-500/10 border-red-500/20' : ''}
                                    `}
                                >
                                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            {/* Remarks */}
                            <input 
                                type="text" 
                                value={item.remarks}
                                onChange={(e) => onUpdate(item.id, 'remarks', e.target.value)}
                                placeholder="Notes..."
                                className="bg-transparent border-none focus:outline-none text-neutral-400 focus:text-white placeholder-neutral-700 w-full"
                            />

                            {/* Actions */}
                            <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onDelete(item.id)}
                                    className="p-1.5 hover:bg-red-500/20 text-neutral-600 hover:text-red-400 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                  </AnimatePresence>
              </div>
          </div>
      </div>
    </div>
  );
}
