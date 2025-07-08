import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";

export function Navbar({
  title
}) {
  return (
<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
  <div className="mx-4 sm:mx-8 flex h-14 items-center justify-between">
    <SheetMenu />
    <h1 className="font-bold text-xl flex-1 text-center">{title}</h1>
    <div className="flex items-center space-x-4">
      <ModeToggle />
      <UserNav />
    </div>
  </div>
</header>

  );
}
