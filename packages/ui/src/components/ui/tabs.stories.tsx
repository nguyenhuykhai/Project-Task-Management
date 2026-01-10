import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                defaultValue="Pedro Duarte"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                defaultValue="@peduarte"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="current" className="text-sm font-medium">
                Current password
              </label>
              <input
                id="current"
                type="password"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="new" className="text-sm font-medium">
                New password
              </label>
              <input
                id="new"
                type="password"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold">Overview Content</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This is the overview tab. Here you can see general information about
            your dashboard.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold">Analytics Content</h3>
          <p className="text-sm text-muted-foreground mt-2">
            View detailed analytics and metrics about your application.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports" className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold">Reports Content</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Access and download various reports from this section.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="settings" orientation="vertical" className="flex gap-4">
      <TabsList className="flex flex-col h-auto">
        <TabsTrigger value="settings" className="w-full justify-start">
          Settings
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full justify-start">
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start">
          Billing
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="settings">
          <div className="rounded-lg border p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Configure your application settings here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="rounded-lg border p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your security preferences and two-factor authentication.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="rounded-lg border p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Choose how you want to be notified about updates.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="billing">
          <div className="rounded-lg border p-6 min-w-[400px]">
            <h3 className="text-lg font-semibold">Billing Information</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Review your subscription and payment details.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const RouterIntegration: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Home</CardTitle>
            <CardDescription>
              Your dashboard overview with key metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-green-500">12</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-blue-500">12</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tasks" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>All your tasks in one place.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "Design new feature",
                "Fix navigation bug",
                "Update documentation",
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <span className="text-sm font-medium">{task}</span>
                  <span className="text-xs text-muted-foreground">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
