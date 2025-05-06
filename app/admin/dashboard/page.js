"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Calendar, Clock, DollarSign, Users, BookOpen, Plus, User, LayoutDashboard, UserPlus, MessageSquare, Bell, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import GlobalApi from "@/app/_services/GlobalApi";
import useSWR from "swr";

// Create a reusable sidebar component
export function Sidebar({ activePage }) {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove("isAuthenticated");
    router.push("/login");
  };

  // Sidebar navigation items - removed RoyoHomes, Promotions, Loyalty Cards
  const navItems = [
    { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, active: activePage === "dashboard", href: "/dashboard" },
    { title: "Add Service", icon: <Plus className="h-5 w-5" />, active: activePage === "add-service", href: "/add-service" },
    { title: "Service Providers", icon: <User className="h-5 w-5" />, active: activePage === "service-providers", href: "/service-providers" },
    { title: "Agents", icon: <UserPlus className="h-5 w-5" />, active: activePage === "agents", href: "/agents" },
    { title: "Bookings", icon: <BookOpen className="h-5 w-5" />, active: activePage === "bookings", href: "/bookings" },
    { title: "Banners", icon: <Layers className="h-5 w-5" />, active: activePage === "banners", href: "/banners" },
    { title: "Feedback", icon: <MessageSquare className="h-5 w-5" />, active: activePage === "feedback", href: "/feedback" },
    { title: "Notifications", icon: <Bell className="h-5 w-5" />, active: activePage === "notifications", href: "/notifications" },
    { title: "Users", icon: <Users className="h-5 w-5" />, active: activePage === "users", href: "/users" },
  ];
  
  return (
    <aside className="w-64 min-w-64 bg-white border-r flex flex-col py-6 px-4 h-screen overflow-y-auto">
      <div className="mb-8 flex items-center gap-2">
        <span className="font-bold text-xl text-primary">Admin Dashboard</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8">
        <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600">Logout</Button>
      </div>
    </aside>
  );
}

// Mobile sidebar component
export function MobileSidebar({ activePage, isOpen, onClose }) {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove("isAuthenticated");
    router.push("/login");
  };

  // Same navigation items as desktop
  const navItems = [
    { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, active: activePage === "dashboard", href: "/dashboard" },
    { title: "Add Service", icon: <Plus className="h-5 w-5" />, active: activePage === "add-service", href: "/add-service" },
    { title: "Service Providers", icon: <User className="h-5 w-5" />, active: activePage === "service-providers", href: "/service-providers" },
    { title: "Agents", icon: <UserPlus className="h-5 w-5" />, active: activePage === "agents", href: "/agents" },
    { title: "Bookings", icon: <BookOpen className="h-5 w-5" />, active: activePage === "bookings", href: "/bookings" },
    { title: "Banners", icon: <Layers className="h-5 w-5" />, active: activePage === "banners", href: "/banners" },
    { title: "Feedback", icon: <MessageSquare className="h-5 w-5" />, active: activePage === "feedback", href: "/feedback" },
    { title: "Notifications", icon: <Bell className="h-5 w-5" />, active: activePage === "notifications", href: "/notifications" },
    { title: "Users", icon: <Users className="h-5 w-5" />, active: activePage === "users", href: "/users" },
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r flex flex-col py-6 px-4 overflow-y-auto z-[101]">
        <div className="mb-8 flex items-center justify-between">
          <span className="font-bold text-xl text-primary">Admin Dashboard</span>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8">
          <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600">Logout</Button>
        </div>
      </aside>
    </div>
  );
}

