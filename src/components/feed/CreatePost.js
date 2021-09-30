import React, { useState } from "react";
import { useHistory } from "react-router";
export const CreatePost = () => {
  const [post, updatePost] = useState({
    title: "",
    imageUrl: "",
    text: "",
    legitness: 0,
  });
  const [legitness, setLegitness] = useState(0);
  const history = useHistory();

  const handleSlider = (evt) => {
    setLegitness(evt.target.value);
    console.log(legitness);
  };

  const createPost = () => {
    const newData = {
      userId: parseInt(localStorage.getItem("chupacabro_user")),
      title: post.title,
      imageUrl: post.imageUrl,
      text: post.text,
      date: Date.now(),
      legitness: parseInt(legitness),
      location: "",
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
            autoFocus
            type="text"
            className="form-control"
            placeholder="Brief description of sighting"
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="legit__container">
          <label htmlFor="range">How Legit is this Sighting?</label>
          <input
            className="legit__slider"
            id="legitness"
            type="range"
            min="0"
            max="100"
            value={legitness}
            onChange={handleSlider}
            step="5"
          />
          {legitness}%
        </div>
      </fieldset>
      <button
        className="btn btn-primary"
        onClick={() => {
          post.title && post.imageUrl !== ""
            ? createPost().then(history.push("/"))
            : window.alert("Fill out all required fields");
        }}
      >
        Submit New Post
      </button>
    </form>
  );
};
