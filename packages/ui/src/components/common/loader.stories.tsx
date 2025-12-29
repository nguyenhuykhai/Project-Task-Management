import type { Meta, StoryObj } from "@storybook/react";
import {
  LoaderOne,
  LoaderTwo,
  LoaderThree,
  LoaderFour,
  LoaderFive,
} from "./loader";

const meta: Meta = {
  title: "Common/Loader",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const LoaderOneStory: Story = {
  name: "Loader One - Bouncing Dots",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderOne />
    </div>
  ),
};

export const LoaderTwoStory: Story = {
  name: "Loader Two - Sliding Dots",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderTwo />
    </div>
  ),
};

export const LoaderThreeStory: Story = {
  name: "Loader Three - Lightning Bolt",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderThree />
    </div>
  ),
};

export const LoaderFourStory: Story = {
  name: "Loader Four - Glitch Effect",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderFour text="Loading..." />
    </div>
  ),
};

export const LoaderFourCustomText: Story = {
  name: "Loader Four - Custom Text",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderFour text="Processing..." />
    </div>
  ),
};

export const LoaderFiveStory: Story = {
  name: "Loader Five - Wave Text",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderFive text="Loading" />
    </div>
  ),
};

export const LoaderFiveCustomText: Story = {
  name: "Loader Five - Custom Text",
  render: () => (
    <div className="flex items-center justify-center p-8">
      <LoaderFive text="Please Wait" />
    </div>
  ),
};

export const AllLoaders: Story = {
  name: "All Loaders",
  render: () => (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Loader One</h3>
        <div className="flex items-center justify-center border rounded p-4">
          <LoaderOne />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Loader Two</h3>
        <div className="flex items-center justify-center border rounded p-4">
          <LoaderTwo />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Loader Three</h3>
        <div className="flex items-center justify-center border rounded p-4">
          <LoaderThree />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Loader Four</h3>
        <div className="flex items-center justify-center border rounded p-4">
          <LoaderFour text="Loading..." />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Loader Five</h3>
        <div className="flex items-center justify-center border rounded p-4">
          <LoaderFive text="Loading" />
        </div>
      </div>
    </div>
  ),
};
