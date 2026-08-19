"use client";

import { Users, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StaffKpiCardsProps {
  total: number;
  active: number;
  inactive: number;
}

export function StaffKpiCards({ total, active, inactive }: StaffKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Personnel
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Across all branches
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Shift Workers
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">
            Ready for checkout
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Inactive / Off Duty
          </CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactive}</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Suspended or off shift
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
