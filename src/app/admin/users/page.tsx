"use client";

import { deleteUser, editUser, getUsers } from "@/actions/users";
import { EditUserDialog } from "@/components/custom/admin/user/EditUserDialog";
import { UserDetailsDialog } from "@/components/custom/admin/user/UserDetailsDialog";
import { UserSearch } from "@/components/custom/admin/user/UserSearch";
import { UserTable } from "@/components/custom/admin/user/UserTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof User>("display_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { token } = useAuthStore();

  useEffect(() => {
    (async () => {
      const res = await getUsers(token);
      if (res.error) {
        console.error("Error al obtener usuarios:", res.error);
        return;
      }
      setUsers(res);
    })();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof User) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (updatedUser: User) => {
    await editUser(updatedUser, token);
    const res = await getUsers(token);
    setUsers(res);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userToDelete: User) => {
    await deleteUser(token, userToDelete.documentId);
    const res = await getUsers(token);
    setUsers(res);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="rounded-md border">
          <UserTable
            users={sortedUsers}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onViewDetails={setSelectedUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </CardContent>
      <UserDetailsDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </Card>
  );
}
