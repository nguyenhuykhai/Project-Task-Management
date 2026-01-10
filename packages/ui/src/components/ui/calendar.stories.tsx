import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="p-4 border rounded-lg bg-background">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    );
  },
};

export const WithoutBorder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="p-4">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const WithRange: Story = {
  render: () => {
    const [date, setDate] = useState<{
      from: Date | undefined;
      to: Date | undefined;
    }>({
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    return (
      <div className="p-4 border rounded-lg bg-background">
        <Calendar
          mode="range"
          selected={date}
          onSelect={(range) => {
            setDate({
              from: range?.from,
              to: range?.to,
            });
          }}
          numberOfMonths={2}
          className="rounded-md border"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className="p-4 border rounded-lg bg-background">
        <Calendar
          mode="single"
          disabled
          className="rounded-md border opacity-50"
        />
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const disabledDays = [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() + 3)),
    ];

    return (
      <div className="p-4 border rounded-lg bg-background">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          className="rounded-md border"
        />
      </div>
    );
  },
};
