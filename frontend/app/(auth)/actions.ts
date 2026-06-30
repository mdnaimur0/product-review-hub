"use server";

import {
  authAuthJwtLogin,
  authAuthJwtLogout,
  authRegisterRegister,
} from "@/lib/api";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(prevState: unknown, formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  const input = {
    body: {
      name,
      email,
      password,
    },
  };
  try {
    const { error } = await authRegisterRegister(input);
    if (error) {
      return { server_validation_error: getErrorMessage(error) };
    }
  } catch (err) {
    console.error("Registration error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect(`/login`);
}

export async function login(prevState: unknown, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  const input = {
    body: {
      username,
      password,
    },
  };

  try {
    const { data, error } = await authAuthJwtLogin(input);
    if (error) {
      return { server_validation_error: getErrorMessage(error) };
    }
    (await cookies()).set("accessToken", data.access_token);
    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { message: "No access token found" };
  }

  const { error } = await authAuthJwtLogout({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    return { message: typeof error === "string" ? error : "Logout failed" };
  }

  cookieStore.delete("accessToken");
  redirect(`/login`);
}
