"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Package,
  CheckCircle,
  UserCheck,
  Copy,
  Trash2,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CopyCode from "@/components/code-copy";

interface PremiumCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  status: "Available" | "Redeemed";
  redeemedBy?: string;
}

const sampleCodes: PremiumCode[] = [
  {
    id: "1",
    code: "PREMIUM-ABC123",
    createdAt: "7/15/2023",
    expiresAt: "10/15/2023",
    status: "Redeemed",
    redeemedBy: "user@example.com",
  },
  {
    id: "2",
    code: "PREMIUM-DEF456",
    createdAt: "8/20/2023",
    expiresAt: "11/20/2023",
    status: "Available",
  },
  {
    id: "3",
    code: "PREMIUM-GHI789",
    createdAt: "9/5/2023",
    expiresAt: "3/5/2024",
    status: "Available",
  },
];

export default function AdminDashboard() {
  const totalCodes = sampleCodes.length;
  const activeCodes = sampleCodes.filter(
    (code) => code.status === "Available"
  ).length;
  const redeemedCodes = sampleCodes.filter(
    (code) => code.status === "Redeemed"
  ).length;
  const { user } = useUser();
  const router = useRouter();
  const [premiumCode, setPremiumCode] = useState("");

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress !== process.env.ADMIN_EMAIL) {
      router.push("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Premium Codes
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate and manage premium access codes
            </p>
          </div>
          <CopyCode premiumCode={premiumCode} setPremiumCode={setPremiumCode} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCodes}</div>
              <p className="text-xs text-muted-foreground">
                All generated codes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Codes
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCodes}</div>
              <p className="text-xs text-muted-foreground">Unredeemed codes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Redeemed Codes
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{redeemedCodes}</div>
              <p className="text-xs text-muted-foreground">
                Used premium codes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table Section */}
        <Card>
          <CardHeader>
            {/* Search Input - Placed inside CardHeader for grouping */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by code or user email..."
                className="pl-8 w-full"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {" "}
            {/* Remove padding from CardContent to let Table span full width */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Code</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>{code.createdAt}</TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />{" "}
                        {code.expiresAt}
                      </span>
                    </TableCell>
                    <TableCell>
                      {code.status === "Available" ? (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600 dark:border-green-700 dark:text-green-500"
                        >
                          <span className="mr-1 h-2 w-2 rounded-full bg-green-500 dark:bg-green-600"></span>
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500 dark:bg-yellow-600"></span>
                          Redeemed by {code.redeemedBy}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-1">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy Code</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Code</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Showing {sampleCodes.length} of {sampleCodes.length} codes
              </TableCaption>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
