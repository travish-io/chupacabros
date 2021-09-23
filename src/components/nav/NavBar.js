import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
  const [toggleCreate, setToggleCreate] = useState(false);

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
      {toggleCreate ? (
        <div className="font-effect-anaglyph">
          <Link
            to="/"
            onClick={() => {
              toggleCreate ? setToggleCreate(false) : setToggleCreate(true);
            }}
          >
            <h3>Discard Post</h3>
          </Link>
        </div>
      ) : (
        <div className="create">
          <Link
            to="/create"
            onClick={() => {
              toggleCreate ? setToggleCreate(false) : setToggleCreate(true);
            }}
          >
            <h3 className="font-effect-anaglyph">Post a New sighting</h3>
          </Link>
        </div>
      )}
      <div>
        <li className="navbar__item">
          <Link
            className="navbar__link"
            to="#"
            onClick={() => {
              localStorage.removeItem("chupacabro_user");
            }}
          >
            <h3 className="font-effect-anaglyph"> Logout </h3>
          </Link>
        </li>
      </div>
    </div>
  );
};
