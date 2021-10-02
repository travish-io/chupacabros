import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Chupacabros } from "./components/Chupacabros";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SimpleReactLightbox>
        <Chupacabros />
      </SimpleReactLightbox>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
