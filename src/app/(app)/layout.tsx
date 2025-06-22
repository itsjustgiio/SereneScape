'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mainNavItems, siteConfig } from '@/config/nav';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Prefetcher() {
  const router = useRouter();
  useEffect(() => {
    const routes = [
      '/dashboard',
      '/meditations',
      '/soundscapes',
      '/breathing',
      '/affirmations',
    ];
    routes.forEach((route) => router.prefetch(route));
  }, []);
  return null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
  const fetchAvatar = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    // ✅ Log full userData to inspect the structure
    console.log('👀 userData:', userData);

    if (userError || !userData?.user?.id) {
      console.error('❌ User fetch error:', userError);
      return;
    }

    const userId = userData.user.id;

    const { data: avatarRow, error: fetchError } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .not('avatar_url', 'eq', 'EMPTY')
      .maybeSingle();

    if (fetchError) {
      console.error('❌ Avatar fetch error:', fetchError.message);
    } else if (!avatarRow) {
      console.warn('⚠️ No avatar found for user:', userId);
    } else {
      console.log('✅ Avatar from DB:', avatarRow.avatar_url);
      setAvatarUrl(avatarRow.avatar_url);
    }
  };

  fetchAvatar();
}, []);

useEffect(() => {
  console.log("🎯 Final avatarUrl state:", avatarUrl);
}, [avatarUrl]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  const moodData = [
    { day: 'm', mood: 1 },
    { day: 't', mood: 2 },
    { day: 'w', mood: 3 },
    { day: 't', mood: 1 },
    { day: 'f', mood: 2 },
    { day: 's', mood: 3 },
    { day: 's', mood: 2 },
  ];

  return (
    <>
      <Prefetcher />
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="p-4 flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 hover:no-underline">
                <siteConfig.logo className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-headline font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                  {siteConfig.name}
                </h1>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <ScrollArea className="h-full">
                <SidebarMenu className="p-2">
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          pathname === item.href ||
                          (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        }
                        tooltip={{
                          children: item.title,
                          side: 'right',
                          align: 'center',
                        }}
                        className="font-body"
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
              <div
                className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center cursor-pointer"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                  {avatarUrl ? (<AvatarImage key={avatarUrl} src={avatarUrl} alt="User Avatar" />) : (<AvatarFallback>SS</AvatarFallback>)}
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium text-foreground">
                    {user?.name || 'Serene User'}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  variant="ghost"
                  size="icon"
                  className="ml-auto group-data-[collapsible=icon]:hidden"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1 flex flex-col">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1"></div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <AlertDialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              <span>User Profile</span>
              <Button size="sm" variant="ghost" onClick={() => setIsProfileModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col items-center space-y-6 w-full">
            <Avatar className="h-24 w-24">
              {avatarUrl ? (<AvatarImage key={avatarUrl} src={avatarUrl} alt="User Avatar" />) : (<AvatarFallback>SS</AvatarFallback>)}
            </Avatar>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-foreground">
                {user?.name || 'Serene User'}
              </span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Button variant="outline" className="w-full">
                Change Profile Picture
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 mt-6">
              <div className="w-full sm:w-1/2">
                <h3 className="text-md font-semibold mb-2">Mood Table</h3>
                <table className="w-full text-sm border border-border rounded-md">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2">Day</th>
                      <th className="text-left p-2">Mood</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moodData.map(({ day, mood }, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{day}</td>
                        <td className="p-2">
                          {mood === 1 ? 'Negative' : mood === 2 ? 'Neutral' : 'Positive'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full sm:w-1/2">
                <h3 className="text-md font-semibold mb-2">Mood Line Graph</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={moodData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 3]} ticks={[1, 2, 3]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
