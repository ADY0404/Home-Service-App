"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import GlobalApi from "@/app/_services/GlobalApi";
import { Search, RefreshCw, Calendar, Check, X } from "lucide-react";
import useSWR from "swr";
import { format } from "date-fns";
import Image from "next/image";

// Fetcher function for SWR
const fetcher = async () => {
  try {
    // For demo purposes, we're using the GetUserBookingHistory with "all" as a placeholder
    // In a real app, you would have a dedicated API for admin to fetch all bookings
    const response = await GlobalApi.GetUserBookingHistory("all");
    return response.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("pending"); // pending, active, history
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentType, setPaymentType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Use SWR for real-time data
  const { data: allBookings, error, isLoading, mutate } = useSWR('/api/bookings', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Filter bookings based on active tab
  const filteredBookings = allBookings ? allBookings.filter(booking => {
    if (activeTab === "pending") return !booking.isConfirmed;
    if (activeTab === "active") return booking.isConfirmed && new Date(booking.date) >= new Date();
    if (activeTab === "history") return booking.isConfirmed && new Date(booking.date) < new Date();
    return true;
  }) : [];

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  const handleAccept = (id) => {
    // Update booking status in local data
    const updatedBookings = allBookings.map(booking => {
      if (booking.id === id) {
        return { ...booking, isConfirmed: true };
      }
      return booking;
    });
    
    mutate(updatedBookings, false);
    alert(`Booking ${id} has been confirmed.`);
  };

  const handleReject = (id) => {
    // Remove booking from local data
    const updatedBookings = allBookings.filter(booking => booking.id !== id);
    mutate(updatedBookings, false);
    alert(`Booking ${id} has been rejected.`);
  };

  const handleViewDetails = (id) => {
    // In a real app, this would navigate to a detailed view
    alert(`View details for booking ${id}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Apply all filters
  const applyFilters = (booking) => {
    // Search filter
    const matchesSearch = 
      !searchQuery || 
      booking.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.businessList?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filter
    const matchesDate = 
      !selectedDate || 
      booking.date === selectedDate;
    
    // Payment type filter
    const matchesPayment = 
      paymentType === 'all' || 
      booking.paymentType?.toLowerCase() === paymentType.toLowerCase();
    
    return matchesSearch && matchesDate && matchesPayment;
  };
  
  // Final filtered bookings
  const bookingsToDisplay = filteredBookings.filter(applyFilters);

  // Mock data for demonstrating the UI when real data is not available
  const mockBookings = [
    {
      id: '450',
      businessList: {
        name: '5 Sofa Seats x 1',
        address: 'Brewers Services, SCO 50-51, 1st Floor, near Mukut Hospital, Sub. City Center, Sector 34',
        contactPerson: 'John Smith',
        images: [{ url: 'https://via.placeholder.com/80' }]
      },
      date: '2024-01-12',
      time: '07:58 PM',
      paymentType: 'Cash',
      amount: '$467.50',
      userEmail: 'user1@example.com',
      userName: 'User One',
      deliveryMode: 'Delivery',
      createdAt: '2024-01-12T07:58:00Z'
    },
    {
      id: '445',
      businessList: {
        name: '5 Sofa Seats x 1',
        address: 'Brewers Services, SCO 50-51, 1st Floor, near Mukut Hospital, Sub. City Center, Sector 34',
        contactPerson: 'Jane Doe',
        images: [{ url: 'https://via.placeholder.com/80' }]
      },
      date: '2024-01-08',
      time: '01:19 PM',
      paymentType: 'Cash',
      amount: '$467.50',
      userEmail: 'user2@example.com',
      userName: 'User Two',
      deliveryMode: 'Delivery',
      createdAt: '2024-01-08T13:19:00Z'
    }
  ];

  // Use mock data when real data is not available
  const displayBookings = bookingsToDisplay.length > 0 ? bookingsToDisplay : mockBookings;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="bookings" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="bookings" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-8">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pending"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </button>
              <button
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500 w-16">Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="ml-2 border rounded-md p-2 flex-grow"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-500 w-28">Payment Type</span>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="ml-2 border rounded-md p-2 flex-grow"
              >
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              className="h-10 w-10"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            // Loading state
            Array(2).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-5 w-28 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-3"></div>
                <div className="h-20 w-full bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
              Error loading data. Please try again.
            </div>
          ) : displayBookings.length > 0 ? (
            displayBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between mb-2">
                  <div className="flex">
                    <span className="text-gray-500">BOOKING ID - </span>
                    <span className="text-cyan-500 font-medium ml-1">{booking.id}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(booking.id)}
                  >
                    View Details
                  </Button>
                </div>
                
                <div className="mb-3">
                  <span className="text-gray-500">BOOKING PLACED ON - </span>
                  {booking.createdAt ? (
                    <span className="font-medium">
                      {format(new Date(booking.createdAt), "MMM d, yyyy · hh:mm a")}
                    </span>
                  ) : (
                    <span className="font-medium">JAN 12, 2021 · 07:58 PM</span>
                  )}
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0 h-12 w-12 relative rounded-md overflow-hidden bg-gray-100">
                    {booking.businessList.images && booking.businessList.images[0] ? (
                      <Image
                        src={booking.businessList.images[0].url}
                        alt={booking.businessList.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">
                        <Calendar size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{booking.businessList.name}</div>
                    <div className="text-gray-500 text-sm mt-1">
                      {booking.date && 
                        `${Math.floor(Math.random() * 30)} Days ${Math.floor(Math.random() * 12)} Hrs. ${Math.floor(Math.random() * 60)} Mins. ${Math.floor(Math.random() * 60)} Sec.`
                      }
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Mode - </span>
                    <span className="font-medium">{booking.deliveryMode || 'Delivery'}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-gray-500">{booking.businessList.address}</div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">booking price - </span>
                    <span className="font-medium">{booking.amount || '$467.50'}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment - </span>
                    <span className="font-medium">{booking.paymentType || 'Cash'}</span>
                  </div>
                </div>
                
                {activeTab === "pending" && (
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      className="bg-gray-100 hover:bg-gray-200"
                      onClick={() => handleReject(booking.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      onClick={() => handleAccept(booking.id)}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="flex flex-col items-center">
                <Calendar className="h-16 w-16 mb-4 text-gray-400" />
                <p className="text-xl font-medium mb-2">No Bookings Found</p>
                <p className="text-gray-500 mb-6">There are no bookings in this section currently.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 