"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateShopSchema, CreateShopInput } from "@/hooks/useShops";
import { useShops } from "@/hooks/useShops";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShopModal({ open, onOpenChange }: Props) {
  const { createShop, isCreating } = useShops();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateShopInput>({
    resolver: zodResolver(CreateShopSchema),
    defaultValues: { shopName: "", address: "", shopPhone: "", currency: "KES" },
  });

  const onSubmit = async (data: CreateShopInput) => {
    try {
      await createShop(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Shop</DialogTitle>
          <DialogDescription>
            Add a new shop branch to your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input id="shopName" placeholder="e.g. Duka Westlands" {...register("shopName")} />
            {errors.shopName && <p className="text-xs text-destructive">{errors.shopName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address / Location</Label>
            <Input id="address" placeholder="e.g. Ring Road, House #4" {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopPhone">Phone Number</Label>
            <Input id="shopPhone" placeholder="0712345678" {...register("shopPhone")} />
            {errors.shopPhone && <p className="text-xs text-destructive">{errors.shopPhone.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Shop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}