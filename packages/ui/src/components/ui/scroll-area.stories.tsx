import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="text-sm">Tag {i + 1}</div>
            {i < 49 && <Separator className="my-2" />}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="shrink-0">
            <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center">
              <span className="text-sm">Item {i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

import * as React from "react";
