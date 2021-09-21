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
    fetchComments();
    ApiManager.fetchPostLikes().then((data) => {
      setPostLikes(data);
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
                onClick={(evt) => {
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
                    const foundCommentLike = comment.commentLikes?.find(
                      (commentLike) => {
                        return (
                          commentLike.userId ===
                          parseInt(localStorage.getItem("chupacabro_user"))
                        );
                      }
                    );
                    if (comment.postId === post.id) {
                      return (
                        <p key={comment.id}>
                          {comment.text} Comment by <b> {comment.user.name}</b>
                          {foundCommentLike ? (
                            <button
                              id={comment.id}
                              className="comment__like"
                              onClick={() => {
                                ApiManager.deleteCommentLike(
                                  foundCommentLike.id
                                ).then(() => {
                                  fetchComments();
                                });
                              }}
                            >
                              unlike comment
                            </button>
                          ) : (
                            <button
                              id={comment.id}
                              className="comment__like"
                              onClick={(evt) => {
                                createCommentLike(evt).then(() => {
                                  fetchComments();
                                });
                              }}
                            >
                              like comment
                            </button>
                          )}
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
