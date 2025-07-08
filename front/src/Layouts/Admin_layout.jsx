import AdminPanelLayout from '@/components/admin-panel/test/admin-panel-layout'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from "@/components/ui/sonner"
function Admin_layout({title,children,addBreadCrumb}) {
  return (
    <>
    <AdminPanelLayout >
  <ContentLayout title={title} addBreadCrumb={addBreadCrumb}>
    {children}
  </ContentLayout>
  <Toaster />
</AdminPanelLayout>
    </>

  )
}

export default Admin_layout
