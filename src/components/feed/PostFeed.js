import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ApiManager from "../ApiManager";
import "./PostFeed.css";

export const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [toggleComments, setToggleComments] = useState(false);
  const history = useHistory();

  useEffect(() => {
    ApiManager.fetchUsers().then((data) => {
      setUsers(data);
    });
    ApiManager.fetchPosts().then((data) => {
      setPosts(data);
    });
    ApiManager.fetchComments().then((data) => {
      setComments(data);
    });
    ApiManager.fetchCommentLikes().then((data) => {
      setCommentLikes(data);
    });
    ApiManager.fetchPostLikes().then((data) => {
      setPostLikes(data);
    });
  }, []);

  const createPostLike = (evtObj) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      postId: parseInt(evtObj.target.id),
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
  const createCommentLike = (evtObj) => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      commentId: parseInt(evtObj.target.id),
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

  return (
    <>
      <div>
        <button
          onClick={() => {
            history.push("/create");
          }}
        >
          Create New Post
        </button>
      </div>
      {posts.map((post) => {
        return (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <img className="post__image" src={post.imageUrl} alt="img" />
            <div className="post__tagline">{post.text}</div>
            <div className="post__tagline">
              Posted by <b>{post.user.name}</b>
            </div>
            <div>
              {post.Comments?.length === 1
                ? "1 Comment"
                : `${post.Comments?.length} Comments`}
            </div>
            <div>
              <button
                className="comment__btn"
                id={post.id}
                onClick={() => {
                  toggleComments
                    ? setToggleComments(false)
                    : setToggleComments(true);
                }}
              >
                Comment
              </button>
            </div>
            <div className="post__comment">
              {toggleComments
                ? comments.map((comment) => {
                    if (comment.postId === post.id) {
                      return (
                        <p key={comment.id}>
                          {comment.text} Comment by <b> {comment.user.name}</b>
                          <button
                            id={comment.id}
                            className="comment__like"
                            onClick={(evt) => {
                              let filteredCommentLikes = commentLikes.filter(
                                (commentLike) => {
                                  return (
                                    commentLike.commentId ===
                                    parseInt(evt.target.id)
                                  );
                                }
                              );

                              // let foundCommentLike = {};
                              filteredCommentLikes.find((commentLike) => {
                                return commentLike.userId ===
                                  parseInt(
                                    localStorage.getItem("chupacabro_user")
                                  )
                                  ? ApiManager.deleteCommentLike(
                                      commentLike.id
                                    ).then(() =>
                                      ApiManager.fetchCommentLikes().then(
                                        (data) => {
                                          setCommentLikes(data);
                                        }
                                      )
                                    )
                                  : createCommentLike(evt).then(() =>
                                      ApiManager.fetchCommentLikes().then(
                                        (data) => {
                                          setCommentLikes(data);
                                        }
                                      )
                                    );
                              });

                              // console.log(filteredCommentLikes);
                              // filteredCommentLikes.length !== 0
                              // ? filteredCommentLikes.find((commentLike) => {
                              //     let foundFilteredCommentLike = {}
                              //       if (
                              //         commentLike.userId ===
                              //         parseInt(
                              //           localStorage.getItem("chupacabro_user")
                              //         )
                              //       ) {
                              //         return ApiManager.deleteCommentLike(
                              //           commentLike.id
                              //         ).then(() =>
                              //           ApiManager.fetchCommentLikes().then(
                              //             (data) => {
                              //               setCommentLikes(data);
                              //             }
                              //           )
                              //         );
                              //       } else {
                              //         return createCommentLike(evt).then(() =>
                              //           ApiManager.fetchCommentLikes().then(
                              //             (data) => {
                              //               setCommentLikes(data);
                              //             }
                              //           )
                              //         );
                              //       }
                              //     })
                              //   : createCommentLike(evt).then(() =>
                              //       ApiManager.fetchCommentLikes().then(
                              //         (data) => {
                              //           setCommentLikes(data);
                              //         }
                              //       )
                              //     );
                            }}
                          >
                            Like Comment
                          </button>
                        </p>
                      );
                    }
                  })
                : ""}
            </div>
            <div>
              {post.postLikes?.length === 1
                ? "1 Like"
                : `${post.postLikes?.length} Likes`}{" "}
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
              Like Post
            </button>

            {post.userId ===
            parseInt(localStorage.getItem("chupacabro_user")) ? (
              <div>
                <button
                  onClick={() => {
                    ApiManager.deletePost(post.id).then(() => {
                      ApiManager.fetchPosts().then((data) => {
                        setPosts(data);
                      });
                    });
                  }}
                >
                  Delete Post
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </>
  );
};
