import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./PostFeed.css";

export const PostFeed = (post) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchPosts();
    fetchComments();
    fetchCommentLikes();
    fetchPostLikes();
  }, []);

  const fetchPosts = () => {
    return fetch("http://localhost:8088/posts?_expand=user")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  };
  const fetchCommentLikes = () => {
    return fetch("http://localhost:8088/commentLikes?_sort=commentId")
      .then((res) => res.json())
      .then((data) => {
        setCommentLikes(data);
      });
  };
  const fetchPostLikes = () => {
    return fetch("http://localhost:8088/postLikes?_sort=postId")
      .then((res) => res.json())
      .then((data) => {
        setPostLikes(data);
      });
  };
  const fetchComments = () => {
    return fetch("http://localhost:8088/comments?_expand=user&_sort=postId")
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      });
  };
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
            <div class="post__tagline">{post.text}</div>
            <div class="post__tagline">
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
