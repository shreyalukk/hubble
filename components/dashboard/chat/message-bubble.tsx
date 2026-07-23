"use client";

import { useState } from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface MessageBubbleProps {
  id: string;
  content: string;
  senderName: string;
  isCurrentUser: boolean;
  createdAt: string;
  attachments?: string[];
  onDelete?: (id: string) => void;
}

export function MessageBubble({
  id,
  content,
  senderName,
  isCurrentUser,
  createdAt,
  attachments = [],
  onDelete,
}: MessageBubbleProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const time = format(new Date(createdAt), "h:mm a");

  const handleDelete = () => {
    if (onDelete && !isDeleting) {
      setIsDeleting(true);
      onDelete(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      className={`group flex w-full mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[70%] flex flex-col ${isCurrentUser ? "items-end" : "items-start"} relative`}>
        <div className="flex items-center gap-2 mb-1 mx-1">
          <span className="text-xs text-gray-500">
            {isCurrentUser ? "You" : senderName} • {time}
          </span>
          
          {/* Delete Action (visible for current user's messages) */}
          {isCurrentUser && onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              title="Delete message"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Attachments (Images) */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt="Attachment"
                  className="max-h-60 rounded-xl object-contain bg-black/5 border border-black/10"
                />
              </a>
            ))}
          </div>
        )}

        {/* Text Content */}
        {content && (
          <div
            className={`px-4 py-3 rounded-2xl relative ${
              isCurrentUser
                ? "bg-[#2D2D2D] text-white rounded-tr-sm"
                : "bg-white border border-[#E8DDD0] text-[#1a1a1a] rounded-tl-sm shadow-sm"
            }`}
          >
            <div className="text-sm prose prose-sm max-w-none break-words dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
