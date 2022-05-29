import React from "react";
import ReactDom from "react-dom";
import Home from "./components/Home";

import "./styles/globals.scss";

const wrapper = document.createElement("div");
document.body.appendChild(wrapper);

ReactDom.render(<Home />, wrapper);
