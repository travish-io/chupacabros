import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
  return (
    <div className="navbar">
      <li className="navbar__item">
        <Link to="/">
          <img
            src={require("./Chupacabros-logos_black_smaller.png").default}
            alt="Home"
            height="66px"
            width="226px"
          />
        </Link>
      </li>
      <div className="font-effect-anaglyph">
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
    </div>
  );
};
