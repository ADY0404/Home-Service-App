"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProviderRegistrationPage() {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    category: "",
    additionalServices: [],
    experience: "",
    serviceArea: "",
    bio: "",
    agreedToTerms: false
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (key, value) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleCheckboxChange = (value) => {
    const exists = formData.additionalServices.includes(value)
    const updated = exists
      ? formData.additionalServices.filter((s) => s !== value)
      : [...formData.additionalServices, value]
    setFormData({ ...formData, additionalServices: updated })
  }

  const handleFinalCheckbox = () => {
    setFormData({ ...formData, agreedToTerms: !formData.agreedToTerms })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/register-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const result = await response.json()
      if (result.success) alert("Registration successful!")
      else alert("Failed to register")
    } catch (error) {
      console.error(error)
      alert("An error occurred.")
    }
  }

  const handleNextStep = () => setStep(step + 1)
  const handlePrevStep = () => setStep(step - 1)

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Service Provider Registration</CardTitle>
            <CardDescription>
              Join our platform as a service provider and grow your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                {[
                  { label: "First Name", id: "firstName" },
                  { label: "Last Name", id: "lastName" },
                  { label: "Business Name", id: "businessName" },
                  { label: "Email", id: "email", type: "email" },
                  { label: "Phone", id: "phone" },
                  { label: "Address", id: "address", textarea: true },
                  { label: "Password", id: "password", type: "password" },
                  { label: "Confirm Password", id: "confirmPassword", type: "password" }
                ].map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.textarea ? (
                      <Textarea id={field.id} value={formData[field.id]} onChange={handleChange} />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type || "text"}
                        value={formData[field.id]}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Service Category</Label>
                  <Select onValueChange={(val) => handleSelectChange("category", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {["cleaning", "delivery", "painting", "plumbing", "electricals", "repair"].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Services</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["House Cleaning", "Package Delivery", "Interior Painting", "Pipe Repair", "Electrical Wiring", "Appliance Repair"].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.additionalServices.includes(service)}
                          onCheckedChange={() => handleCheckboxChange(service)}
                        />
                        <label className="text-sm">{service}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Select onValueChange={(val) => handleSelectChange("experience", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1-2", "3-5", "5-10", "10+"].map((exp) => (
                        <SelectItem key={exp} value={exp}>{exp} years</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Service Area (miles)</Label>
                  <Select onValueChange={(val) => handleSelectChange("serviceArea", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service area" />
                    </SelectTrigger>
                    <SelectContent>
                      {["5", "10", "15", "20", "25+"].map((mi) => (
                        <SelectItem key={mi} value={mi}>{mi} miles</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea id="bio" value={formData.bio} onChange={handleChange} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>
                    <Checkbox checked={formData.agreedToTerms} onCheckedChange={handleFinalCheckbox} />
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handlePrevStep}>Previous</Button>
            ) : <div />}
            {step < 3 ? (
              <Button onClick={handleNextStep}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!formData.agreedToTerms}>Submit Application</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
