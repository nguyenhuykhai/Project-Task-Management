import { Link } from "react-router";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@repo/ui";
import { Menu } from "@/components/layouts/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@repo/ui";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      {/* Updated: Added background, border, and shadow classes for dark mode */}
      <SheetContent
        className="sm:w-72 px-3 h-full flex flex-col bg-background dark:bg-zinc-950 border-r border-border dark:border-zinc-800 shadow-lg"
        side="left"
      >
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link to="/dashboard" className="flex items-center">
              <PanelsTopLeft className="w-6 h-6 mr-1 text-primary" />
              <SheetTitle className="font-bold text-lg text-foreground">
                Brand
              </SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
