import type { Preview } from "@storybook/react";
import React from "react";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (Story) => (
      <div
        id="storybook-root"
        className="min-h-0s bg-background text-foreground p-4"
        style={{
          fontFamily: "Lexend, sans-serif",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
