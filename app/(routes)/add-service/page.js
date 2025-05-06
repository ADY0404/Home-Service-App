"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebar, TopBar } from "../dashboard/page";
import GlobalApi from "@/app/_services/GlobalApi";
import { PlusCircle, Import } from "lucide-react";

export default function AddServicePage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await GlobalApi.getCategory();
      setCategories(response.categories || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // In a real app, you would fetch services for this category
    setServices([]); // Reset services when changing category
  };

  const handleAddService = () => {
    // Create a new service
    const newService = {
      id: `svc-${Date.now()}`,
      name: "New Service",
      description: "Service description goes here",
      price: "$99",
      category: selectedCategory ? selectedCategory.id : null
    };
    
    // Add service to our list
    setServices([...services, newService]);
  };

  const handleAddCategory = () => {
    // Prompt for category name
    const categoryName = prompt("Enter new category name:");
    if (categoryName && categoryName.trim() !== "") {
      // Create new category
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: categoryName.trim(),
        slug: categoryName.trim().toLowerCase().replace(/\s+/g, '-')
      };
      
      // Add category to our list
      setCategories([...categories, newCategory]);
    }
  };

  const handleEditCategory = (category) => {
    // Prompt for updated name
    const newName = prompt("Edit category name:", category.name);
    if (newName && newName.trim() !== "") {
      // Update category in our list
      const updatedCategories = categories.map(cat => {
        if (cat.id === category.id) {
          return {
            ...cat,
            name: newName.trim(),
            slug: newName.trim().toLowerCase().replace(/\s+/g, '-')
          };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
    }
  };

  const handleImportData = () => {
    alert("This would open a dialog to import data from a CSV or Excel file.");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar activePage="add-service" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        activePage="add-service" 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Use the TopBar component */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Add Service Header */}
        <div className="flex justify-between items-center px-8 py-6">
          <h1 className="text-2xl font-semibold">Add Service</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleImportData}
          >
            <Import className="h-4 w-4" />
            Import
          </Button>
        </div>

        {/* Categories and Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-8">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Categories</h2>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-8 h-8 p-0"
                  onClick={handleAddCategory}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  ≡
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              // Loading state
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              // Category list
              <div className="space-y-1">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 border-l-4 border-transparent hover:border-l-4 hover:border-blue-500 cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <span>{category.name}</span>
                      <button 
                        className="text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">No categories found</div>
                )}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Services</h2>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-8 h-8 p-0"
                  onClick={handleAddService}
                  disabled={!selectedCategory}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  ≡
                </Button>
              </div>
            </div>
            
            {/* Services list or empty state */}
            {selectedCategory ? (
              services.length > 0 ? (
                <div className="space-y-2">
                  {services.map(service => (
                    <div key={service.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{service.name}</h3>
                        <span className="text-green-600">{service.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-lg">No Services Found</p>
                  <div className="mt-6">
                    <Button 
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={handleAddService}
                    >
                      Add Services
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p className="text-lg">Select a category to view services</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 