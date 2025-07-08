import { Navbar } from "@/components/admin-panel/navbar";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster"

export function ContentLayout({
  title,
  children,
  addBreadCrumb
}) {
  return (
    <div > 
      <Navbar title={title} />
      <div className="pt-6 pb-6 px-2 sm:px-8">
        <Card className="rounded-lg border-none w-full">
              <CardContent className="px-6 py-4">
          <div className="mt-[-20px]">{addBreadCrumb}</div>
                <div className="flex justify-center items-center min-h-[calc(100vh-56px-20px-20px-24px-56px-48px)]">
                  <div className=" w-full flex flex-col relative">
                  {children}
                    </div>
                  </div>
                  <Toaster />
                  </CardContent>
                      </Card></div>
                   
    </div>
  );
}
