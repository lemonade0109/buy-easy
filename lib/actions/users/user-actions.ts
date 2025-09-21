"use server";
import { userSignInSchema } from "@/lib/validator";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Action to sign in user with credentials
export async function signInUserWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const userData = userSignInSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    await signIn("credentials", userData);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}

// Action to sign out user
export async function signOutUser() {
  await signOut();
}
