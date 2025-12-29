import type { Meta, StoryObj } from "@storybook/react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
import { Button } from "./button";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[350px] space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setIsOpen(!isOpen)} size="sm">
            Toggle
          </Button>
          <Button onClick={() => setIsOpen(true)} size="sm" variant="outline">
            Open
          </Button>
          <Button onClick={() => setIsOpen(false)} size="sm" variant="outline">
            Close
          </Button>
        </div>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-[350px] space-y-2"
        >
          <div className="rounded-md border px-4 py-3">
            <h4 className="text-sm font-semibold mb-2">Section Header</h4>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                This is the collapsible content. You can control its visibility
                using external buttons or the internal trigger.
              </p>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    );
  },
};
