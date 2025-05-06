"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import { Search, RefreshCw, Bell, AlertTriangle, CheckCircle, Info, X, Send, Plus, Filter, User, Download } from "lucide-react";
import useSWR from "swr";
import { format, formatDistanceToNow } from "date-fns";

// Mock fetcher function for demonstration
const fetcher = async () => {
  try {
    // Mock notifications data
    return [
      {
        id: "1",
        title: "New Booking Request",
        message: "You have received a new booking request for House Cleaning service.",
        type: "info",
        read: false,
        date: "2024-02-01T09:30:00Z",
        target: "admin"
      },
      {
        id: "2",
        title: "Booking Canceled",
        message: "A customer has canceled their Plumbing Service booking #12345.",
        type: "warning",
        read: true,
        date: "2024-01-30T14:45:00Z",
        target: "admin"
      },
      {
        id: "3",
        title: "Payment Received",
        message: "Payment of $150 has been received for order #67890.",
        type: "success",
        read: false,
        date: "2024-01-29T11:20:00Z",
        target: "admin"
      },
      {
        id: "4",
        title: "System Update Scheduled",
        message: "The system will be down for maintenance on February 5th from 2 AM to 4 AM.",
        type: "warning",
        read: true,
        date: "2024-01-25T16:10:00Z",
        target: "all"
      },
      {
        id: "5",
        title: "New Service Provider Registered",
        message: "A new service provider 'Elite Cleaning Services' has registered and is awaiting approval.",
        type: "info",
        read: false,
        date: "2024-01-24T13:35:00Z",
        target: "admin"
      }
    ];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, info, success, warning
  const [readFilter, setReadFilter] = useState("all"); // all, read, unread
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use SWR for real-time data
  const { data: notifications, error, isLoading, mutate } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 15000, // Refresh every 15 seconds for more real-time updates
  });

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  const handleMarkAsRead = (id) => {
    // Update notification in local data
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    mutate(updatedNotifications, false);
  };

  const handleDelete = (id) => {
    // Remove notification from local data
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    mutate(updatedNotifications, false);
  };

  const handleCreateNotification = () => {
    // Create a new notification
    const types = ["info", "success", "warning"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newNotification = {
      id: `${Date.now()}`,
      title: "New Notification",
      message: "This is a new notification created by the admin.",
      type,
      read: false,
      date: new Date().toISOString(),
      target: "admin"
    };
    
    // Add notification to our data
    if (notifications) {
      mutate([newNotification, ...notifications], false);
    } else {
      mutate([newNotification], false);
    }
  };

  const handleSendToAll = () => {
    // Create a notification for all users
    const newNotification = {
      id: `${Date.now()}`,
      title: "Notification For All Users",
      message: "This notification has been sent to all users.",
      type: "info",
      read: false,
      date: new Date().toISOString(),
      target: "all"
    };
    
    // Add notification to our data
    if (notifications) {
      mutate([newNotification, ...notifications], false);
    } else {
      mutate([newNotification], false);
    }
  };

  // Filter notifications based on search query and filters
  const filteredNotifications = notifications ? notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || notification.type === typeFilter;
    
    const matchesRead = 
      readFilter === "all" || 
      (readFilter === "read" && notification.read) || 
      (readFilter === "unread" && !notification.read);
    
    return matchesSearch && matchesType && matchesRead;
  }) : [];

  // Count statistics
  const stats = {
    total: notifications?.length || 0,
    unread: notifications?.filter(n => !n.read).length || 0,
    info: notifications?.filter(n => n.type === "info").length || 0,
    success: notifications?.filter(n => n.type === "success").length || 0,
    warning: notifications?.filter(n => n.type === "warning").length || 0,
  };

  // Icon by notification type
  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="notifications" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="notifications" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.total}</p>
              <div className="text-primary">
                <Bell className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Total Notifications</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.unread}</p>
              <div className="text-red-500">
                <Bell className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Unread</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.info}</p>
              <div className="text-blue-500">
                <Info className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Info</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.success}</p>
              <div className="text-green-500">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Success</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.warning}</p>
              <div className="text-yellow-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Warning</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 px-8 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search notifications..."
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="all">All</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              className="h-10 w-10"
            >
              <RefreshCw size={18} />
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
              onClick={handleCreateNotification}
            >
              <Plus size={18} />
              Create
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleSendToAll}
            >
              <Send size={18} />
              Send to All
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm">
            {isLoading ? (
              // Loading state
              <div className="divide-y">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 animate-pulse">
                    <div className="flex justify-between mb-2">
                      <div className="flex gap-3">
                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-40 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                Error loading data. Please try again.
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-6 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getIcon(notification.type)}
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3 ml-8">{notification.message}</p>
                    <div className="flex justify-end gap-2">
                      {!notification.read && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <X size={16} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center">
                  <Bell className="h-16 w-16 mb-4 text-gray-400" />
                  <p className="text-xl font-medium mb-2">No Notifications Found</p>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || typeFilter !== "all" || readFilter !== "all"
                      ? "Try adjusting your filters"
                      : "You don't have any notifications yet"}
                  </p>
                  {searchQuery === "" && typeFilter === "all" && readFilter === "all" && (
                    <Button 
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={handleCreateNotification}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Notification
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 