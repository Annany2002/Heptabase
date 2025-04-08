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
import CodeGenerate from "@/components/code-copy";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "@/components/ui/use-toast";

interface PremiumCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  status: "Available" | "Redeemed";
  redeemedBy?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const tokens = useQuery(api.token.getTokens);
  const deleteToken = useMutation(api.token.deleteToken);
  const [premiumCode, setPremiumCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (
      user &&
      user.primaryEmailAddress?.emailAddress !== process.env.ADMIN_EMAIL
    ) {
      router.push("/");
      return;
    }
  }, [user, router]);

  return (
    <div className="bg-background text-foreground p-4 md:p-8">
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
          <CodeGenerate
            premiumCode={premiumCode}
            setPremiumCode={setPremiumCode}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokens?.length}</div>
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
              <div className="text-2xl font-bold">
                {tokens?.filter((token) => token.status === "Available").length}
              </div>
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
              <div className="text-2xl font-bold">
                {tokens?.filter((token) => token.status === "Redeemed").length}
              </div>
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                {(!tokens || tokens.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-4">
                      No tokens generated yet.
                    </TableCell>
                  </TableRow>
                )}
                {tokens &&
                  tokens.map((code) => (
                    <TableRow key={code._id}>
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
                            Redeemed by {code.tokenIdentifier}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            window.navigator.clipboard.writeText(code.code);
                            toast({
                              description: "Code copied to clipboard",
                            });
                          }}
                          variant="ghost"
                          size="icon"
                          className="mr-1"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy Code</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteToken({ tokenId: code._id })}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Code</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              {tokens && tokens.length > 0 && (
                <TableCaption className="mb-2">
                  Showing {tokens.length} of {tokens.length}
                </TableCaption>
              )}
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
