"use client"
import { MapPin, User, DollarSign } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const BasicInfoTab = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code</Label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input id="zipCode" placeholder="Enter ZIP code" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="householdSize">Household Size</Label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input id="householdSize" placeholder="Enter household size" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="income">Income</Label>
        <div className="grid grid-cols-3 gap-3">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Yearly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative col-span-2">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Annual income" className="pl-9" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoTab
