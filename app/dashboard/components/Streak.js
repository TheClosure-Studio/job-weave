"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Streak({ items = [], showBreakdown = true, onCheckIn, isCheckedIn, title, description, onDayClick, todayCount, onAdjustCount }) {
  const [contributionData, setContributionData] = useState([]);
  const [stats, setStats] = useState({ currentStreak: 0, maxStreak: 0, activeDays: 0 });
  const [months, setMonths] = useState([]);

  useEffect(() => {
    // 1. Process items into a date map for O(1) lookup
    // items have date format "YYYY-MM-DD"
    const activityMap = {};
    items.forEach(item => {
        if (item.date) {
            activityMap[item.date] = (activityMap[item.date] || 0) + (item.count || 1);
        }
    });

    // 2. Generate daily data for the last 364 days
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 364; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (363 - i)); // Go back 363 days
        const dateString = date.toISOString().split('T')[0];
        
        // If this is a custom streak (onCheckIn exists) and it is today, 
        // rely on isCheckedIn prop for visual feedback immediately if items aren't updated yet
        // OR just rely on items (since we optimistically update items in parent)
        
        const count = activityMap[dateString] || 0;
        
        // Determine level based on count
        let level = 0;
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count === 3) level = 3;
        else if (count >= 4) level = 4;
        
        data.push({ date, level, count });
    }

    setContributionData(data);

    // 3. Calculate Stats
    let max = 0;
    let active = data.filter(d => d.level > 0).length;
    let total = items.length;

    // Streaks Calculation
    let streaks = [];
    let currentStreakCount = 0;
    
    // Iterate through data to find all streaks
    for (let i = 0; i < data.length; i++) {
        if (data[i].level > 0) {
            currentStreakCount++;
        } else {
            if (currentStreakCount > 0) {
                streaks.push(currentStreakCount);
                currentStreakCount = 0;
            }
        }
    }
    // Push the final streak if active
    if (currentStreakCount > 0) {
        streaks.push(currentStreakCount);
    }

    // Max Streak
    max = streaks.length > 0 ? Math.max(...streaks) : 0;

    // Current Streak (counting backwards from today until a gap)
    let currStreak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].level > 0) {
            currStreak++;
        } else {
            // If it's today and we haven't done it yet, don't break streak immediately if yesterday was active?
            // Standard streak logic: if today is 0, check yesterday.
            // However, the loop goes backwards. data[length-1] is TODAY.
            // If today is 0, we can check if yesterday (index-2) is active.
            // But this loop just counts consecutive > 0.
            
            // Allow gap of today if checking early in the day?
            // Actually, for "Current Streak" display, usually we visualize what we have.
            // If user hasn't checked in today, streak might show 0 or previous streak.
            // Let's stick to strict counting for now.
            break;
        }
    }
    
    const sortedStreaks = [...streaks].sort((a, b) => b - a).slice(0, 3);
    
    // Status Counts
    const statusCounts = items.reduce((acc, item) => {
        const status = item.status || 'Wishlist';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    
    setStats({ 
        currentStreak: currStreak, 
        maxStreak: max, 
        activeDays: active,
        totalContributions: total,
        previousStreaks: sortedStreaks,
        statusCounts
    });

    // 4. Generate Month Labels
    const monthLabels = [];
    let lastMonth = -1;
    for (let w = 0; w < 52; w++) {
        const firstDayOfWeekIndex = w * 7;
        if (firstDayOfWeekIndex < data.length) {
            const date = data[firstDayOfWeekIndex].date;
            const month = date.getMonth();
            if (month !== lastMonth) {
                const label = date.toLocaleString('default', { month: 'short' });
                monthLabels.push({ weekIndex: w, label });
                lastMonth = month;
            }
        }
    }
    setMonths(monthLabels);

  }, [items]);

  // Helper to get color based on level
  const getLevelColor = (level) => {
    switch (level) {
      case 1: return "bg-green-900/40 border border-green-900/50";
      case 2: return "bg-green-700/60 border border-green-700/50";
      case 3: return "bg-green-500/80 border border-green-500/50";
      case 4: return "bg-green-400 border border-green-300/50";
      default: return "bg-neutral-800/30 border border-white/5"; // Darker empty state
    }
  };

  return (
    <div className="w-full bg-neutral-950 border border-white/10 rounded p-4 md:p-6 mb-6 backdrop-blur-sm relative group/card">
      {(title || description) && (
          <div className="mb-6">
              {title && <h3 className="text-xl font-space font-light text-neutral-200">{title}</h3>}
              {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
          </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Stats Section */}
        <div className="flex-shrink-0 flex xl:flex-col gap-4 min-w-[200px]">
           <div 
                onClick={!onAdjustCount ? onCheckIn : undefined}
                className={`
                    rounded-xl md:p-5 p-3 border flex items-center gap-4 shadow-xl transition-all duration-300
                    ${!onAdjustCount && onCheckIn ? 'cursor-pointer active:scale-95 hover:border-white/20' : ''}
                    ${isCheckedIn 
                        ? 'bg-gradient-to-br from-orange-900/40 to-black border-orange-500/30' 
                        : 'bg-gradient-to-br from-neutral-900 to-black border-white/10'}
                `}
           >
               <div className={`
                    md:w-14 md:h-14 w-10 h-10 rounded-full flex items-center justify-center text-3xl transition-all duration-500
                    ${isCheckedIn 
                        ? 'bg-orange-500/20 ring-1 ring-orange-500/50 scale-110 shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                        : 'bg-white/5 ring-0 scale-100 opacity-50 grayscale'}
               `}>
                   🔥
               </div>
               <div>
                   <div className="md:text-3xl text-xl font-semibold text-neutral-400 font-space leading-none">
                       {stats.currentStreak}
                   </div>
                   <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium mt-1">Day Streak</div>
               </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-950/50 rounded p-3 border border-white/5">
                    <div className="md:text-xl text-lg font-semibold text-neutral-400 font-space">{stats.activeDays}</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider">Active Days</div>
                </div>
                <div className="bg-neutral-950/50 rounded p-3 border border-white/5">
                    <div className="md:text-xl text-lg font-semibold text-neutral-400 font-space">{stats.maxStreak}</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider">Max Streak</div>
                </div>
           </div>
        </div>

        {/* Heatmap Section */}
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-2 pt-6"> {/* Added pt-6 for labels */}
             <div className="flex gap-1 min-w-max">
                 {Array.from({ length: 52 }).map((_, weekIndex) => {
                     // Check if this week starts a new month
                     const monthLabel = months.find(m => m.weekIndex === weekIndex);
                     const isNewMonth = !!monthLabel;

                     return (
                        <div 
                            key={weekIndex} 
                            className={`flex flex-col gap-1 relative ${isNewMonth && weekIndex !== 0 ? 'ml-3' : ''}`}
                        >
                            {/* Month Label */}
                            {monthLabel && (
                                <span className="absolute -top-6 left-0 text-xs text-neutral-400 font-space whitespace-nowrap">
                                    {monthLabel.label}
                                </span>
                            )}

                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                                const dataIndex = weekIndex * 7 + dayIndex;
                                const dayData = contributionData[dataIndex];
                                
                                // Don't render if out of bounds (should match data length)
                                if (!dayData) return <div key={dayIndex} className="w-3 h-3 opacity-0" />;

                                return (
                                    <div 
                                        key={dayIndex}
                                        onClick={() => onDayClick && onDayClick(dayData.date.toISOString().split('T')[0], dayData.count)}
                                        className={`w-3 h-3 transition-colors duration-300 ${getLevelColor(dayData.level)} ${onDayClick ? 'cursor-pointer hover:border-white/50' : ''}`}
                                        title={`${dayData.date.toDateString()} (Level: ${dayData.level})`}
                                    />
                                )
                            })}
                        </div>
                     )
                 })}
             </div>
             
             {/* Legend */}
             <div className="flex justify-end mt-4 text-xs text-neutral-400 font-space items-center gap-2">
                 <span>Less</span>
                 <div className="flex gap-1">
                     <div className="w-3 h-3 rounded-sm bg-neutral-800/30 border border-white/5"></div>
                     <div className="w-3 h-3 rounded-sm bg-green-900/40 border border-green-900/50"></div>
                     <div className="w-3 h-3 rounded-sm bg-green-700/60 border border-green-700/50"></div>
                     <div className="w-3 h-3 rounded-sm bg-green-500/80 border border-green-500/50"></div>
                     <div className="w-3 h-3 rounded-sm bg-green-400 border border-green-300/50"></div>
                 </div>
                 <span>More</span>
             </div>
        </div>

      </div>

      {/* Level Controls (Bottom Center) */}
      {onAdjustCount && (
          <div className="flex justify-center mt-2 lg:mt-0">
               <div className={`
                   rounded-full flex items-center transition-all duration-500
                   
               `}>
                   
                   <div className="flex items-center gap-4 bg-neutral-800/50 rounded-full p-1 border border-white/5">
                       <button 
                            onClick={(e) => { e.stopPropagation(); onAdjustCount(-1); }}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 active:scale-95 transition-all text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={todayCount <= 0}
                       >
                           -
                       </button>
                       
                       <div className={`text-xl font-bold font-space w-6 text-center ${todayCount > 0 ? 'text-orange-500' : 'text-neutral-600'}`}>
                           {todayCount}
                       </div>
                       
                       <button 
                            onClick={(e) => { e.stopPropagation(); onAdjustCount(1); }}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 active:scale-95 transition-all text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={todayCount >= 10}
                       >
                           +
                       </button>
                   </div>
               </div>
          </div>
      )}

      {/* Status Breakdown Section - Conditional */}
      {showBreakdown && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs font-space text-neutral-500 uppercase tracking-wider mb-4">Application Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                {/* Total */}
                <div className="bg-neutral-950/50 rounded-xl p-4 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                    <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Total</div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white font-space">{stats.totalContributions}</div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                            Σ
                        </div>
                    </div>
                </div>

                {/* Statuses */}
                {[
                    { label: 'Wishlist', count: stats.statusCounts?.Wishlist || 0, color: 'text-neutral-400', bg: 'bg-white/5' },
                    { label: 'Applied', count: stats.statusCounts?.Applied || 0, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'Interview', count: stats.statusCounts?.Interview || 0, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                    { label: 'Offer', count: stats.statusCounts?.Offer || 0, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                    { label: 'Rejected', count: stats.statusCounts?.Rejected || 0, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4  ${stat.bg} flex flex-col justify-between group hover:brightness-110 transition-all`}>
                        <div className={`${stat.color} text-[10px] uppercase tracking-wider mb-1 opacity-80`}>{stat.label}</div>
                        <div className="flex items-end justify-between">
                            <div className={`text-2xl font-bold font-space ${stat.color}`}>{stat.count}</div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
}
