import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

import Overview from "../pages/Dashboard/Overview";
import Settings from "../pages/Dashboard/Settings";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      <Route path="/dashboard/overview" element={<Overview />} />
      <Route path="/dashboard/settings" element={<Settings />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
