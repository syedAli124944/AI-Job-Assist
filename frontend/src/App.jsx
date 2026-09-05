import { Route, Routes } from "react-router-dom";
import { useHealthCheck } from "./hooks/useHealthCheck";

function HomePage() {
  const backendStatus = useHealthCheck();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">AI Job Search Assistant</h1>
      <p>
        Backend status:{" "}
        <span className="font-mono">{backendStatus}</span>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
