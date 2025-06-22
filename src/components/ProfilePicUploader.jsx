'use client'; // if using Next.js App Router

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePicUploader() {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not found');
      setUploading(false);
      return;
    }

    const ext = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload failed:', uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    const { error: dbError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (dbError) {
      console.error('Failed to update DB:', dbError.message);
    } else {
      console.log('Profile pic uploaded:', publicUrl);
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="avatar">Upload Profile Picture</label>
      <input type="file" id="avatar" onChange={handleFileChange} accept="image/*" />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}