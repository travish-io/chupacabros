import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiManager from "../ApiManager";
import { SRLWrapper } from "simple-react-lightbox";
import "./PostFeed.css";
import "./comments.css";

export const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, updateComment] = useState({
    text: "",
  });
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [toggleComments, setToggleComments] = useState(false);

  useEffect(() => {
    ApiManager.fetchUsers().then((data) => {
      setUsers(data);
    });
    ApiManager.fetchPosts().then((data) => {
      setPosts(data);
    });
    fetchComments();
    ApiManager.fetchPostLikes().then((data) => {
      setPostLikes(data);
    });
    ApiManager.fetchFollows().then((data) => {
      setFollows(data);
    });
  }, []);

  const fetchComments = () => {
    ApiManager.fetchComments().then((data) => {
      setComments(data);
    });
    ApiManager.fetchCommentLikes().then((data) => {
      setCommentLikes(data);
    });
  };

  let currentUserFollows = follows.filter((follow) => {
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
        <div className="create">
          <Link className="navbar__link" to="/create">
            <h3 className="font-effect-anaglyph">Post Your Sighting</h3>
          </Link>
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
                  <div className="post__heading">
                    <h5 className="font-effect-anaglyph">
                      c/chupacabros &#183; Posted by{" "}
                      <Link to={`/u/${post.user.id}`}>u/{post.user.name} </Link>
                      &#183; <small> {timeSince(postDate)} ago </small>
                    </h5>
                    {post.user.id ===
                    parseInt(localStorage.getItem("chupacabro_user")) ? (
                      ""
                    ) : post.user.id !==
                        parseInt(localStorage.getItem("chupacabro_user")) &&
                      currentUserFollows.every((follow) => {
                        return follow.followingId !== post.user.id;
                      }) ? (
                      <button
                        id={post.user.id}
                        className="post__follow__button"
                        onClick={(evt) => {
                          createFollow(evt).then(() =>
                            ApiManager.fetchFollows().then((data) => {
                              setFollows(data);
                            })
                          );
                        }}
                      >
                        <span className="material-icons" id={post.user.id}>
                          add
                        </span>{" "}
                        Follow
                      </button>
                    ) : (
                      <small>
                        <button
                          id={post.user.id}
                          className="post__following__button"
                          onClick={() => {
                            const foundFollow = currentUserFollows.find(
                              (follow) => {
                                return follow.followingId === post.user.id;
                              }
                            );

                            ApiManager.deleteFollow(foundFollow.id).then(() =>
                              ApiManager.fetchFollows().then((data) => {
                                setFollows(data);
                              })
                            );
                          }}
                        >
                          <span className="material-icons">done</span> Following
                        </button>
                      </small>
                    )}
                  </div>
                  {post.legitness >= 50 ? (
                    <div className="legit-o-container">
                      <h6 className="font-effect-anaglyph">Legit-O-Meter:</h6>
                      {post.legitness}%
                    </div>
                  ) : (
                    ""
                  )}
                  <h4>{post.title}</h4>
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
                      <span className="material-icons">
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
                            ApiManager.fetchPosts().then((data) => {
                              setPosts(data);
                            })
                          )
                        : createPostLike(evt).then(() =>
                            ApiManager.fetchPosts().then((data) => {
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
                          ApiManager.fetchPosts().then((data) => {
                            setPosts(data);
                          });
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
                            createComment(evt).then(() => {
                              fetchComments();
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
                            <div className="comments">
                              <p>
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
                              </p>
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
                            </div>
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
