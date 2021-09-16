import React from "react";
import { Route } from "react-router-dom";
import { PostFeed } from "./feed/PostFeed";
import { CreatePost } from "./feed/CreatePost";
export const ApplicationViews = () => {
  return (
    <>
      <Route exact path="/postfeed/create">
        <CreatePost />
      </Route>
      <Route path="/postfeed">
        <PostFeed />
      </Route>
    </>
  );
};
