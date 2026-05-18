import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import IdeaDashboard from "./routes/IdeaDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/idea/:ideaId" element={<IdeaDashboard />} />
    </Routes>
  );
}

