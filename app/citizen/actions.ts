"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function submitComplaint(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location_text = formData.get("location") as string;
  const photo = formData.get("photo") as File;

  let photo_url: string | null = null;

  if (photo && photo.size > 0) {
    const buffer = await photo.arrayBuffer();
    const fileName = `${Date.now()}-${photo.name}`;
    const { data, error } = await supabase.storage
      .from("complaint-photos")
      .upload(fileName, buffer, {
        contentType: photo.type,
      });

    if (!error && data) {
      const { publicUrl } = supabase.storage
        .from("complaint-photos")
        .getPublicUrl(data.path);
      photo_url = publicUrl;
    }
  }

  await supabase.from("complaints").insert([
    {
      title,
      description,
      location_text,
      photo_url,
      status: "Pending",
    },
  ]);

  revalidatePath("/citizen");
}




// "use server";

// import { supabase } from '@/lib/supabaseClient';
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export async function submitComplaint(formData: FormData) {
//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const location_text = formData.get("location") as string;
//   const photoFile = formData.get("photo") as File;

//   // 1. Upload photo to Supabase Storage if it exists
//   let photo_url = null;
//   if (photoFile.size > 0) {
//     // Generate a unique path without a user ID
//     const filePath = `complaints/${Date.now()}_${photoFile.name}`;
//     const { data, error } = await supabase.storage
//       .from("complaint-photos")
//       .upload(filePath, photoFile, {
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (error) {
//       console.error("Error uploading photo:", error);
//       throw new Error("Failed to upload photo.");
//     }

//     // Get the public URL of the uploaded photo
//     const { data: publicUrlData } = supabase.storage
//       .from("waste_photos")
//       .getPublicUrl(data.path);
//     photo_url = publicUrlData.publicUrl;
//   }

//   // 2. Insert complaint data into the database
//   const { error } = await supabase.from("complaints").insert({
//     title,
//     description,
//     location_text,
//     photo_url,
//     // The `citizen_id` column is not needed for anonymous reports.
//   });

//   if (error) {
//     console.error("Error inserting data:", error);
//     throw new Error("Failed to submit report.");
//   }

//   // 3. Revalidate the path to show the new complaint
//   revalidatePath("/citizen");
//   redirect("/citizen");
// }



// "use server";

// import { supabase } from '@/lib/supabaseClient';
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export async function submitComplaint(formData: FormData) {
//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const location_text = formData.get("location") as string;
//   const photoFile = formData.get("photo") as File;

//   // 1. Get the current user's ID
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     throw new Error("User not authenticated.");
//   }

//   // 2. Upload photo to Supabase Storage if it exists
//   let photo_url = null;
//   if (photoFile.size > 0) {
//     const filePath = `complaints/${user.id}/${photoFile.name}`;
//     const { data, error } = await supabase.storage
//       .from("waste_photos")
//       .upload(filePath, photoFile, {
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (error) {
//       console.error("Error uploading photo:", error);
//       throw new Error("Failed to upload photo.");
//     }

//     // Get the public URL of the uploaded photo
//     const { data: publicUrlData } = supabase.storage
//       .from("waste_photos")
//       .getPublicUrl(data.path);
//     photo_url = publicUrlData.publicUrl;
//   }

//   // 3. Insert complaint data into the database
//   const { error } = await supabase.from("complaints").insert({
//     title,
//     description,
//     location_text,
//     photo_url,
//     citizen_id: user.id,
//   });

//   if (error) {
//     console.error("Error inserting data:", error);
//     throw new Error("Failed to submit report.");
//   }

//   // 4. Revalidate the path to show the new complaint
//   revalidatePath("/citizen");
//   redirect("/citizen");
// }




// "use server";

// import { supabase } from '@/lib/supabaseClient';
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export async function submitComplaint(formData: FormData) {
//   const supabase = createClient();

//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const location_text = formData.get("location") as string;
//   const photoFile = formData.get("photo") as File;

//   // 1. Get the current user's ID
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     throw new Error("User not authenticated.");
//   }

//   // 2. Upload photo to Supabase Storage if it exists
//   let photo_url = null;
//   if (photoFile.size > 0) {
//     const filePath = `complaints/${user.id}/${photoFile.name}`;
//     const { data, error } = await supabase.storage
//       .from("waste_photos")
//       .upload(filePath, photoFile, {
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (error) {
//       console.error("Error uploading photo:", error);
//       throw new Error("Failed to upload photo.");
//     }

//     // Get the public URL of the uploaded photo
//     const { data: publicUrlData } = supabase.storage
//       .from("waste_photos")
//       .getPublicUrl(data.path);
//     photo_url = publicUrlData.publicUrl;
//   }

//   // 3. Insert complaint data into the database
//   const { error } = await supabase.from("complaints").insert({
//     title,
//     description,
//     location_text,
//     photo_url,
//     citizen_id: user.id, // Link the complaint to the user
//   });

//   if (error) {
//     console.error("Error inserting data:", error);
//     throw new Error("Failed to submit report.");
//   }

//   // 4. Revalidate the path to show the new complaint
//   revalidatePath("/citizen");
//   redirect("/citizen");
// }