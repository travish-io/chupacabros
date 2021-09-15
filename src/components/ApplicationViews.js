import React from "react";
import { Route } from "react-router-dom";
import { PostFeed } from "./feed/PostFeed";

export const ApplicationViews = () => {
  return (
    <>
      <Route path="/postfeed">
        <PostFeed />
      </Route>
    </>
  );
};
