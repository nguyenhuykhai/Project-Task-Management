import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Separator orientation",
    },
    decorative: {
      control: "boolean",
      description: "Whether separator is decorative",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <h4 className="text-sm font-medium">Section 1</h4>
        <p className="text-sm text-muted-foreground">Content for section 1</p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium">Section 2</h4>
        <p className="text-sm text-muted-foreground">Content for section 2</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium">Item 1</p>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium">Item 2</p>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium">Item 3</p>
      </div>
    </div>
  ),
};
