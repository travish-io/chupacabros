/* eslint-disable import/no-anonymous-default-export */

export default {
  async fetchPosts() {
    const res = await fetch(
      "http://localhost:8088/posts?_expand=user&_sort=date&_order=desc&_embed=postLikes&_embed=comments"
    );
    return await res.json();
  },
  async fetchPostsByUser(id) {
    const res = await fetch(
      `http://localhost:8088/posts?userId=${id}&_expand=user&_sort=date&_order=desc&_embed=postLikes&_embed=comments`
    );
    return await res.json();
  },
  async fetchUserPosts(id) {
    const res = await fetch(
      `http://localhost:8088/users/${id}?_embed=posts&_embed=postLikes&_embed=comments&_embed=commentLikes&_embed=follows`
    );
    return await res.json();
  },
  async fetchUsers() {
    const res = await fetch(
      "http://localhost:8088/users?_embed=commentLikes&_embed=probes"
    );
    return await res.json();
  },
  async fetchProbes() {
    const res = await fetch("http://localhost:8088/probes?_expand=user");
    return await res.json();
  },
  async fetchFollows() {
    const res = await fetch("http://localhost:8088/follows");
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
      "http://localhost:8088/comments?_expand=user&_sort=postId&_embed=commentLikes"
    );
    return await res.json();
  },
  async deletePost(id) {
    const e = await fetch(`http://localhost:8088/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("chupacabro_user")}`,
      },
    });
    return await e.json();
  },
  async deletePostLike(id) {
    const e = await fetch(`http://localhost:8088/postLikes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("chupacabro_user")}`,
      },
    });
    return await e.json();
  },
  async deleteCommentLike(id) {
    const e = await fetch(`http://localhost:8088/commentLikes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("chupacabro_user")}`,
      },
    });
    return await e.json();
  },
  async deleteFollow(id) {
    const e = await fetch(`http://localhost:8088/follows/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("chupacabro_user")}`,
      },
    });
    return await e.json();
  },
};
