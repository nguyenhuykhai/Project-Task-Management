export const ErrorFallback = ({ error }: { error: Error }) => (
  <div
    style={{
      padding: "20px",
      border: "1px solid #ff6b6b",
      borderRadius: "8px",
    }}
  >
    <h3>Remote Application Load Failed</h3>
    <p>Error details: {error.message}</p>
    <button onClick={() => window.location.reload()}>Reload Page</button>
  </div>
);
