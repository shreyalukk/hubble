"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, Loader2, Check } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const supabase = createClient();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      setMessage(null);
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);

      // Auto-save the avatar URL to the profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      setMessage({ type: "success", text: "Profile picture updated!" });

    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] p-6 max-w-xl">
      <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">Profile Settings</h2>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-[#E8DDD0] overflow-hidden bg-[#FAF6F0] flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-400 font-bold">
                {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2D2D2D] border-2 border-white flex items-center justify-center cursor-pointer hover:bg-black transition-colors shadow-sm"
            title="Upload new picture"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Camera className="w-4 h-4 text-white" />
            )}
          </label>
          <input 
            id="avatar-upload"
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
        </div>
        <div>
          <h3 className="font-semibold text-[#1a1a1a]">Profile Picture</h3>
          <p className="text-sm text-gray-500 mb-2">Upload a picture to help friends recognize you.</p>
          <label htmlFor="avatar-upload" className="text-sm font-medium text-[#D4A017] cursor-pointer hover:underline">
            Choose image...
          </label>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Display Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200 bg-[#FAF6F0] border border-[#E8DDD0] text-[#1a1a1a] focus:border-[#F5C542]"
            placeholder="E.g. Aarav Patel"
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="h-11 px-6 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
