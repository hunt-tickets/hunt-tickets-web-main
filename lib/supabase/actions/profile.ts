"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateProfileState {
  success?: boolean;
  error?: string;
}

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Authentication required" };
  }

  // Extract form data
  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const birthdate = formData.get("birthdate") as string;
  const gender = formData.get("gender") as string;
  const prefix = formData.get("prefix") as string;
  const document_id = formData.get("document_id") as string;

  // Validate input
  if (name && name.trim().length < 3) {
    return { error: "Name must be at least 3 characters" };
  }

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({
      name: name || null,
      lastName: lastName || null,
      phone: phone || null,
      birthdate: birthdate || null,
      gender: gender === "no_decir" ? null : gender || null,
      prefix: prefix === "none" ? null : prefix || null,
      document_id: document_id || null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);

    // Handle specific errors
    if (error.code === "23505") {
      // Unique constraint violation
      if (error.message.includes("phone")) {
        return { error: "This phone number is already in use" };
      }
      if (error.message.includes("email")) {
        return { error: "This email is already in use" };
      }
    }

    return { error: "Failed to update profile. Please try again." };
  }

  // Revalidate profile page
  revalidatePath("/profile");

  return { success: true };
}
