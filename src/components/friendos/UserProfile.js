import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiManager from "../ApiManager";
import "../feed/PostFeed.css";
import "../feed/comments.css";

export const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
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
    <>
      <div className="user__Profile">
        <h1 className="font-effect-anaglyph">u/{user.name} </h1>
      </div>
      <div className="postFeed__container">
        {posts.map((post) => {
          const postDate = new Date(post.date);
          const newDate = postDate.toDateString();
          const newTime = postDate.toTimeString();

          return (
            <div className="post__container" key={post.id}>
              <div className="post__header">
                <h5 className="font-effect-anaglyph">
                  c/chupacabros &#183; Posted by u/{post.user.name}
                </h5>
                <h6 className="font-effect-anaglyph">
                  {newDate} {newTime}
                </h6>
                <h5>{post.title}</h5>
              </div>
              <img className="post__image" src={post.imageUrl} alt="img" />
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
                    <span className="material-icons">chat_bubble_outline</span>
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
                  <span class="material-icons">thumb_up</span>
                  {post.postLikes?.length === 1
                    ? "1 Like"
                    : `${post.postLikes?.length} Likes`}
                </button>
                {post.userId ===
                parseInt(localStorage.getItem("chupacabro_user")) ? (
                  <div>
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
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="post__comment">
                {toggleComments ? (
                  <div>
                    <textarea
                      id={post.id}
                      rows="6"
                      onChange={(evt) => {
                        const copy = { ...newComment };
                        copy.text = evt.target.value;
                        updateComment(copy);
                      }}
                    >
                      Add a new comment...
                    </textarea>
                    <div>
                      <button
                        id={post.id}
                        className="new__comment"
                        onClick={(evt) => {
                          createComment(evt).then(() => {
                            fetchComments();
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
                            parseInt(localStorage.getItem("chupacabro_user"))
                          );
                        }
                      );

                      if (comment.postId === post.id) {
                        return (
                          <p key={comment.id} className="comments">
                            <b> u/{comment.user.name}</b> <br></br>
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
                                  unlike comment
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
                                  like comment
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
  );
};