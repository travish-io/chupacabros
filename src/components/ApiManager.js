/* eslint-disable import/no-anonymous-default-export */

export default {
  async fetchPosts() {
    const res = await fetch("http://localhost:8088/posts?_expand=user");
    return await res.json();
  },

  async fetchCommentLikes() {
    const res = await fetch(
      "http://localhost:8088/commentLikes?_sort=commentId"
    );
    return await res.json();
  },
  async fetchPostLikes() {
    const res = await fetch("http://localhost:8088/postLikes?_sort=postId");
    return await res.json();
  },
  async fetchComments() {
    const res = await fetch(
      "http://localhost:8088/comments?_expand=user&_sort=postId"
    );
    return await res.json();
  },
};
