import { createBrowserClient } from "./client";

export const uploadImage = async (file: File, bucket: string = "portfolio") => {
  const supabase = createBrowserClient();
  
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  
  // Directly attempt upload. 
  // User must have created the bucket and set RLS policies.
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Supabase Storage Error:", error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
};
