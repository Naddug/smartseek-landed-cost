import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function Admin() {
  const { user, shortlists } = useStore();

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Add New</Button>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="shortlists">Shortlists</TabsTrigger>
          <TabsTrigger value="requests">Sourcing Requests</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">demo@smartseek.com</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Pro</span></TableCell>
                    <TableCell>45</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="ghost">Edit</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">newuser@test.com</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Free</span></TableCell>
                    <TableCell>10</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="ghost">Edit</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shortlists" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Managed Shortlists</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {shortlists.map(list => (
                  <div key={list.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted">
                    <span>{list.title}</span>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}