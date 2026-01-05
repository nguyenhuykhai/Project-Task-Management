import Button from "./components/Button";

const App = () => {
  return (
    <div
      id="mfe2-root"
      className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Remote Application Standalone Mode
          </h1>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="p-6 bg-muted/30 border-b">
            <h2 className="text-lg font-semibold">Nội dung từ remote app</h2>
          </div>
          <div className="p-6">
            <Button />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
