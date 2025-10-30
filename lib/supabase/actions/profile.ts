"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateProfileState {
  success?: boolean;
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  birthdate: string | null;
  gender: string | null;
  prefix: string | null;
  document_id: string | null;
  admin: boolean;
  created_at: string;
}

export async function getAllUsers(): Promise<{
  users: UserProfile[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  // Verify user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { users: null, error: "Authentication required" };
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("admin")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.admin) {
    return { users: null, error: "Unauthorized access" };
  }

  // Get all users with pagination to handle large datasets
  const allUsers: UserProfile[] = [];
  const pageSize = 1000;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data: users, error } = await supabase
      .from("profiles")
      .select('id, name, "lastName", email, phone, birthdate, gender, prefix, document_id, admin, created_at')
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`Error fetching users page ${page}:`, error);
      return { users: null, error: "Failed to fetch users" };
    }

    if (users && users.length > 0) {
      allUsers.push(...(users as UserProfile[]));
      hasMore = users.length === pageSize;
      page++;
    } else {
      hasMore = false;
    }
  }

  console.log(`📊 Total users fetched: ${allUsers.length}`);

  return { users: allUsers, error: null };
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

export interface UpdateUserData {
  name?: string;
  lastName?: string;
  email: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  prefix?: string;
  document_id?: string;
  admin: boolean;
}

export async function updateUserAsAdmin(
  userId: string,
  userData: UpdateUserData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Verify user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Authentication required" };
  }

  // Check if current user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("admin")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.admin) {
    return { success: false, error: "Unauthorized access" };
  }

  // Update the target user's profile
  const { error } = await supabase
    .from("profiles")
    .update({
      name: userData.name || null,
      lastName: userData.lastName || null,
      email: userData.email,
      phone: userData.phone || null,
      birthdate: userData.birthdate || null,
      gender: userData.gender || null,
      prefix: userData.prefix || null,
      document_id: userData.document_id || null,
      admin: userData.admin,
    })
    .eq("id", userId);

  if (error) {
    console.error("User update error:", error);

    // Handle specific errors
    if (error.code === "23505") {
      // Unique constraint violation
      if (error.message.includes("phone")) {
        return { success: false, error: "Este número de teléfono ya está en uso" };
      }
      if (error.message.includes("email")) {
        return { success: false, error: "Este email ya está en uso" };
      }
    }

    return { success: false, error: "Error al actualizar el usuario" };
  }

  // Revalidate usuarios page
  revalidatePath("/administrador/usuarios");

  return { success: true };
}
