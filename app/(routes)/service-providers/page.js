"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import GlobalApi from "@/app/_services/GlobalApi";
import { PlusCircle, Search, RefreshCw, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// Fetcher function for SWR
const fetcher = async () => {
  try {
    const response = await GlobalApi.getAllBusinessList();
    return response.businessLists || [];
  } catch (error) {
    console.error("Error fetching service providers:", error);
    return [];
  }
};

export default function ServiceProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // active, pending, blocked
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use SWR for real-time data
  const { data: serviceProviders, error, isLoading, mutate } = useSWR('/api/serviceProviders', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  // Add function to handle adding a provider
  const handleAddProvider = () => {
    const newProvider = {
      id: `SP${Math.floor(Math.random() * 1000)}`,
      name: "New Provider",
      contactPerson: "Contact Person",
      email: "provider@example.com",
      category: { name: "Cleaning" },
      address: "123 Main St, City",
      status: true,
      images: []
    };

    // Add the new provider to our data
    if (serviceProviders) {
      mutate([...serviceProviders, newProvider], false);
    } else {
      mutate([newProvider], false);
    }
  };

  // Add function to handle editing a provider
  const handleEditProvider = (id) => {
    // In a real app, this would open a form to edit the provider
    alert(`Edit provider ${id}`);
  };

  // Add function to handle searching
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter providers based on search
  const filteredProviders = serviceProviders
    ? serviceProviders.filter(provider => 
        provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="service-providers" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="service-providers" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Service Providers Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-8 py-6">
          <h1 className="text-2xl font-semibold">Service Providers</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search providers..."
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
                value={searchQuery}
                onChange={handleSearch}
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
                onClick={handleAddProvider}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Provider
              </Button>
            </div>
          </div>
        </div>

        {/* Service Providers List */}
        <div className="px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    // Loading state
                    Array(5).fill(0).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="ml-4">
                              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                        Error loading data. Please try again.
                      </td>
                    </tr>
                  ) : serviceProviders?.length > 0 ? (
                    filteredProviders.map((provider) => (
                      <tr key={provider.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-100">
                              {provider.images && provider.images[0] ? (
                                <Image
                                  src={provider.images[0].url}
                                  alt={provider.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-500">
                                  <User size={20} />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                              <div className="text-sm text-gray-500">{provider.contactPerson}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {provider.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {provider.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {provider.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProvider(provider.id)}
                          >Edit</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <PlusCircle className="h-12 w-12 mb-4 text-gray-400" />
                          <p className="text-lg mb-4">No service providers found</p>
                          <Button className="bg-primary text-white hover:bg-primary/90">
                            Add Provider
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {serviceProviders?.length > 0 && (
              <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">{serviceProviders.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button variant="outline" size="sm" className="rounded-l-md">Previous</Button>
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">1</Button>
                      <Button variant="outline" size="sm">2</Button>
                      <Button variant="outline" size="sm">3</Button>
                      <Button variant="outline" size="sm" className="rounded-r-md">Next</Button>
                    </nav>
                  </div>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 