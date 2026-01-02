/// <parameter name="reference types="@rsbuild/core/types" />

// Module Federation Remote Type Declarations

declare module "docs_app/App" {
  const AppWrapper: React.ComponentType;
  export default AppWrapper;
}

declare module "remote/*" {
  const Component: React.ComponentType<any>;
  export default Component;
}
