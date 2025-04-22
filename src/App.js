import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Equipment from "./components/Equipment";
import Sets from "./components/Sets";
import "./App.css"; // Assuming you have some styles

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Redirect the root path to /equipment */}
            <Route path="/" element={<Navigate to="/sets" replace />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/sets" element={<Sets />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
