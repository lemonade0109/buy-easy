import React from "react";
import type { Metadata } from "next";
import { getUserById } from "@/lib/actions/users/user-actions";
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Admin User Update Page",
  description: "Page for updating user information in the admin panel.",
};

export default async function AdminUserUpdatePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const user = await getUserById(id);
  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">
        Update User:
        <span className="text-xl mx-2">{user.name}</span>
      </h1>

      <UpdateUserForm user={user} />
    </div>
  );
}
