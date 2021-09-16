import React, { useState } from "react";
import { useHistory } from "react-router";
import ApiManager from "../ApiManager";

export const CreatePost = ({ newPost }) => {
  const [post, updatePost] = useState({
    title: "",
    imageUrl: "",
    text: "",
  });

  const history = useHistory();

  const createPost = (evt) => {
    evt.preventDefault();
    debugger;
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      title: post.title,
      imageUrl: post.imageUrl,
      text: post.text,
      date: Date.now(),
    };

    const fetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    };

    return fetch("http://localhost:8088/posts", fetchOption).then((Response) =>
      Response.json()
    );
  };

  return (
    <form className="createPost">
      <h2 className="createPost__heading">Create a new Post</h2>
      <fieldset>
        <div className="form-group">
          <label htmlFor="title">Add a Title:</label>
          <input
            onChange={(evt) => {
              const copy = { ...post };
              copy.title = evt.target.value;
              updatePost(copy);
            }}
            required
            autoFocus
            type="text"
            className="form-control"
            placeholder="Post Title"
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="imageUrl">Add an Image URL:</label>
          <input
            onChange={(evt) => {
              const copy = { ...post };
              copy.imageUrl = evt.target.value;
              updatePost(copy);
            }}
            required
            autoFocus
            type="text"
            className="form-control"
            placeholder="Image URL"
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="text">Add a Description:</label>
          <input
            onChange={(evt) => {
              const copy = { ...post };
              copy.text = evt.target.value;
              updatePost(copy);
            }}
            required
            autoFocus
            type="text"
            className="form-control"
            placeholder="Brief description of sighting"
          />
        </div>
      </fieldset>
      <button
        className="btn btn-primary"
        onClick={(evt) => {
          createPost(evt);
        }}
      >
        Submit New Post
      </button>
    </form>
  );
};
