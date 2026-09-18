import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '../ui/sidebar';
import { LayoutDashboard, Link as LinkIcon, UserCircle, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const navItems = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Links', url: '/links', icon: LinkIcon },
    { title: 'Bio Builder', url: '/bio', icon: UserCircle },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground flex w-full">
        <Sidebar variant="sidebar">
          <SidebarHeader className="p-6">
            <h1 className="font-bold text-2xl tracking-tight text-primary">Hub.</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 px-4">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive} className={isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"}>
                          <Link to={item.url} className="flex items-center gap-3 py-2 px-3 rounded-md">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button variant="outline" className="w-full flex justify-center items-center gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Sidebar>
        <main className="flex-1 p-8 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
