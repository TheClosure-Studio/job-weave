"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

export default function Toast({ toast }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {toast && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 0, x: "-50%" }}
                    className="fixed top-16 left-1/2 z-[9999] bg-neutral-900 text-white px-2 py-1 rounded shadow-2xl flex items-center gap-3 border border-neutral-800"
                >
                    <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="font-medium text-sm font-space">{toast.message}</span>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
