"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import { Search, RefreshCw, Download, Eye, Edit, User, Check, X, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// In a real app, you would have a GlobalApi method to fetch users
// This is a mock fetcher function for demonstration
const fetcher = async () => {
  try {
    // Mock users data
    return [
      {
        id: "139",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Wilson Wahome",
        email: "wilson@example.com",
        phone: "+1234567890",
        otpVerified: true,
        flagged: false,
        joinedOn: "2024-01-29",
        loyaltyLevel: "Bronze",
        loyaltyPoints: 0,
        idForInvoice: "NA",
        status: true
      },
      {
        id: "138",
        image: null,
        name: "NA",
        email: "client1@example.com",
        phone: "+1987654321",
        otpVerified: false,
        flagged: false,
        joinedOn: "2024-01-28",
        loyaltyLevel: "Bronze",
        loyaltyPoints: 0,
        idForInvoice: "NA",
        status: false
      },
      {
        id: "137",
        image: null,
        name: "Jasim Alabdouli",
        email: "jasim@example.com",
        phone: "+9876543210",
        otpVerified: true,
        flagged: false,
        joinedOn: "2024-01-26",
        loyaltyLevel: "Bronze",
        loyaltyPoints: 0,
        idForInvoice: "NA",
        status: true
      }
    ];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use SWR for real-time data
  const { data: users, error, isLoading, mutate } = useSWR('/api/users', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  const filteredUsers = users ? users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  ) : [];

  // Add function to download user data as CSV
  const handleDownloadCSV = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      alert("No data to export");
      return;
    }

    // Create CSV header
    const headers = [
      "ID", "Name", "Email", "Phone", "OTP Verified", 
      "Flagged", "Joined On", "Loyalty Level", "Loyalty Points", 
      "ID for Invoice", "Status"
    ];
    
    // Create CSV content
    const csvRows = [headers.join(",")];
    
    filteredUsers.forEach(user => {
      const values = [
        user.id,
        user.name?.replace(/,/g, "") || "NA",
        user.email,
        user.phone,
        user.otpVerified ? "Yes" : "No",
        user.flagged ? "Yes" : "No",
        user.joinedOn,
        user.loyaltyLevel,
        user.loyaltyPoints,
        user.idForInvoice,
        user.status ? "Active" : "Inactive"
      ];
      csvRows.push(values.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `users-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle user action when clicking "View"
  const handleViewUser = (user) => {
    alert(`
      User Details:
      ID: ${user.id}
      Name: ${user.name || 'NA'}
      Email: ${user.email}
      Phone: ${user.phone}
      OTP Verified: ${user.otpVerified ? 'Yes' : 'No'}
      Flagged: ${user.flagged ? 'Yes' : 'No'}
      Joined On: ${user.joinedOn}
      Loyalty Level: ${user.loyaltyLevel}
      Loyalty Points: ${user.loyaltyPoints}
      ID for Invoice: ${user.idForInvoice}
      Status: ${user.status ? 'Active' : 'Inactive'}
    `);
  };

  // Function to handle user action when clicking "Edit"
  const handleEditUser = (user) => {
    // In a real app, this would open a modal or navigate to an edit page
    alert(`Edit functionality for user ${user.name || user.email}`);
  };

  // Function to handle user action when clicking "Delete"
  const handleDeleteUser = (user) => {
    if (confirm(`Are you sure you want to delete user: ${user.name || user.email}?`)) {
      // In a real app, this would call an API to delete the user
      const updatedUsers = users.filter(u => u.id !== user.id);
      mutate(updatedUsers, false); // Update the local data without revalidation
    }
  };

  // Function to toggle user status (active/inactive)
  const toggleUserStatus = (user) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, status: !u.status };
      }
      return u;
    });
    mutate(updatedUsers, false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="users" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="users" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Users Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-8 py-6">
          <h1 className="text-2xl font-semibold">Users</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Name / Email"
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
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleDownloadCSV}
              >
                <Download size={18} />
                Download CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OTP Verified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flagged
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loyalty Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loyalty Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID for Invoice
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    // Loading state
                    Array(3).fill(0).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-10 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-36 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-6 w-12 bg-gray-200 animate-pulse rounded-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={13} className="px-6 py-4 text-center text-red-500">
                        Error loading data. Please try again.
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-100">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500">
                                <User size={18} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name || "NA"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={user.otpVerified ? "text-green-500" : "text-red-500"}>
                            {user.otpVerified ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={user.flagged ? "text-red-500" : "text-green-500"}>
                            {user.flagged ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.joinedOn), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.loyaltyLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.loyaltyPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.idForInvoice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={user.status} readOnly />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="outline" size="sm">
                                Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                                {user.status ? (
                                  <>
                                    <X className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={13} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <User className="h-12 w-12 mb-4 text-gray-400" />
                          <p className="text-lg mb-4">No users found</p>
                          {searchQuery && (
                            <p>Try adjusting your search query</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredUsers?.length > 0 && (
              <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                      <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button variant="outline" size="sm" className="rounded-l-md">Previous</Button>
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">1</Button>
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