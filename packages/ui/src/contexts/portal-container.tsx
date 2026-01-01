import * as React from "react";

/**
 * Context for providing a portal container element to all portal-based components.
 *
 * In micro-frontend architectures where Tailwind CSS uses scoping (e.g., `important: "#mfe1-root"`),
 * portal components that render to `document.body` by default won't receive styles.
 *
 * This context allows you to specify a container element for all portals in your app,
 * ensuring they render within the scoped CSS container.
 *
 * @example
 * ```tsx
 * // In your app's root (e.g., bootstrap.tsx)
 * import { PortalContainerProvider } from '@repo/ui';
 *
 * const mfe1Container = document.getElementById('mfe1-root');
 *
 * root.render(
 *   <PortalContainerProvider container={mfe1Container}>
 *     <App />
 *   </PortalContainerProvider>
 * );
 * ```
 *
 * All portal components (DropdownMenu, Sheet, Dialog, etc.) will automatically
 * use this container without needing to pass `container` prop manually.
 */
export const PortalContainerContext = React.createContext<HTMLElement | null>(
  null
);

/**
 * Hook to access the portal container from context.
 *
 * @returns The portal container element, or null if not provided
 */
export function usePortalContainer(): HTMLElement | null {
  return React.useContext(PortalContainerContext);
}

export interface PortalContainerProviderProps {
  /**
   * The container element where portals should render.
   * Typically this is your app's root scoped element (e.g., #mfe1-root).
   */
  container: HTMLElement | null;
  children: React.ReactNode;
}

/**
 * Provider component that supplies a portal container to all child components.
 *
 * @param props - Provider props
 * @param props.container - The container element for portals
 * @param props.children - Child components
 */
export function PortalContainerProvider({
  container,
  children,
}: PortalContainerProviderProps) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  );
}
