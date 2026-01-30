"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";

import Toast from "@/app/components/Toast";

export default function Warehouse() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [viewingFile, setViewingFile] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
        fetchResources();
    } else {
        setLoading(false);
    }
  }, [user]);

  const fetchResources = async () => {
      try {
          const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          const fetchedLinks = data.filter(item => item.type === 'LINK');
          const fetchedFiles = data.filter(item => item.type !== 'LINK');

          setLinks(fetchedLinks);
          setFiles(fetchedFiles);
      } catch (err) {
          console.error("Error fetching resources:", err);
          showToast("Failed to load warehouse items", "error");
      } finally {
          setLoading(false);
      }
  };

  const showToast = (message, type = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleAddLink = async (linkData) => {
      try {
          const { data, error } = await supabase
            .from('resources')
            .insert([{
                user_id: user.id,
                type: 'LINK',
                title: linkData.title,
                url: linkData.url,
                created_at: new Date()
            }])
            .select()
            .single();

          if (error) throw error;
          setLinks([data, ...links]);
          showToast("Link added successfully!");
      } catch (err) {
          console.error("Error adding link:", err);
          showToast("Failed to add link", "error");
      }
  };

  const handleDeleteLink = async (id) => {
      try {
          const { error } = await supabase.from('resources').delete().eq('id', id);
          if (error) throw error;
          setLinks(links.filter(l => l.id !== id));
          showToast("Link deleted");
      } catch (err) {
          console.error("Error deleting link:", err);
          showToast("Failed to delete link", "error");
      }
  };

  const handleEditLink = async (id, updatedData) => {
      try {
           const { error } = await supabase
            .from('resources')
            .update(updatedData)
            .eq('id', id);

           if (error) throw error;
           setLinks(links.map(l => l.id === id ? { ...l, ...updatedData } : l));
           showToast("Link updated");
      } catch (err) {
          console.error("Error updating link:", err);
          showToast("Failed to update link", "error");
      }
  };

  const handleAddFile = async (fileInput) => {
      const { title, category, fileObj } = fileInput;
      if (!fileObj) return;

      try {
          // 1. Upload to Storage
          const fileExt = fileObj.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('warehouse_files')
            .upload(`${user.id}/${fileName}`, fileObj);

          if (uploadError) throw uploadError;

          // 2. Get Public URL
          const { data: { publicUrl } } = supabase.storage
            .from('warehouse_files')
            .getPublicUrl(`${user.id}/${fileName}`);

          // 3. Insert into Database
          const sizeMB = (fileObj.size / (1024 * 1024)).toFixed(1) + " MB";
          const type = fileExt.toUpperCase();

          const { data, error: dbError } = await supabase
            .from('resources')
            .insert([{
                user_id: user.id,
                type: type.length > 5 ? 'FILE' : type,
                title: title,
                url: publicUrl,
                size: sizeMB,
                category: category || 'Work'
            }])
            .select()
            .single();

          if (dbError) throw dbError;
          
          setFiles([data, ...files]);
          showToast(`Uploaded ${title}`);

      } catch (err) {
          console.error("Error uploading file:", err);
          showToast("Upload failed", "error");
      }
  };

  const handleDeleteFile = async (file) => {
      try {
          // 1. Delete from Storage (if it's a supabase hosted file)
          if (file.url.includes('warehouse_files')) {
              // Extract path: endpoint/object/public/warehouse_files/user_id/filename
              const path = file.url.split('warehouse_files/')[1];
              if (path) {
                  const { error: storageError } = await supabase.storage
                    .from('warehouse_files')
                    .remove([path]);
                  if (storageError) console.warn("Storage delete warning:", storageError);
              }
          }

          // 2. Delete from DB
          const { error } = await supabase.from('resources').delete().eq('id', file.id);
          if (error) throw error;

          setFiles(files.filter(f => f.id !== file.id));
          showToast("File deleted");
      } catch (err) {
          console.error("Error deleting file:", err);
          showToast("Failed to delete file", "error");
      }
  };

  const handleDownload = (file) => {
      if (file.url) {
          const a = document.createElement('a');
          a.href = file.url;
          a.download = file.title;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  };

  if (loading) {
      return <div className="h-[calc(90vh-100px)] flex items-center justify-center text-neutral-500">Loading Warehouse...</div>;
  }

  return (
    <div className="grid lg:grid-cols-2 h-auto lg:h-[calc(90vh-100px)] relative gap-4 lg:gap-0">
      <Toast toast={toast} />

      {/* File Viewer Overlay - Portal */}
      {mounted && createPortal(
          <AnimatePresence>
            {viewingFile && (
                <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} onDownload={() => handleDownload(viewingFile)} />
            )}
          </AnimatePresence>,
          document.body
      )}

      {/* Quick Links Section */}
      <div className="bg-neutral-950 rounded-l border border-white/10 flex flex-col h-full">
        <h2 className="text-2xl font-light text-neutral-200 lg:mb-6 border-b border-white/10 py-3 lg:text-center font-space px-4 ">Quick Links</h2>
        <div className="flex-1 overflow-y-auto space-y-2 lg:space-y-3 lg:pr-5 lg:px-5 custom-scrollbar p-2">
            {/* Inline Add Card */}
            <AddLinkCard onSave={handleAddLink} />
            
            {links.map(link => (
                <LinkCard 
                    key={link.id} 
                    link={link} 
                    showToast={showToast} 
                    onDelete={() => handleDeleteLink(link.id)}
                    onEdit={(newLink) => handleEditLink(link.id, newLink)}
                />
            ))}
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-neutral-900 rounded-r p-2 lg:p-6 border border-l-white/0 border-white/5 flex flex-col h-full">
         <h2 className="text-2xl font-space font-light text-neutral-200 mb-6">Files</h2>
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 content-start lg:pr-2 custom-scrollbar">
            {/* Inline Add Card */}
            <AddFileCard onSave={handleAddFile} />

            {files.map(file => (
                <FileCard 
                    key={file.id} 
                    file={file} 
                    onView={() => setViewingFile(file)}
                    onDownload={() => handleDownload(file)}
                    onDelete={() => handleDeleteFile(file)}
                />
            ))}
        </div>
      </div>
    </div>
  );
}

