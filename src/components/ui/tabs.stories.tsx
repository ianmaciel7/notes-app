import type { Story, StoryDefault } from "@ladle/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export default {
  title: "UI / Tabs",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="account" className="p-4 rounded-lg border bg-card text-card-foreground">
      <h4 className="font-medium text-sm">Account Settings</h4>
      <p className="text-muted-foreground text-xs mt-1">Manage your public profile and preferences.</p>
    </TabsContent>
    <TabsContent value="password" className="p-4 rounded-lg border bg-card text-card-foreground">
      <h4 className="font-medium text-sm">Password Management</h4>
      <p className="text-muted-foreground text-xs mt-1">Change your password and security credentials.</p>
    </TabsContent>
    <TabsContent value="settings" className="p-4 rounded-lg border bg-card text-card-foreground">
      <h4 className="font-medium text-sm">General Settings</h4>
      <p className="text-muted-foreground text-xs mt-1">Configure notifications, themes, and integrations.</p>
    </TabsContent>
  </Tabs>
);

export const LineVariant: Story = () => (
  <Tabs defaultValue="overview" className="w-[400px]">
    <TabsList variant="line">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="reports">Reports</TabsTrigger>
    </TabsList>
    <TabsContent value="overview" className="py-3">
      <p className="text-sm text-muted-foreground">High-level summary overview.</p>
    </TabsContent>
    <TabsContent value="analytics" className="py-3">
      <p className="text-sm text-muted-foreground">Detailed metrics and engagement graphs.</p>
    </TabsContent>
    <TabsContent value="reports" className="py-3">
      <p className="text-sm text-muted-foreground">Exportable data tables and activity logs.</p>
    </TabsContent>
  </Tabs>
);
