"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import { Search, RefreshCw, Plus, Image as ImageIcon, Edit, Trash, Eye } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";

// Mock fetcher function for demonstration
const fetcher = async () => {
  try {
    // Mock banners data
    return [
      {
        id: "1",
        title: "Summer Home Services",
        image: "https://source.unsplash.com/random/1200x300/?summer,home",
        active: true,
        startDate: "2023-06-01",
        endDate: "2023-08-31",
        clicks: 245,
        views: 1352
      },
      {
        id: "2",
        title: "Winter Maintenance Offer",
        image: "https://source.unsplash.com/random/1200x300/?winter,home",
        active: true,
        startDate: "2023-12-01",
        endDate: "2024-02-28",
        clicks: 189,
        views: 978
      },
      {
        id: "3",
        title: "Special Cleaning Discount",
        image: "https://source.unsplash.com/random/1200x300/?cleaning",
        active: false,
        startDate: "2023-09-01",
        endDate: "2023-10-31",
        clicks: 123,
        views: 754
      }
    ];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

export default function BannersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  // Use SWR for real-time data
  const { data: banners, error, isLoading, mutate } = useSWR('/api/banners', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  const handleAddBanner = () => {
    // Create a new banner
    const newBanner = {
      id: `banner-${Date.now()}`,
      title: "New Banner",
      image: "https://source.unsplash.com/random/1200x300/?home",
      active: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      clicks: 0,
      views: 0
    };

    // Add the banner to our data
    if (banners) {
      mutate([...banners, newBanner], false);
    } else {
      mutate([newBanner], false);
    }
  };

  const handleEditBanner = (id) => {
    const banner = banners.find(banner => banner.id === id);
    if (banner) {
      // This would normally open a form or modal
      const title = prompt("Enter new banner title:", banner.title);
      if (title) {
        const updatedBanners = banners.map(b => {
          if (b.id === id) {
            return { ...b, title };
          }
          return b;
        });
        mutate(updatedBanners, false);
      }
    }
  };

  const handleDeleteBanner = (id) => {
    // Ask for confirmation
    if (confirm(`Are you sure you want to delete this banner?`)) {
      // Remove the banner from our data
      const updatedBanners = banners.filter(banner => banner.id !== id);
      mutate(updatedBanners, false);
    }
  };

  const handleToggleBannerStatus = (id) => {
    // Toggle the active status
    const updatedBanners = banners.map(banner => {
      if (banner.id === id) {
        return { ...banner, active: !banner.active };
      }
      return banner;
    });
    
    mutate(updatedBanners, false);
  };

  // Filter banners based on search query
  const filteredBanners = banners ? banners.filter(banner => 
    banner.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="banners" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="banners" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Banners Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-8 py-6">
          <h1 className="text-2xl font-semibold">Banners</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search banners..."
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                className="h-10 w-10"
              >
                <RefreshCw size={18} />
              </Button>
              <Button 
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handleAddBanner}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="px-8 pb-8">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
              Error loading data. Please try again.
            </div>
          ) : filteredBanners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                          banner.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                        onClick={() => handleToggleBannerStatus(banner.id)}
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{banner.title}</h3>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>Start: {new Date(banner.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(banner.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Clicks: {banner.clicks}</span>
                      <span>Views: {banner.views}</span>
                      <span>CTR: {((banner.clicks / banner.views) * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleEditBanner(banner.id)}
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteBanner(banner.id)}
                      >
                        <Trash size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="flex flex-col items-center">
                <ImageIcon className="h-16 w-16 mb-4 text-gray-400" />
                <p className="text-xl font-medium mb-2">No Banners Found</p>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? "No banners match your search query" 
                    : "You haven't created any banners yet"}
                </p>
                <Button 
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={handleAddBanner}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Banner
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 