function LinkCard({ link, showToast, onDelete, onEdit }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(link.title);
    const [editUrl, setEditUrl] = useState(link.url);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link.url);
        showToast("Link copied to clipboard");
    };

    const handleSave = () => {
        if (editTitle && editUrl) {
            onEdit({ title: editTitle, url: editUrl });
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <motion.div layout className="bg-neutral-900 border border-white/20 lg:p-4 p-2 rounded-xl space-y-3">
                 <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                    placeholder="Title"
                    autoFocus
                />
                <input 
                    type="text" 
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                    placeholder="URL"
                />
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative bg-neutral-900 border border-white/5 p-2 rounded flex items-center justify-between transition-colors"
        >
            <div className="truncate pr-4">
                <h3 className="font-light text-neutral-200 truncate text-xs lg:text-sm font-space uppercase ">{link.title}</h3>
                <p className="text-xs lg:text-md text-neutral-500 truncate ">{link.url}</p>
            </div>
            
            <div className="flex items-center gap-2">
                {isHovered && (
                    <>
                     <button 
                        onClick={() => setIsEditing(true)}
                        className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded hover:bg-neutral-700 transition-colors"
                     >
                        Edit
                    </button>
                    <button 
                        onClick={onDelete}
                        className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20 transition-colors"
                     >
                        Delete
                    </button>
                    </>
                )}
                <button 
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-black hover:bg-neutral-200 transition-colors duration-300" 
                    title="Copy URL"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
        </motion.div>
    )
}

