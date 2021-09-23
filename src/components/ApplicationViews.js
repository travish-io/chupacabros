import React from "react";
import { Route } from "react-router-dom";
import { PostFeed } from "./feed/PostFeed";
import { CreatePost } from "./feed/CreatePost";
import { UserProfile } from "./friendos/UserProfile";
export const ApplicationViews = () => {
  return (
    <>
      <Route exact path="/create">
        <CreatePost />
      </Route>
      <Route exact path="/users/:userId(\d+)">
        <UserProfile />
      </Route>
      <Route exact path="/">
        <PostFeed />
      </Route>
    </>
  );
};
