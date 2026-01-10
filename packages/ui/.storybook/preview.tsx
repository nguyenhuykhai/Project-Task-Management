import type { Preview, StoryFn } from "@storybook/react";
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
    (Story) => {
      React.useEffect(() => {
        const body = document.body;
        body.id = "storybook-root";
        body.classList.add("bg-background", "text-foreground");
        body.style.fontFamily = "Lexend, sans-serif";

        return () => {
          body.id = "";
          body.classList.remove("bg-background", "text-foreground");
          body.style.removeProperty("font-family");
        };
      }, []);

      return <Story />;
    },
  ],
};

export default preview;
