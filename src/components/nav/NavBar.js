import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
// import logo from "logo.path"
export const NavBar = () => {
  return (
    <div className="navbar">
      <li className="navbar__item">
        <Link to="/"> Chupacabros</Link>
      </li>
      <li className="navbar__item">
        <Link
          className="navbar__link"
          to="#"
          onClick={() => {
            localStorage.removeItem("chupacabro_user");
          }}
        >
          Logout
        </Link>
      </li>
    </div>
  );
};
//<img src={logo} alt="Home" />
