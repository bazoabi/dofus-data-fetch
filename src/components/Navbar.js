import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/equipment">Equipment</Link>
        </li>
        <li className="nav-item">
          <Link to="/sets">Sets</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
