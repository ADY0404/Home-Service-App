"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import { Search, RefreshCw, Star, MessageSquare, Filter, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";

// Mock fetcher function for demonstration
const fetcher = async () => {
  try {
    // Mock feedback data
    return [
      {
        id: "1",
        userId: "user123",
        userName: "John Smith",
        userImage: "https://randomuser.me/api/portraits/men/32.jpg",
        serviceId: "serv456",
        serviceName: "House Cleaning",
        rating: 5,
        comment: "Excellent service! The cleaners were professional and thorough. Will definitely use again.",
        date: "2024-01-15T10:30:00Z",
        status: "approved"
      },
      {
        id: "2",
        userId: "user456",
        userName: "Jane Doe",
        userImage: null,
        serviceId: "serv789",
        serviceName: "Plumbing Repair",
        rating: 3,
        comment: "Service was okay. The plumber fixed the issue but left a mess behind that I had to clean up.",
        date: "2024-01-10T14:45:00Z",
        status: "approved"
      },
      {
        id: "3",
        userId: "user789",
        userName: "Robert Johnson",
        userImage: "https://randomuser.me/api/portraits/men/44.jpg",
        serviceId: "serv123",
        serviceName: "Electrical Work",
        rating: 1,
        comment: "Very disappointed with the service. The electrician was late and didn't fix the issue properly.",
        date: "2024-01-05T09:15:00Z",
        status: "pending"
      },
      {
        id: "4",
        userId: "user321",
        userName: "Emily Wilson",
        userImage: "https://randomuser.me/api/portraits/women/24.jpg",
        serviceId: "serv654",
        serviceName: "Garden Maintenance",
        rating: 4,
        comment: "Great job with the garden! Just a few small areas were missed, but overall very satisfied.",
        date: "2024-01-02T16:20:00Z",
        status: "rejected"
      }
    ];
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
};

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending, rejected
  const [ratingFilter, setRatingFilter] = useState("all"); // all, 5, 4, 3, 2, 1
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use SWR for real-time data
  const { data: feedbacks, error, isLoading, mutate } = useSWR('/api/feedback', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  const handleApprove = (id) => {
    // Update feedback status in local data
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === id) {
        return { ...feedback, status: "approved" };
      }
      return feedback;
    });
    
    mutate(updatedFeedbacks, false);
  };

  const handleReject = (id) => {
    // Update feedback status in local data
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === id) {
        return { ...feedback, status: "rejected" };
      }
      return feedback;
    });
    
    mutate(updatedFeedbacks, false);
  };

  // Filter feedbacks based on search query, status, and rating
  const filteredFeedbacks = feedbacks ? feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      feedback.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || feedback.status === statusFilter;
    
    const matchesRating = 
      ratingFilter === "all" || feedback.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  }) : [];

  // Count statistics
  const stats = {
    total: feedbacks?.length || 0,
    approved: feedbacks?.filter(f => f.status === "approved").length || 0,
    pending: feedbacks?.filter(f => f.status === "pending").length || 0,
    rejected: feedbacks?.filter(f => f.status === "rejected").length || 0,
    averageRating: feedbacks?.length 
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
      : 0
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="feedback" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="feedback" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.total}</p>
              <div className="text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Total Feedback</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.approved}</p>
              <div className="text-green-500">
                <ThumbsUp className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Approved</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.pending}</p>
              <div className="text-yellow-500">
                <Filter className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Pending</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.rejected}</p>
              <div className="text-red-500">
                <ThumbsDown className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Rejected</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.averageRating}</p>
              <div className="text-yellow-400">
                <Star className="h-6 w-6 fill-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Average Rating</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap justify-between items-center gap-4 px-8 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
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

        {/* Feedback Cards */}
        <div className="px-8 pb-8">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
              Error loading data. Please try again.
            </div>
          ) : filteredFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 relative rounded-full overflow-hidden bg-gray-100">
                        {feedback.userImage ? (
                          <Image
                            src={feedback.userImage}
                            alt={feedback.userName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-200">
                            {feedback.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{feedback.userName}</h3>
                        <p className="text-sm text-gray-500">{feedback.serviceName}</p>
                        <div className="flex mt-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      feedback.status === "approved" ? "bg-green-100 text-green-800" : 
                      feedback.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-gray-700">{feedback.comment}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {format(new Date(feedback.date), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    
                    {feedback.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleReject(feedback.id)}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleApprove(feedback.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="flex flex-col items-center">
                <MessageSquare className="h-16 w-16 mb-4 text-gray-400" />
                <p className="text-xl font-medium mb-2">No Feedback Found</p>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== "all" || ratingFilter !== "all"
                    ? "Try adjusting your filters"
                    : "There's no feedback yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 