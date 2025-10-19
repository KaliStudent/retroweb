import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Globe,
  Key,
  Image,
  FileText,
  Table,
  Code,
  Sparkles,
  Link2,
  Newspaper,
  LayoutDashboard,
  Search,
  Settings,
  LogOut,
  Palette // Added Palette icon import
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const toolCategories = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard }
    ]
  },
  {
    label: "Network Tools",
    items: [
      { title: "DNS Lookup", url: createPageUrl("DNSLookup"), icon: Globe },
      { title: "URL Shortener", url: createPageUrl("URLShortener"), icon: Link2 }
    ]
  },
  {
    label: "File Converters",
    items: [
      { title: "Image Converter", url: createPageUrl("ImageConverter"), icon: Image },
      { title: "Document to PDF", url: createPageUrl("DocumentConverter"), icon: FileText },
      { title: "Excel & CSV", url: createPageUrl("ExcelCSVConverter"), icon: Table },
      { title: "PSD & SVG", url: createPageUrl("PSDSVGConverter"), icon: Code }
    ]
  },
  {
    label: "Developer Tools",
    items: [
      { title: "Base64 Tools", url: createPageUrl("Base64Tool"), icon: Code },
      { title: "JSON Tools", url: createPageUrl("JSONTools"), icon: Code },
      { title: "Color Picker", url: createPageUrl("ColorPicker"), icon: Palette } // Added Color Picker tool
    ]
  },
  {
    label: "Content Tools",
    items: [
      { title: "Password Generator", url: createPageUrl("PasswordGenerator"), icon: Key },
      { title: "Word Counter", url: createPageUrl("WordCounter"), icon: FileText },
      { title: "Landing Page Gen", url: createPageUrl("LandingPageGenerator"), icon: Sparkles }
    ]
  },
  {
    label: "Advanced",
    items: [
      { title: "Domain Registration", url: createPageUrl("DomainRegistration"), icon: Search },
      { title: "Image Search", url: createPageUrl("ImageSearch"), icon: Search },
      { title: "AI News", url: createPageUrl("AINews"), icon: Newspaper }
    ]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 239 84% 67%;
            --primary-foreground: 0 0% 100%;
            --background: 0 0% 100%;
            --foreground: 222 47% 11%;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Sidebar className="border-r border-slate-200/60 backdrop-blur-xl bg-white/80">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  mspmcp.dev
                </h2>
                <p className="text-xs text-slate-500 font-medium">Network Tools</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            {toolCategories.map((category) => (
              <SidebarGroup key={category.label}>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                  {category.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.items.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`
                              transition-all duration-200 rounded-lg mb-1
                              ${isActive 
                                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/30' 
                                : 'hover:bg-slate-100 text-slate-700'
                              }
                            `}
                          >
                            <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                              <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                              <span className="font-medium text-sm">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            {user && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => base44.auth.logout()}
                  className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors" />
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                mspmcp.dev
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
