import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ApiManager from "../ApiManager";
import "./PostFeed.css";

export const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const history = useHistory();

  useEffect(() => {
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

  // {postLike.userId && postLike.postId? deletePostLike() : createPostLike()}

  const handleCheckbox = (evtObj) => {
    evtObj.preventDefault();
    console.log(evtObj.target.id);
    setIsChecked(!isChecked);
    createPostLike(evtObj);
  };

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
          <div className="post">
            <h3>{post.title}</h3>
            <img className="post__image" src={post.imageUrl} alt="img" />
            <div className="post__tagline">{post.text}</div>
            <div className="post__tagline">
              Posted by <b>{post.user.name}</b>
            </div>
            <div className="post__comment">
              {comments.map((comment) => {
                if (comment.postId === post.id) {
                  return (
                    <p>
                      {comment.text} Comment by <b> {comment.user.name}</b>
                    </p>
                  );
                }
              })}
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
              /* ? ApiManager.deletePostLike(postLike.id) : createPostLike(evt) */
            >
              Like Post
            </button>
            {/* <div className="post__likes">
              <input
                type="checkbox"
                id={post.id}
                name="postLikes"
                value="Like Post"
                checked={isChecked}
                onChange={(evt) => handleCheckbox(evt)}
              />
              Like this Post
            </div> */}
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