// Create a reusable top bar component - removed app links
export function TopBar({ onMenuClick }) {
  const [userName, setUserName] = useState("Admin");
  
  return (
    <header className="flex items-center justify-between bg-white px-4 py-4 border-b w-full">
      <button 
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
        onClick={onMenuClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="md:hidden font-bold text-primary">Admin Dashboard</div>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-white">
          {userName.charAt(0)}
        </div>
      </div>
    </header>
  );
}

// SWR fetcher function
const fetcher = async (url) => {
  try {
    if (url === '/api/stats') {
      const [businessesResp, categoriesResp, bookingsResp] = await Promise.all([
        GlobalApi.getAllBusinessList().catch(err => {
          console.error("Error fetching businesses:", err);
          return { businessLists: [] };
        }),
        GlobalApi.getCategory().catch(err => {
          console.error("Error fetching categories:", err);
          return { categories: [] };
        }),
        GlobalApi.GetUserBookingHistory("all").catch(err => {
          console.error("Error fetching bookings:", err);
          return { bookings: [] };
        })
      ]);

      // Calculate stats from the responses
      const businesses = businessesResp.businessLists || [];
      const categories = categoriesResp.categories || [];
      const bookings = bookingsResp.bookings || [];

      // Calculate booking statistics
      const pendingBookings = bookings.filter(b => b.bookingStatus === "Booked").length;
      const activeBookings = bookings.filter(b => b.bookingStatus === "Confirmed").length;
      const completedBookings = bookings.filter(b => b.bookingStatus === "Completed").length;
      const cancelledBookings = bookings.filter(b => b.bookingStatus === "Cancelled").length;
      
      // Calculate total revenue from completed bookings
      const totalRevenue = bookings
        .filter(b => b.bookingStatus === "Completed")
        .reduce((sum, booking) => sum + (booking.amount || 0), 0);
      
      // Calculate period revenue (last 7 days)
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      
      const periodRevenue = bookings
        .filter(b => b.bookingStatus === "Completed" && new Date(b.date) >= lastWeekDate)
        .reduce((sum, booking) => sum + (booking.amount || 0), 0);
      
      // Count bookings in period
      const periodBookings = bookings
        .filter(b => new Date(b.date) >= lastWeekDate)
        .length;

      return {
        stats: [
          { title: "Pending Bookings", value: pendingBookings.toString(), border: "border-yellow-300" },
          { title: "Active Bookings", value: activeBookings.toString(), border: "border-green-400" },
          { title: "Delivered Bookings", value: completedBookings.toString(), border: "border-green-400" },
          { title: "Cancelled Bookings", value: cancelledBookings.toString(), border: "border-yellow-300" },
          { title: "Service Providers", value: businesses.length.toString(), border: "border-blue-400" },
          { title: "Categories", value: categories.length.toString(), border: "border-green-400" },
          { title: "Services", value: businesses.reduce((total, business) => total + (business.services?.length || 0), 0).toString(), border: "border-green-400" },
          { title: "Active Agents", value: businesses.filter(b => b.isActive).length.toString(), border: "border-yellow-300" },
          { title: "Total Bookings", value: bookings.length.toString(), border: "border-yellow-300" },
        ],
        revenue: {
          total: `$${totalRevenue.toFixed(2)}`,
          period: `$${periodRevenue.toFixed(2)}`,
        },
        bookingStats: {
          total: bookings.length.toString(),
          period: periodBookings.toString(),
        }
      };
    }
    
    return {}; // Default return
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      stats: [],
      revenue: { total: "$0", period: "$0" },
      bookingStats: { total: "0", period: "0" }
    };
  }
};

// Main Dashboard component
export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayDateRange, setDisplayDateRange] = useState("");
  
  // Format current date range for display
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    // Format for input fields
    setStartDate(lastWeek.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    // Format for display
    setDisplayDateRange(`${lastWeek.toLocaleDateString()} - ${today.toLocaleDateString()}`);
  }, []);
  
  // Use SWR for real-time data fetching with automatic revalidation
  const { data, error, isLoading, mutate } = useSWR('/api/stats', fetcher, { 
    refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  const stats = data?.stats || [
    { title: "Pending Bookings", value: "...", border: "border-yellow-300" },
    { title: "Active Bookings", value: "...", border: "border-green-400" },
    { title: "Delivered Bookings", value: "...", border: "border-green-400" },
    { title: "Cancelled Bookings", value: "...", border: "border-yellow-300" },
    { title: "Service Providers", value: "...", border: "border-blue-400" },
    { title: "Categories", value: "...", border: "border-green-400" },
    { title: "Services", value: "...", border: "border-green-400" },
    { title: "Active Agents", value: "...", border: "border-yellow-300" },
    { title: "Total Bookings", value: "...", border: "border-yellow-300" },
  ];
  
  const revenue = data?.revenue || { total: "...", period: "..." };
  const bookingStats = data?.bookingStats || { total: "...", period: "..." };

  const handleFilterByDate = () => {
    if (startDate && endDate) {
      setDisplayDateRange(`${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`);
      // In a real implementation, this would call an API with the selected date range
      mutate();
    }
  };

  const handleRefresh = () => {
    mutate(); // Manually refresh data
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-auto">
      {/* Desktop Sidebar */}
      <Sidebar activePage="dashboard" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="dashboard" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content - adjusted to work with non-fixed sidebar */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Stat Cards - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 md:p-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.title}
              className={`bg-white rounded-lg shadow-sm p-4 md:p-6 border-t-4 ${stat.border} ${isLoading ? 'animate-pulse' : ''}`}
            >
              <p className="text-gray-500 text-sm mb-2">{stat.title}</p>
              <p className="text-2xl md:text-3xl font-bold">{isLoading ? "..." : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Date Filter Bar - made responsive */}
        <div className="flex flex-wrap items-center gap-4 px-4 md:px-8 mb-6">
          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleFilterByDate}
            >
              Filter
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Statistics sections - made responsive */}
        <div className="px-4 md:px-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Revenue Section */}
          <div className={`bg-white rounded-lg shadow-sm p-4 md:p-6 ${isLoading ? 'animate-pulse' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Revenue</h3>
            <p className="text-gray-500 text-sm mb-2">
              Total Revenue (delivered bookings): <span className="font-bold text-black">{revenue.total}</span>
            </p>
            <p className="text-gray-500 text-sm mb-2">
              Revenue ({displayDateRange}): <span className="font-bold text-black">{revenue.period}</span>
            </p>
          </div>
          
          {/* Bookings Section */}
          <div className={`bg-white rounded-lg shadow-sm p-4 md:p-6 ${isLoading ? 'animate-pulse' : ''}`}>
            <h3 className="font-semibold text-lg mb-2">Bookings</h3>
            <p className="text-gray-500 text-sm mb-2">
              Total Bookings (Placed): <span className="font-bold text-black">{bookingStats.total}</span>
            </p>
            <p className="text-gray-500 text-sm mb-2">
              Bookings ({displayDateRange}): <span className="font-bold text-black">{bookingStats.period}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 