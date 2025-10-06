"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import BasicInfoTab from "./BasicInfoTab"
import FamilyMembersTab from "./FamilyMembersTab"

interface EditQuoteDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const EditQuoteDialog: React.FC<EditQuoteDialogProps> = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState("basic")

  const handleSaveChanges = () => {
    // Implement save changes logic here
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Quote Information</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="family">Family Members</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <BasicInfoTab />
          </TabsContent>

          <TabsContent value="family">
            <FamilyMembersTab />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditQuoteDialog
