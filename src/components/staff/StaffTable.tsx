"use client";

import {
  Mail,
  Phone,
  Store,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { StaffMember } from "@/hooks/useStaff";

interface StaffTableProps {
  staffList: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
}

export function StaffTable({ staffList, onEdit, onDelete }: StaffTableProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="pl-6">Staff Member</TableHead>
            <TableHead>Assigned Branch</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No staff members found.
              </TableCell>
            </TableRow>
          ) : (
            staffList.map((staff) => (
              <TableRow
                key={staff.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="pl-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {staff.fullname.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {staff.fullname}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {staff.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {staff.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                    <Store className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{staff.shopName}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold ${
                      staff.role === "OWNER"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : staff.role === "ADMIN"
                          ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/30"
                          : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {staff.role}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={staff.isActive ? "secondary" : "outline"}
                    className={`text-[10px] gap-1 px-2 py-0.5 ${
                      staff.isActive
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        staff.isActive
                          ? "bg-emerald-500"
                          : "bg-muted-foreground"
                      }`}
                    />
                    {staff.isActive ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onEdit(staff)}>
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(staff.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
