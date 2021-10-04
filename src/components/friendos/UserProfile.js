import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiManager from "../ApiManager";
import { SRLWrapper } from "simple-react-lightbox";
import "../feed/PostFeed.css";
import "../feed/comments.css";

export const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [follows, setFollows] = useState([]);
  const [newComment, updateComment] = useState({
    text: "",
  });
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);
  const [user, setUsers] = useState({});
  const [toggleComments, setToggleComments] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    ApiManager.fetchUserPosts(userId).then((data) => {
      setUsers(data);
    });
    ApiManager.fetchPostsByUser(userId).then((data) => {
      setPosts(data);
    });
    ApiManager.fetchFollows().then((data) => {
      setFollows(data);
    });
    fetchComments();
    ApiManager.fetchPostLikes().then((data) => {
      setPostLikes(data);
    });
  }, []);

  const createProbe = (evt) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      recipientId: parseInt(evt.target.id),
      seen: false,
    };

    const fetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    };
    return fetch("http://localhost:8088/probes", fetchOption)
      .then((Response) => Response.json())
      .then(() => ApiManager.fetchProbes());
  };
  const fetchComments = () => {
    ApiManager.fetchComments().then((data) => {
      setComments(data);
    });
    ApiManager.fetchCommentLikes().then((data) => {
      setCommentLikes(data);
    });
  };

  const userProfileFollowers = follows.filter((follow) => {
    return follow.followingId === user.id;
  });
  const currentUserFollows = follows.filter((follow) => {
    return parseInt(localStorage.getItem("chupacabro_user")) === follow.userId;
  });
  const createFollow = (evt) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      followingId: parseInt(evt.target.id),
    };

    const fetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    };
    return fetch("http://localhost:8088/follows", fetchOption)
      .then((Response) => Response.json())
      .then(() => ApiManager.fetchFollows());
  };
  const createPostLike = (evt) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      postId: parseInt(evt.target.id),
    };

    const fetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    };

    return fetch("http://localhost:8088/postLikes", fetchOption)
      .then((Response) => Response.json())
      .then(() => ApiManager.fetchPostLikes());
  };
  const createCommentLike = (evt) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      commentId: parseInt(evt.target.id),
    };

    const fetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    };

    return fetch("http://localhost:8088/commentLikes", fetchOption)
      .then((Response) => Response.json())
      .then(() => ApiManager.fetchCommentLikes());
  };
  const createComment = (evt) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      postId: parseInt(evt.target.id),
      text: newComment.text,
    };

    const fetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    };

    return fetch("http://localhost:8088/comments", fetchOption)
      .then((Response) => Response.json())
      .then(() => ApiManager.fetchComments());
  };

  return (
    <SRLWrapper>
      <>
        <div className="user__Profile">
          <img src={user.profileImg} alt="" className="user__profilePic" />
          <h1 className="font-effect-anaglyph">u/{user.name} </h1>
        </div>
        <div className="profile__buttons">
          <div className="profile__follow">
            {user.id === parseInt(localStorage.getItem("chupacabro_user")) ? (
              ""
            ) : user.id !== parseInt(localStorage.getItem("chupacabro_user")) &&
              currentUserFollows.every((follow) => {
                return follow.followingId !== user.id;
              }) ? (
              <button
                id={user.id}
                className="follow__button"
                onClick={(evt) => {
                  createFollow(evt).then(() =>
                    ApiManager.fetchFollows().then((data) => {
                      setFollows(data);
                    })
                  );
                }}
              >
                <span className="material-icons" id={user.id}>
                  add
                </span>{" "}
                Follow
              </button>
            ) : (
              <button
                id={user.id}
                className="following__button"
                onClick={() => {
                  const foundFollow = currentUserFollows.find((follow) => {
                    return follow.followingId === user.id;
                  });

                  ApiManager.deleteFollow(foundFollow.id).then(() =>
                    ApiManager.fetchFollows().then((data) => {
                      setFollows(data);
                    })
                  );
                }}
              >
                <span className="material-icons" id={user.id}>
                  done
                </span>{" "}
                Following
              </button>
            )}
          </div>
          <div className="profile__stats">
            {userProfileFollowers.length} followers &#183; following{" "}
            {user?.follows?.length}
          </div>
          {user.id === parseInt(localStorage.getItem("chupacabro_user")) ? (
            ""
          ) : (
            <button
              id={user.id}
              className="probe__button"
              onClick={(evt) => {
                createProbe(evt);
              }}
            >
              Probe!
            </button>
          )}
        </div>
        <div className="postFeed__container">
          {posts.map((post) => {
            const postDate = new Date(post.date);
            // const newDate = postDate.toDateString();
            // const newTime = postDate.toTimeString();
            function timeSince(date) {
              var seconds = Math.floor((new Date() - date) / 1000);

              var interval = seconds / 31536000;

              if (interval > 1) {
                return Math.floor(interval) + " years";
              }
              interval = seconds / 2592000;
              if (interval > 1) {
                return Math.floor(interval) + " months";
              }
              interval = seconds / 86400;
              if (interval > 1) {
                return Math.floor(interval) + " days";
              }
              interval = seconds / 3600;
              if (interval > 1) {
                return Math.floor(interval) + " hours";
              }
              interval = seconds / 60;
              if (interval > 1) {
                return Math.floor(interval) + " minutes";
              }
              return Math.floor(seconds) + " seconds";
            }
            // var aDay = 24 * 60 * 60 * 1000;
            return (
              <div className="post__container" key={post.id}>
                <div className="post__header">
                  <h5 className="font-effect-anaglyph">
                    c/chupacabros &#183; Posted by u/{post.user.name} &#183;{" "}
                    <small> {timeSince(postDate)} ago </small>
                  </h5>

                  <h5>{post.title}</h5>
                </div>
                <img
                  className="post__image"
                  src={post.imageUrl}
                  alt={`u/${post.user.name} · ${post.title}`}
                />
                <div className="post__tagline">{post.text}</div>
                <div className="post__cl__container">
                  <div>
                    <button
                      className="comment__btn"
                      id={post.id}
                      onClick={(evt) => {
                        toggleComments
                          ? setToggleComments(false)
                          : setToggleComments(true);
                      }}
                    >
                      <span className="material-icons" id={post.id}>
                        chat_bubble_outline
                      </span>
                      {post.comments?.length === 1
                        ? "1 Comment"
                        : `${post.comments?.length} Comments`}
                    </button>
                  </div>
                  <button
                    id={post.id}
                    className="post__likes"
                    onClick={(evt) => {
                      const foundPostLike = post.postLikes?.find((postLike) => {
                        return (
                          postLike.userId ===
                          parseInt(localStorage.getItem("chupacabro_user"))
                        );
                      });

                      return foundPostLike
                        ? ApiManager.deletePostLike(foundPostLike.id).then(() =>
                            ApiManager.fetchPostsByUser(userId).then((data) => {
                              setPosts(data);
                            })
                          )
                        : createPostLike(evt).then(() =>
                            ApiManager.fetchPostsByUser(userId).then((data) => {
                              setPosts(data);
                            })
                          );
                    }}
                  >
                    <span className="material-icons" id={post.id}>
                      thumb_up
                    </span>
                    {post.postLikes?.length === 1
                      ? "1 Like"
                      : `${post.postLikes?.length} Likes`}
                  </button>
                  {post.userId ===
                  parseInt(localStorage.getItem("chupacabro_user")) ? (
                    <button
                      onClick={() => {
                        ApiManager.deletePost(post.id).then(() => {
                          ApiManager.fetchPostsByUser(post.userId).then(
                            (data) => {
                              setPosts(data);
                            }
                          );
                        });
                      }}
                    >
                      <span className="material-icons" id={post.id}>
                        delete
                      </span>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="post__comment">
                  {toggleComments ? (
                    <div>
                      <textarea
                        className="comment__textarea"
                        id={post.id}
                        rows="6"
                        value={newComment.text}
                        placeholder="Add a new comment..."
                        onChange={(evt) => {
                          const copy = { ...newComment };
                          copy.text = evt.target.value;
                          updateComment(copy);
                        }}
                      ></textarea>
                      <div>
                        <button
                          id={post.id}
                          className="new__comment"
                          onClick={(evt) => {
                            createComment(evt)
                              .then(() => {
                                fetchComments();
                              })
                              .then(() => {
                                updateComment({ text: "" });
                              });
                          }}
                        >
                          Submit new comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {toggleComments
                    ? comments.map((comment) => {
                        const foundCommentLike = comment.commentLikes?.find(
                          (commentLike) => {
                            return (
                              commentLike.userId ===
                                parseInt(
                                  localStorage.getItem("chupacabro_user")
                                ) && commentLike.commentId === comment.id
                            );
                          }
                        );

                        if (comment.postId === post.id) {
                          return (
                            <p key={comment.id} className="comments">
                              <b>
                                <img
                                  src={comment.user.profileImg}
                                  className="comment__profilePic"
                                  alt=""
                                />
                                u/{comment.user.name}
                              </b>{" "}
                              <br></br>
                              {comment.text}
                              {foundCommentLike ? (
                                <div>
                                  <button
                                    id={comment.id}
                                    className="comment__unlike"
                                    onClick={() => {
                                      ApiManager.deleteCommentLike(
                                        foundCommentLike.id
                                      ).then(() => {
                                        fetchComments();
                                      });
                                    }}
                                  >
                                    <span
                                      className="material-icons"
                                      id={comment.id}
                                    >
                                      thumb_up
                                    </span>
                                    {comment.commentLikes?.length}
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <button
                                    id={comment.id}
                                    className="comment__like"
                                    onClick={(evt) => {
                                      createCommentLike(evt).then(() => {
                                        fetchComments();
                                      });
                                    }}
                                  >
                                    <span
                                      className="material-icons"
                                      id={comment.id}
                                    >
                                      thumb_up
                                    </span>
                                    {comment.commentLikes?.length}
                                  </button>
                                </div>
                              )}
                            </p>
                          );
                        }
                      })
                    : ""}
                </div>
              </div>
            );
          })}
        </div>
      </>
    </SRLWrapper>
  );
};
