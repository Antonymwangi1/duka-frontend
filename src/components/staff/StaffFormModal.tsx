"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffInput, StaffMember, StaffRole } from "@/hooks/useStaff";
import { useAuthStore } from "@/store/auth.store";
import { Building2 } from "lucide-react";

interface StaffFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingStaff: StaffMember | null;
  onSubmit: (formData: StaffInput) => void;
}

export function StaffFormModal({
  isOpen,
  onOpenChange,
  editingStaff,
  onSubmit,
}: StaffFormModalProps) {
  const { shop } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("CASHIER");

  useEffect(() => {
    if (editingStaff) {
      setFullname(editingStaff.fullname);
      setEmail(editingStaff.email);
      setPhone(editingStaff.phone);
      setRole(editingStaff.role);
      setPassword(""); // ← never set password from existing staff
    } else {
      setFullname("");
      setEmail("");
      setPhone("");
      setRole("CASHIER");
      setPassword("");
    }
  }, [editingStaff, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) return;

    onSubmit({
      fullname,
      email,
      phone,
      role,
      password,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Edit Staff Details" : "Add New Staff Member"}
            </DialogTitle>
            <DialogDescription>
              Provide contact details and assign roles for system permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-sm">
            {/* Read-Only Current Shop Banner */}
            <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/40 p-2.5 text-xs text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <span>Assigned Store: </span>
                <span className="font-semibold text-foreground">
                  {shop?.shopName || "No shop selected"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-xs">Full Name</label>
              <Input
                required
                type="text"
                placeholder="e.g. Jane Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-medium text-xs">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-xs">Phone Number</label>
                <Input
                  required
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-medium text-xs">Password</label>
              <Input
                required
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-xs font-semibold">
                Role & Access Level
              </label>
              <Select
                value={role}
                onValueChange={(val) => setRole(val as StaffRole)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASHIER">Cashier</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!shop?.id}
              className="text-xs font-semibold"
            >
              {editingStaff ? "Save Changes" : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
