"use client";

import { useState, useRef } from "react";
import { Send, Image as ImageIcon, Smile, X, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: string[]) => Promise<void>;
  isLoading?: boolean;
  onTyping?: () => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
}

export function MessageInput({
  onSendMessage,
  isLoading = false,
  onTyping,
  disabled = false,
  disabledPlaceholder = "Recipient is offline. Messages can only be sent to logged-in users.",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat_attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("chat_attachments")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        setAttachments((prev) => [...prev, data.publicUrl]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    if (disabled) return;
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || (!message.trim() && attachments.length === 0) || isLoading || isUploading) return;

    const currentMessage = message;
    const currentAttachments = [...attachments];

    setMessage(""); // optimistic clear
    setAttachments([]);

    await onSendMessage(currentMessage, currentAttachments);
  };

  return (
    <div className="flex flex-col bg-white border-t border-[#E8DDD0]">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 p-3 overflow-x-auto border-b border-gray-100">
          {attachments.map((url, i) => (
            <div key={i} className="relative group shrink-0">
              <img src={url} alt="attachment" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4">
        <div className="flex items-center gap-2 mb-1">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
            disabled={disabled}
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading || isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
          </button>
          <button 
            type="button" 
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 relative">
          {disabled && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs font-medium text-amber-700 pointer-events-none z-10">
              <Lock className="w-3.5 h-3.5" />
              <span>{disabledPlaceholder}</span>
            </div>
          )}
          <textarea
            value={message}
            disabled={disabled}
            onChange={(e) => {
              setMessage(e.target.value);
              if (onTyping) onTyping();
            }}
            placeholder={disabled ? "" : "Type a message (markdown supported)..."}
            className={`w-full max-h-32 min-h-[44px] p-3 text-sm rounded-xl resize-none outline-none focus:ring-2 focus:ring-[#F5C542]/50 bg-gray-50 border border-transparent focus:border-[#F5C542] focus:bg-white transition-all ${
              disabled ? "bg-amber-50/60 text-transparent cursor-not-allowed border-amber-200" : ""
            }`}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || (!message.trim() && attachments.length === 0) || isLoading || isUploading}
          className="p-3 mb-0.5 rounded-full bg-[#F5C542] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e5b532] transition-colors shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
