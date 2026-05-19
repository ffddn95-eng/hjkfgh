import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import IdeaDashboard from "./routes/IdeaDashboard";
import Privacy from "./routes/Privacy";
import Terms from "./routes/Terms";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/idea/:ideaId" element={<IdeaDashboard />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}

