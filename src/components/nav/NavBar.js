import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiManager from "../ApiManager";
import "./NavBar.css";
import "../feed/PostFeed.css";
import "../feed/comments.css";

export const NavBar = () => {
  const [toggleDropwDown, setToggleDropDown] = useState(false);
  const [toggleProbes, setToggleProbes] = useState(false);
  const [seen, setSeen] = useState(0);
  const [users, setUsers] = useState([]);
  const [probes, setProbes] = useState([]);

  useEffect(() => {
    ApiManager.fetchUsers().then((data) => {
      setUsers(data);
    });
    ApiManager.fetchProbes().then((data) => {
      setProbes(data);
    });
  }, []);

  // useEffect(() => {
  //   UpdateSeen();
  //   ApiManager.fetchProbes().then((data) => {
  //     setProbes(data);
  //   });
  // }, [seen]);

  const UpdateSeen = (id) => {
    const newData = { seen: true };
    const fetchOption = {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newData),
    };
    return fetch(`http://localhost:8088/probes/${id}`, fetchOption).then(
      (Response) => Response.json()
    );
  };
  return (
    <div className="navbar">
      <div>
        <Link
          to="/"
          onClick={() => {
            setToggleDropDown(false);
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
      <div className="user__dropdown__container">
        <div className="user__button">
          {users.map((user) => {
            if (user.id === parseInt(localStorage.getItem("chupacabro_user"))) {
              return (
                <h2 style={{ margin: "0" }} className="current__user">
                  {" "}
                  u/{user.name}{" "}
                </h2>
              );
            }
          })}

          <button
            className="dropdown__button"
            onClick={() => {
              setToggleDropDown(!toggleDropwDown);
              setToggleProbes(false);
            }}
          >
            <span className="material-icons">arrow_drop_down</span>
          </button>
        </div>
        {toggleDropwDown && !toggleProbes ? (
          <div className="dropdown__menu">
            <ul>
              {users.map((user) => {
                if (
                  user.id === parseInt(localStorage.getItem("chupacabro_user"))
                ) {
                  return (
                    <li className="navbar__item">
                      <Link
                        className="navbar__link"
                        to={`/u/${user.id}`}
                        onClick={() => {
                          setToggleDropDown(!toggleDropwDown);
                          setToggleProbes(false);
                        }}
                      >
                        <img
                          src={user.profileImg}
                          alt=""
                          className="comment__profilePic"
                        />
                        <h3> My Profile </h3>
                      </Link>
                    </li>
                  );
                }
              })}

              <li className="navbar__item">
                <Link
                  className="navbar__link"
                  to="#"
                  onClick={() => {
                    setToggleProbes(!toggleProbes);
                    setToggleDropDown(!toggleDropwDown);
                  }}
                >
                  <h3> Probes </h3>
                </Link>
              </li>

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
            </ul>
          </div>
        ) : toggleProbes && !toggleDropwDown ? (
          <ul className="dropdown__menu">
            <div className="logout">
              <button
                onClick={() => {
                  probes.map((probe) => {
                    if (
                      probe.recipientId ===
                        parseInt(localStorage.getItem("chupacabro_user")) &&
                      probe.seen === false
                    ) {
                      UpdateSeen(probe.id);
                    }
                  });
                  ApiManager.fetchProbes();
                  setProbes();
                  setToggleProbes(!toggleProbes);
                }}
              >
                Clear Probes
              </button>
              {probes.map((probe) => {
                if (
                  probe.recipientId ===
                    parseInt(localStorage.getItem("chupacabro_user")) &&
                  probe.seen === false
                ) {
                  return (
                    <li className="navbar__item">
                      {`You've been probed by u/${probe.user.name}!`}
                    </li>
                  );
                }
              })}
            </div>
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
