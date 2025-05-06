"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import { Search, RefreshCw, Download, Plus, User, DollarSign, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

// Mock fetcher function for demonstration
const fetcher = async () => {
  try {
    // Mock agents data
    return [
      {
        id: "001",
        name: "John Doe",
        profile: "https://randomuser.me/api/portraits/men/32.jpg",
        phone: "+1234567890",
        type: "Freelancer",
        team: "Sales",
        cashCollected: "$1,245",
        orderEarning: "$3,450",
        totalPaid: "$1,200",
        totalReceived: "$2,250",
        finalBalance: "$1,050",
        status: "active"
      },
      {
        id: "002",
        name: "Jane Smith",
        profile: null,
        phone: "+9876543210",
        type: "Employee",
        team: "Support",
        cashCollected: "$945",
        orderEarning: "$2,150",
        totalPaid: "$800",
        totalReceived: "$1,350",
        finalBalance: "$550",
        status: "active"
      },
      {
        id: "003",
        name: "Mike Johnson",
        profile: "https://randomuser.me/api/portraits/men/44.jpg",
        phone: "+1122334455",
        type: "Freelancer",
        team: "Installation",
        cashCollected: "$2,345",
        orderEarning: "$4,550",
        totalPaid: "$2,000",
        totalReceived: "$2,550",
        finalBalance: "$550",
        status: "awaiting"
      }
    ];
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
};

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // active, awaiting, blocked
  const [locationFilter, setLocationFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Add mobile menu state

  // Add state for agent being edited/deleted
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [agentToEdit, setAgentToEdit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Add vendor form state
  const [newVendor, setNewVendor] = useState({
    name: "",
    phone: "",
    type: "Freelancer",
    team: "Sales"
  });

  // Use SWR for real-time data
  const { data: allAgents, error, isLoading, mutate } = useSWR('/api/agents', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    mutate(); // Manually trigger a refresh
  };

  // Filter agents based on search query and tabs
  const filteredAgents = allAgents ? allAgents.filter(agent => {
    const matchesSearch = 
      agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agent.phone?.includes(searchQuery) ||
      agent.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      (activeTab === "active" && agent.status === "active") ||
      (activeTab === "awaiting" && agent.status === "awaiting") ||
      (activeTab === "blocked" && agent.status === "blocked");
    
    return matchesSearch && matchesTab;
  }) : [];

  // Stats for the top cards
  const stats = [
    { title: "Total Vendors", value: "43", icon: <User className="h-6 w-6 text-purple-500" /> },
    { title: "Freelancer", value: "5", icon: <User className="h-6 w-6 text-purple-500" /> },
    { title: "Employees", value: "27", icon: <User className="h-6 w-6 text-purple-500" /> },
    { title: "Approved Vendors", value: "24", icon: <User className="h-6 w-6 text-purple-500" /> },
    { title: "Unapproved Vendors", value: "3", icon: <User className="h-6 w-6 text-purple-500" /> }
  ];

  // Handle various agent actions
  const handleDeleteAgent = (agent) => {
    setAgentToDelete(agent);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAgent = () => {
    if (!agentToDelete) return;
    
    // In a real app, this would call an API to delete the agent
    console.log(`Deleting agent: ${agentToDelete.name}`);
    
    // Here we can simulate a successful deletion by filtering out the agent from our local data
    const updatedAgents = allAgents.filter(agent => agent.id !== agentToDelete.id);
    mutate(updatedAgents, false); // Update the local data without revalidating
    
    // Reset the state
    setAgentToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleEditAgent = (agent) => {
    // Open a form with agent details instead of showing an alert
    setAgentToEdit(agent);
    setNewVendor({
      name: agent.name,
      phone: agent.phone,
      type: agent.type,
      team: agent.team
    });
    setShowEditForm(true);
  };

  const handleViewDetails = (agent) => {
    // Instead of showing an alert, we can open a detailed view
    window.alert(`
      Agent Details:
      ID: ${agent.id}
      Name: ${agent.name}
      Phone: ${agent.phone}
      Type: ${agent.type}
      Team: ${agent.team}
      Status: ${agent.status}
      Cash Collected: ${agent.cashCollected}
      Order Earning: ${agent.orderEarning}
      Total Paid: ${agent.totalPaid}
      Total Received: ${agent.totalReceived}
      Final Balance: ${agent.finalBalance}
    `);
  };

  const handleAddVendor = () => {
    // Validate form
    if (!newVendor.name || !newVendor.phone) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Create a new agent object with the form data
    const newAgent = {
      id: `AG${Math.floor(Math.random() * 1000)}`,
      name: newVendor.name,
      phone: newVendor.phone,
      type: newVendor.type,
      team: newVendor.team,
      status: "awaiting",
      cashCollected: "$0",
      orderEarning: "$0",
      totalPaid: "$0",
      totalReceived: "$0",
      finalBalance: "$0",
      image: null
    };
    
    // Add the new agent to our data
    mutate([...allAgents, newAgent], false);
    
    // Reset the form
    setNewVendor({
      name: "",
      phone: "",
      type: "Freelancer",
      team: "Sales"
    });
  };

  const handleUpdateVendor = () => {
    if (!agentToEdit) return;
    
    // Update the agent with the form data
    const updatedAgents = allAgents.map(agent => {
      if (agent.id === agentToEdit.id) {
        return {
          ...agent,
          name: newVendor.name,
          phone: newVendor.phone,
          type: newVendor.type,
          team: newVendor.team
        };
      }
      return agent;
    });
    
    // Update the local data
    mutate(updatedAgents, false);
    
    // Reset the form
    setAgentToEdit(null);
    setShowEditForm(false);
    setNewVendor({
      name: "",
      phone: "",
      type: "Freelancer",
      team: "Sales"
    });
  };

  const handleExportCSV = () => {
    // Generate the CSV content
    const headers = ["Agent ID", "Name", "Phone", "Type", "Team", "Status", "Cash Collected", "Order Earning"];
    const csvRows = [headers.join(",")];
    
    filteredAgents.forEach(agent => {
      const values = [
        agent.id,
        agent.name,
        agent.phone,
        agent.type,
        agent.team,
        agent.status,
        agent.cashCollected,
        agent.orderEarning
      ];
      csvRows.push(values.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    
    // Create a download link for the CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agents-${activeTab}-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="agents" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="agents" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vendor
              and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAgent} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Vendor Dialog */}
      <AlertDialog open={showEditForm} onOpenChange={setShowEditForm}>
        <AlertDialogContent className="z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Vendor</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">Name</label>
              <Input 
                id="name" 
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">Phone</label>
              <Input 
                id="phone" 
                value={newVendor.phone}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">Type</label>
              <select
                id="type"
                value={newVendor.type}
                onChange={(e) => setNewVendor({...newVendor, type: e.target.value})}
                className="col-span-3 border rounded-md p-2"
              >
                <option value="Freelancer">Freelancer</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="team" className="text-right">Team</label>
              <select
                id="team"
                value={newVendor.team}
                onChange={(e) => setNewVendor({...newVendor, team: e.target.value})}
                className="col-span-3 border rounded-md p-2"
              >
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateVendor} className="bg-purple-500 hover:bg-purple-600">Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component with menu handler */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
                <div className="text-primary">{stat.icon}</div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 px-8 mb-6">
          <Button 
            variant={activeTab === "active" ? "default" : "outline"} 
            className={activeTab === "active" ? "bg-purple-500 hover:bg-purple-600" : ""}
            onClick={() => setActiveTab("active")}
          >
            Active ({allAgents?.filter(a => a.status === "active").length || 0})
          </Button>
          <Button 
            variant={activeTab === "awaiting" ? "default" : "outline"}
            className={activeTab === "awaiting" ? "bg-purple-500 hover:bg-purple-600" : ""}
            onClick={() => setActiveTab("awaiting")}
          >
            Awaiting Approval ({allAgents?.filter(a => a.status === "awaiting").length || 0})
          </Button>
          <Button 
            variant={activeTab === "blocked" ? "default" : "outline"}
            className={activeTab === "blocked" ? "bg-purple-500 hover:bg-purple-600" : ""}
            onClick={() => setActiveTab("blocked")}
          >
            Blocked ({allAgents?.filter(a => a.status === "blocked").length || 0})
          </Button>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 px-8 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter by location</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="all">All</option>
                <option value="new-york">New York</option>
                <option value="london">London</option>
                <option value="sydney">Sydney</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter by tags</span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="all">All</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="cleaner">Cleaner</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendors
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="z-[200]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Vendor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Fill in the details below to add a new vendor to the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm">Name *</label>
                    <Input 
                      id="name" 
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                      placeholder="Enter vendor name" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm">Phone Number *</label>
                    <Input 
                      id="phone" 
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                      placeholder="Enter phone number" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm">Vendor Type</label>
                    <select 
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newVendor.type}
                      onChange={(e) => setNewVendor({...newVendor, type: e.target.value})}
                    >
                      <option value="Freelancer">Freelancer</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="team" className="text-sm">Team</label>
                    <select 
                      id="team"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newVendor.team}
                      onChange={(e) => setNewVendor({...newVendor, team: e.target.value})}
                    >
                      <option value="Sales">Sales</option>
                      <option value="Support">Support</option>
                      <option value="Installation">Installation</option>
                    </select>
                  </div>
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddVendor} className="bg-purple-500 hover:bg-purple-600">
                    Add Vendor
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
              Pay / Receive
            </Button>
          </div>
        </div>
        
        {/* Search and Export */}
        <div className="flex flex-wrap justify-between items-center gap-4 px-8 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Agent"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
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
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white"
              onClick={handleExportCSV}
            >
              <Download size={18} />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Agents Table */}
        <div className="px-8 pb-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cash Collected
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Earning
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Paid to Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Received from Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Balance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-4 text-center text-red-500">
                        Error loading data. Please try again.
                      </td>
                    </tr>
                  ) : filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {agent.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-100">
                            {agent.profile ? (
                              <Image
                                src={agent.profile}
                                alt={agent.name}
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
                          {agent.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${agent.type === "Freelancer" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                            {agent.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.team}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.cashCollected}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.orderEarning}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.totalPaid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.totalReceived}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">
                          {agent.finalBalance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="outline" size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="z-[200]">
                              <DropdownMenuItem onClick={() => handleViewDetails(agent)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteAgent(agent)}>
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
                      <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <User className="h-12 w-12 mb-4 text-gray-400" />
                          <p className="text-lg mb-4">No agents found</p>
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
            
            {filteredAgents?.length > 0 && (
              <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAgents.length}</span> of{' '}
                      <span className="font-medium">{filteredAgents.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button variant="outline" size="sm" className="rounded-l-md">Previous</Button>
                      <Button variant="outline" size="sm" className="bg-purple-50 text-purple-600">1</Button>
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