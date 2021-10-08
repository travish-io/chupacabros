import React from "react";
import { Route } from "react-router-dom";
import { PostFeed } from "./feed/PostFeed";
import { CreatePost } from "./feed/CreatePost";
import { UserProfile } from "./friendos/UserProfile";
import { Categories } from "./feed/Categories";
export const ApplicationViews = () => {
  return (
    <>
      <Route exact path="/create">
        <CreatePost />
      </Route>
      <Route exact path="/u/:userId(\d+)">
        <UserProfile />
      </Route>
      <Route exact path="/">
        <PostFeed />
      </Route>
      <Route exact path="/c/:category">
        <Categories />
      </Route>
    </>
  );
};
