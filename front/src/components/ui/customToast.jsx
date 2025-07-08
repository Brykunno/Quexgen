import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "sonner"
import { AlertTriangleIcon, InfoIcon, PlusIcon } from "lucide-react"
import { CircleCheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button"



export function customToast(icon,message){
    const IconComponent = {
      success: CircleCheckIcon,
      error: AlertTriangleIcon,
      info: InfoIcon,
    }[icon] || CircleCheckIcon;
  
    const iconColor = {
      success: "text-emerald-500",
      error: "text-red-500",
      info: "text-blue-500",
    }[icon] || "text-emerald-500";
  
    toast.custom((t) => (
      <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <IconComponent
              className={`mt-0.5 shrink-0 ${iconColor}`}
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow justify-between gap-12">
              <p className="text-sm">{message}</p>
             
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => toast.dismiss(t)}
            aria-label="Close banner"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    ));
  
  }