function AddLinkCard({ onSave }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    const handleSave = () => {
        if (title && url) {
            onSave({ title, url });
            setTitle("");
            setUrl("");
            setIsExpanded(false);
        }
    };

    return (
        <motion.div 
            layout
            className={`rounded  bg-neutral-200 transition-colors overflow-hidden ${isExpanded ? 'bg-neutral-900 p-4' : 'bg-neutral-600 mx-2'}`}
        >
            {!isExpanded ? (
                <button 
                    onClick={() => setIsExpanded(true)}
                    className="w-full lg:h-14 flex items-center justify-center gap-2 text-neutral-900 transition-colors hover:bg-neutral-200"
                >
                    <span className="text-xl">+</span>
                    <span className="text-sm font-medium font-space">Add New Link</span>
                </button>
            ) : (
                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="Link Title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                        autoFocus
                    />
                    <input 
                        type="text" 
                        placeholder="URL (https://...)" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                        <button 
                            onClick={() => setIsExpanded(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200"
                        >
                            Save Link
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

function FileCard({ file, onView, onDownload, onDelete }) {
    // Generate deterministic gradient based on ID
    const gradients = [
        "bg-gradient-to-br from-purple-500/20 to-blue-600/20 border-purple-500/30",
        "bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
        "bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30",
        "bg-gradient-to-br from-pink-500/20 to-rose-600/20 border-pink-500/30",
        "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
        "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30",
        "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30",
        "bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border-indigo-500/30",
    ];
    
    // Simple string hash for UUIDs
    const getStringHash = (str) => {
        let hash = 0;
        if (!str) return 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    const gradient = gradients[getStringHash(String(file.id)) % gradients.length];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className={`p-4 rounded  ${gradient} backdrop-blur-sm relative overflow-hidden group min-h-[140px] flex flex-col justify-between`}
        >
            <div className="relative z-10">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-black/40 px-2 py-1 rounded text-white/70">{file.category}</span>
                 </div>
                 <h3 className="font-medium text-lg text-white mb-1 truncate leading-tight" title={file.title}>{file.title}</h3>
                 <p className="text-xs text-white/60 font-mono">{file.type} • {file.size}</p>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[50]">
                <button 
                    onClick={(e) => { e.stopPropagation(); onView(); }}
                    className="p-2 bg-black/60 hover:bg-black text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                    title="View Fullscreen"
                >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    className="p-2 bg-black/60 hover:bg-black text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                    title="Download"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                    title="Delete"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </motion.div>
    )
}

function AddFileCard({ onSave }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Work");
    const [fileData, setFileData] = useState(null);
    const [fileObj, setFileObj] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileObj(file);
            setTitle(file.name);
            const ext = file.name.split('.').pop().toUpperCase();
            const type = ext.length > 4 ? "FILE" : ext;
            const size = (file.size / (1024 * 1024)).toFixed(1) + " MB";
            
            // Create object URL for preview/download
            const url = URL.createObjectURL(file);
            
            setFileData({ type, size, url });
        }
    };

    const handleSave = () => {
        if (title && fileData) {
            onSave({ title, category, ...fileData, fileObj });
            setTitle("");
            setFileData(null);
            setFileObj(null);
            setIsExpanded(false);
        }
    };

    return (
        <motion.div 
            layout
            className={`rounded transition-colors overflow-hidden min-h-[140px] flex flex-col ${isExpanded ? 'bg-neutral-900 justify-start' : 'bg-neutral-800 justify-center'}`}
        >
            {!isExpanded ? (
                 <button 
                    onClick={() => setIsExpanded(true)}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-white transition-colors p-6"
                >
                    <span className="text-3xl font-light">+</span>
                    <span className="text-sm font-medium">Upload File</span>
                </button>
            ) : (
                <div className="p-4 space-y-3 relative h-full flex flex-col">
                    <div className="relative group cursor-pointer">
                        <label className="block text-xs text-neutral-400 mb-1">Select File</label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-black border border-white/10 rounded-lg">
                            <span className="text-xs text-white truncate flex-1">{title || "Choose a file..."}</span>
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs text-neutral-400 mb-1">Category</label>
                        <input 
                            type="text"
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                            placeholder="Work"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-auto pt-2">
                        <button 
                            onClick={() => setIsExpanded(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={!fileData}
                            className={`px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 ${!fileData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

function FileViewer({ file, onClose, onDownload }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex flex-col"
        >
            {/* Toolbar */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/50 font-bold">
                        {file.type}
                     </div>
                     <div>
                        <h2 className="text-white font-medium">{file.title}</h2>
                        <p className="text-sm text-neutral-400">{file.size} • {file.category}</p>
                     </div>
                </div>
                <button 
                    onClick={onClose}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-[110]"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            {/* Content Preview */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-4xl w-full aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center flex-col gap-4 relative">
                    {/* Render Image for IMG types */}
                    {['JPG', 'PNG', 'JPEG', 'WEBP', 'IMG'].includes(file.type) && file.url ? (
                        <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={file.url} alt={file.title} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <p className="text-neutral-500">Preview not available for this file type.</p>
                        </>
                    )}
                    
                    <button 
                        onClick={onDownload}
                        className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors mt-4"
                    >
                        Download to View
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
