
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";
import Streak from "./Streak";
import { getISTDate } from "@/lib/dateUtils";

export default function CustomStreak() {
    const { user } = useAuth();
    const [streaks, setStreaks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newStreak, setNewStreak] = useState({ title: "", description: "" });

    // Management State
    const [editingStreak, setEditingStreak] = useState(null);
    const [managingDay, setManagingDay] = useState(null);

    useEffect(() => {
        if (user) {
            fetchStreaks();
        } else {
            // If user is null (e.g. not logged in or loading), we shouldn't necessarily hang,
            // but Dashboard usually handles auth check. 
            // If we are here, and user is null, we can set loading false to show empty state/avoid hang.
            setLoading(false);
        }
    }, [user]);

    const fetchStreaks = async () => {
        try {
            const { data, error } = await supabase
                .from('custom_streaks')
                .select(`
                *,
                custom_streak_logs (id, date, count)
            `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStreaks(data || []);
        } catch (error) {
            console.error("Error fetching streaks:", error);
        } finally {
            setLoading(false);
        }
    };

    const createStreak = async () => {
        if (!newStreak.title.trim()) return;
        try {
            const { data, error } = await supabase.from('custom_streaks').insert([{
                user_id: user.id,
                title: newStreak.title,
                description: newStreak.description
            }]).select().single();

            if (error) throw error;
            setStreaks([{ ...data, custom_streak_logs: [] }, ...streaks]);
            setIsCreating(false);
            setNewStreak({ title: "", description: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const deleteStreak = async (id) => {
        try {
            const { error } = await supabase.from('custom_streaks').delete().eq('id', id);
            if (error) throw error;
            setStreaks(streaks.filter(s => s.id !== id));
        } catch (err) { console.error(err); }
    };

    const toggleCheckIn = async (streakId, existingLogId) => {
        // Logic for simple check-in (if ever used)
        // Since we primarily use AdjustCount now, this might be legacy or for "One Click" ease
        const today = getISTDate();
        try {
            if (existingLogId) {
                // Uncheck (Delete log)
                const { error } = await supabase.from('custom_streak_logs').delete().eq('id', existingLogId);
                if (error) throw error;

                setStreaks(streaks.map(s => {
                    if (s.id === streakId) {
                        return { ...s, custom_streak_logs: s.custom_streak_logs.filter(l => l.id !== existingLogId) };
                    }
                    return s;
                }));
            } else {
                // Check In (Create log with count 1)
                const { data, error } = await supabase.from('custom_streak_logs').insert([{
                    streak_id: streakId,
                    date: today,
                    count: 1
                }]).select().single();
                if (error) throw error;

                setStreaks(streaks.map(s => {
                    if (s.id === streakId) {
                        return { ...s, custom_streak_logs: [...s.custom_streak_logs, data] };
                    }
                    return s;
                }));
            }
        } catch (err) { console.error(err); }
    };

    const handleEditClick = (streak) => {
        setEditingStreak({ id: streak.id, title: streak.title, description: streak.description || "" });
    };

    const saveEdit = async () => {
        if (!editingStreak || !editingStreak.title.trim()) return;
        try {
            const { data, error } = await supabase
                .from('custom_streaks')
                .update({ title: editingStreak.title, description: editingStreak.description })
                .eq('id', editingStreak.id)
                .select();

            if (error) throw error;

            setStreaks(streaks.map(s => s.id === editingStreak.id ? { ...s, title: editingStreak.title, description: editingStreak.description } : s));
            setEditingStreak(null);
        } catch (err) { console.error("Error saving edit:", err); }
    };

    const handleDayClick = (streakId, date, count) => {
        setManagingDay({ streakId, date, count });
    };

    const adjustDayLevel = async (delta, overrideStreakId = null, overrideDate = null) => {
        const streakId = overrideStreakId || managingDay?.streakId;
        const date = overrideDate || managingDay?.date;

        if (!streakId || !date) return;

        // Find existing log
        const streak = streaks.find(s => s.id === streakId);
        const existingLog = streak?.custom_streak_logs.find(l => l.date === date);
        const currentCount = existingLog?.count || 0;

        try {
            if (delta > 0) {
                // Increment
                if (existingLog) {
                    // Update existing
                    const newCount = currentCount + 1;
                    const { error } = await supabase
                        .from('custom_streak_logs')
                        .update({ count: newCount })
                        .eq('id', existingLog.id);

                    if (error) throw error;

                    // Update State
                    setStreaks(streaks.map(s => {
                        if (s.id === streakId) {
                            const updatedLogs = s.custom_streak_logs.map(l =>
                                l.id === existingLog.id ? { ...l, count: newCount } : l
                            );
                            return { ...s, custom_streak_logs: updatedLogs };
                        }
                        return s;
                    }));

                    if (managingDay && managingDay.streakId === streakId && managingDay.date === date) {
                        setManagingDay(prev => ({ ...prev, count: newCount }));
                    }

                } else {
                    // Insert new with count 1
                    const { data, error } = await supabase.from('custom_streak_logs').insert([{
                        streak_id: streakId,
                        date: date,
                        count: 1
                    }]).select().single();

                    if (error) throw error;

                    // Update State
                    setStreaks(streaks.map(s => {
                        if (s.id === streakId) {
                            return { ...s, custom_streak_logs: [...s.custom_streak_logs, data] };
                        }
                        return s;
                    }));

                    if (managingDay && managingDay.streakId === streakId && managingDay.date === date) {
                        setManagingDay(prev => ({ ...prev, count: 1 }));
                    }
                }

            } else {
                // Decrement
                if (existingLog) {
                    const newCount = currentCount - 1;

                    if (newCount <= 0) {
                        // Delete
                        const { error } = await supabase.from('custom_streak_logs').delete().eq('id', existingLog.id);
                        if (error) throw error;

                        // Update State
                        setStreaks(streaks.map(s => {
                            if (s.id === streakId) {
                                return { ...s, custom_streak_logs: s.custom_streak_logs.filter(l => l.id !== existingLog.id) };
                            }
                            return s;
                        }));

                        if (managingDay && managingDay.streakId === streakId && managingDay.date === date) {
                            setManagingDay(prev => ({ ...prev, count: 0 }));
                        }

                    } else {
                        // Update count
                        const { error } = await supabase
                            .from('custom_streak_logs')
                            .update({ count: newCount })
                            .eq('id', existingLog.id);

                        if (error) throw error;

                        // Update State
                        setStreaks(streaks.map(s => {
                            if (s.id === streakId) {
                                const updatedLogs = s.custom_streak_logs.map(l =>
                                    l.id === existingLog.id ? { ...l, count: newCount } : l
                                );
                                return { ...s, custom_streak_logs: updatedLogs };
                            }
                            return s;
                        }));

                        if (managingDay && managingDay.streakId === streakId && managingDay.date === date) {
                            setManagingDay(prev => ({ ...prev, count: newCount }));
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Error adjusting level:", err);
        }
    };

    const today = getISTDate();

    if (loading) return <div className="text-neutral-500 font-space p-4">Loading streaks...</div>;

    return (
        <div className="w-full h-full flex flex-col relative">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-space font-light text-neutral-200">My Routines</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-neutral-200 transition-colors font-space text-sm flex items-center gap-2"
                >
                    <span>+</span> New Streak
                </button>
            </div>

            {/* Modals Layer */}
            <AnimatePresence>
                {/* Create Modal */}
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden relative z-30"
                    >
                        <div className="bg-neutral-900/50 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <input
                                type="text"
                                placeholder="Streak Title (e.g., Read 30 mins)"
                                className="w-full bg-transparent border-b border-white/10 pb-2 mb-4 text-white focus:outline-none focus:border-white/30 font-space"
                                value={newStreak.title}
                                onChange={e => setNewStreak({ ...newStreak, title: e.target.value })}
                                autoFocus
                            />
                            <input
                                type="text"
                                placeholder="Description (Optional)"
                                className="w-full bg-transparent border-b border-white/10 pb-2 mb-4 text-sm text-neutral-400 focus:outline-none focus:border-white/30 font-space"
                                value={newStreak.description}
                                onChange={e => setNewStreak({ ...newStreak, description: e.target.value })}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsCreating(false)} className="text-neutral-500 text-sm hover:text-white transition-colors px-3 py-1">Cancel</button>
                                <button onClick={createStreak} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">Create</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Edit Modal - Overlay */}
                {editingStreak && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-space text-white mb-4">Edit Streak</h3>
                            <input
                                type="text"
                                className="w-full bg-transparent border-b border-white/10 pb-2 mb-4 text-white focus:outline-none focus:border-white/30 font-space"
                                value={editingStreak.title}
                                onChange={e => setEditingStreak({ ...editingStreak, title: e.target.value })}
                            />
                            <textarea
                                className="w-full bg-transparent border border-white/10 rounded-lg p-3 mb-6 text-sm text-neutral-400 focus:outline-none focus:border-white/30 font-space min-h-[100px]"
                                value={editingStreak.description}
                                onChange={e => setEditingStreak({ ...editingStreak, description: e.target.value })}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingStreak(null)} className="text-neutral-500 hover:text-white px-4 py-2 text-sm transition-colors">Cancel</button>
                                <button onClick={saveEdit} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors">Save</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Manage Day Modal - Overlay */}
                {managingDay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center">
                            <h3 className="text-lg font-space text-white mb-1">Manage Activity</h3>
                            <p className="text-neutral-500 text-sm mb-6">{new Date(managingDay.date).toDateString()}</p>

                            <div className="flex items-center justify-center gap-6 mb-8">
                                <button
                                    onClick={() => adjustDayLevel(-1)}
                                    disabled={managingDay.count <= 0}
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    -
                                </button>
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-bold font-space text-white">{managingDay.count}</span>
                                    <span className="text-[10px] uppercase text-neutral-500 tracking-wider">Entries</span>
                                </div>
                                <button
                                    onClick={() => adjustDayLevel(1)}
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl hover:bg-white/5 transition-all"
                                >
                                    +
                                </button>
                            </div>

                            <button onClick={() => setManagingDay(null)} className="w-full bg-white/5 hover:bg-white/10 text-neutral-300 py-3 rounded-xl text-sm transition-colors">
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List of Streaks */}
            <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-20">
                {streaks.length === 0 && !isCreating && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-600">
                        <p>No streaks yet. Start a new habit!</p>
                    </div>
                )}

                {streaks.map(streak => {
                    const updatedLogs = streak.custom_streak_logs || [];
                    const todaysLog = updatedLogs.find(l => l.date === today);

                    return (
                        <motion.div
                            key={streak.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group block"
                        >
                            {/* Edit Button */}
                            <button
                                onClick={() => handleEditClick(streak)}
                                className="absolute top-4 right-12 z-20 text-neutral-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                                title="Edit Streak"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteStreak(streak.id)}
                                className="absolute top-4 right-4 z-20 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                                title="Delete Streak"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <Streak
                                items={updatedLogs}
                                showBreakdown={false}
                                onCheckIn={() => toggleCheckIn(streak.id, todaysLog?.id)}
                                isCheckedIn={!!todaysLog}
                                title={streak.title}
                                description={streak.description}
                                todayCount={todaysLog?.count || 0}
                                onAdjustCount={(delta) => adjustDayLevel(delta, streak.id, today)}
                            />
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
