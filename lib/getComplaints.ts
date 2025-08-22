import { supabase } from "./supabaseClient";

export async function getComplaints() {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching complaints:", error.message);
    return [];
  }

  return data || [];
}
