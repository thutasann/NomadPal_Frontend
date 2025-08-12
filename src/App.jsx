// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CityCard from "./components/CityCard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout"; 
import Cities from "./pages/Cities";
import Register from "./pages/Register";
import Footer from "./components/Footer"; 
import Profile from "./pages/Profile";
import CityDetail from "./pages/CityDetail";
import JobDetail from "./pages/JobDetail.jsx";


export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/cities/:slug" element={<CityDetail />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />

        <Route path="*" element={<NotFound />} />
        
      </Routes>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: "80px 20px", textAlign: "center" }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <a className="btn" href="/">Go home</a>
    </div>
  );
}
