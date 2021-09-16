import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ApiManager from "../ApiManager";
import "./PostFeed.css";

export const PostFeed = ({ updatedFeed }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);
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
  }, [updatedFeed]);

  return (
    <>
      <div>
        <button
          onClick={() => {
            history.push("/postfeed/create");
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
          </div>
        );
      })}
    </>
  );
};
