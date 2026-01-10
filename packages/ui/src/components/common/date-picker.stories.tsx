import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { useState } from "react";

const meta: Meta<typeof DatePicker> = {
  title: "Common/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <div className="p-4 w-[300px]">
        <DatePicker date={date} onDateChange={setDate} />
      </div>
    );
  },
};

export const WithSelectedDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="p-4 w-[300px]">
        <DatePicker date={date} onDateChange={setDate} />
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <div className="p-4 w-[300px]">
        <DatePicker
          date={date}
          onDateChange={setDate}
          placeholder="Chọn ngày hết hạn"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="p-4 w-[300px]">
        <DatePicker date={date} onDateChange={setDate} disabled />
      </div>
    );
  },
};

export const InForm: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <div className="p-6 max-w-md border rounded-lg bg-background">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Tạo nhiệm vụ</h3>
            <p className="text-sm text-muted-foreground">
              Chọn ngày hết hạn cho nhiệm vụ
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Ngày hết hạn <span className="text-red-500">*</span>
            </label>
            <DatePicker
              date={date}
              onDateChange={setDate}
              placeholder="Chọn ngày hết hạn"
            />
          </div>

          {date && (
            <div className="text-sm text-muted-foreground">
              Ngày đã chọn: {date.toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>
      </div>
    );
  },
};
