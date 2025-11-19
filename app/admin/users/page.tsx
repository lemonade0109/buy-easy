import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/users/user-actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "Admin Users Page",
};

export default async function AdminUserPage(props: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query;

  const users = await getAllUsers({ page, query: searchText });
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">Users</h1>
          {searchText && (
            <div className=" space-x-2 flex items-center">
              Filtered by <i>&quot;{searchText}&quot;</i>
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  Clear Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge variant="default">Admin</Badge>
                  )}
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin//users/${user.id}`}>Edit</Link>
                  </Button>

                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPages} />
        )}
      </div>
    </>
  );
}
