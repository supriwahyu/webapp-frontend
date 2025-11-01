import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/page";
import Register from "./register/page";
import Dashboard from "./dashboard/page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
