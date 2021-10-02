import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiManager from "../ApiManager";
import "./NavBar.css";

export const NavBar = () => {
  const [toggleCreate, setToggleCreate] = useState(false);
  const [toggleDropwDown, setToggleDropDown] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    ApiManager.fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div className="navbar">
      <div className="navbar__item">
        <Link
          to="/"
          onClick={() => {
            setToggleCreate(false);
          }}
        >
          <img
            src={require("./Chupacabros-logos_black_smaller.png").default}
            alt="Home"
            height="66px"
            width="226px"
          />
        </Link>
      </div>
      <div>
        {users.map((user) => {
          if (user.id === parseInt(localStorage.getItem("chupacabro_user"))) {
            return <div>{user.name}</div>;
          }
        })}
      </div>
      {toggleCreate ? (
        <div className="font-effect-anaglyph">
          <Link
            className="discard"
            to="/"
            onClick={() => {
              toggleCreate ? setToggleCreate(false) : setToggleCreate(true);
            }}
          >
            <h3 className="discard">Discard Sighting</h3>
          </Link>
        </div>
      ) : (
        <div className="create">
          <Link
            className="navbar__link"
            to="/create"
            onClick={() => {
              toggleCreate ? setToggleCreate(false) : setToggleCreate(true);
            }}
          >
            <h3>Post Your Sighting</h3>
          </Link>
        </div>
      )}
      <div className="logout">
        <li className="navbar__item">
          <Link
            className="navbar__link"
            to="#"
            onClick={() => {
              localStorage.removeItem("chupacabro_user");
            }}
          >
            <h3> Logout </h3>
          </Link>
        </li>
      </div>
      <div>
        <img
          src={require("./probe_icon.png").default}
          alt="Home"
          height="66px"
          width="66px"
        />
      </div>
      <div className="dropdown__container">
        <button
          onClick={() => {
            setToggleDropDown(!toggleDropwDown);
          }}
        >
          <span class="material-icons">arrow_drop_down</span>
        </button>
        {toggleDropwDown ? (
          <ul className="dropdown__menu">
            <li>My Profile</li>
            <div className="logout">
              <li className="navbar__item">
                <Link
                  className="navbar__link"
                  to="#"
                  onClick={() => {
                    localStorage.removeItem("chupacabro_user");
                  }}
                >
                  <h3> Logout </h3>
                </Link>
              </li>
            </div>
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
