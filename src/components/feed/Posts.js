import React, { useState } from "react";
import { CreatePost } from "./CreatePost";
import { PostFeed } from "./PostFeed";

export const Posts = () => {
  const [postState, updatePostState] = useState({});
  console.log(postState);
  return (
    <>
      <CreatePost newPost={updatePostState} />
      <PostFeed updatedFeed={postState} />
    </>
  );
};
