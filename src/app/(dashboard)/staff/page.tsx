"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { StaffKpiCards } from "@/components/staff/StaffKpiCards";
import { StaffFilters } from "@/components/staff/StaffFilters";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffMobileCards } from "@/components/staff/StaffMobileCards";
import { StaffFormModal } from "@/components/staff/StaffFormModal";
import {
  useStaff,
  useStaffMutations,
  type StaffMember,
  type StaffInput,
} from "@/hooks/useStaff";

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // TanStack Query Hooks
  const { data, isLoading, isError } = useStaff(page, searchQuery, roleFilter);
  const { remove, create, update } = useStaffMutations();

  const handleOpenCreateModal = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  // Fixed: Connect to TanStack mutation instead of setStaffList
  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      remove.mutate(id);
    }
  };

  // Safe fallback counts during loading state
  const staffList = data?.staff ?? [];
  const totalCount = staffList.length;
  const activeCount = staffList.filter((s) => s.isActive).length;
  const inactiveCount = staffList.filter((s) => !s.isActive).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <StaffHeader totalCount={totalCount} onAddClick={handleOpenCreateModal} />

      <StaffKpiCards
        total={totalCount}
        active={activeCount}
        inactive={inactiveCount}
      />

      <StaffFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1); // Reset to page 1 on search
        }}
        roleFilter={roleFilter}
        onRoleFilterChange={(val) => {
          setRoleFilter(val);
          setPage(1); // Reset to page 1 on filter change
        }}
      />

      <Card className="border-border/60 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading staff records...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-destructive font-medium">
            Failed to load staff records. Please check your connection.
          </div>
        ) : (
          <>
            <StaffTable
              staffList={staffList}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteStaff}
            />
            <StaffMobileCards
              staffList={staffList}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteStaff}
            />
          </>
        )}
      </Card>

      <StaffFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingStaff={editingStaff}
        onSubmit={(formData: StaffInput) => {
          if (editingStaff) {
            update.mutate({ id: editingStaff.id, data: formData });
          } else {
            create.mutate(formData);
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
