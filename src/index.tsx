import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Root from "./views/Root";

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root"),
);
