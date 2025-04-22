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

// TODO: Add a loading spinner while fetching data

// TODO: Create Resources comparison page

// TODO: Show the stats comparison between V3 and Beta in the SetsStatsCard component

// TODO: Fix the key conflict issue in the Equipment component,
// there seems to be items sharing same name but different ids,
// solution should be adding id to the name same as i have done in the Sets component at updateNoDuplicateSetsList

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
