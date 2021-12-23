import React from "react";

export default function ({ type }) {
  if (type === "table") {
    return <tbody className="spinner-border text-light text-center"></tbody>;
  } else if (type === "div-dark") {
    return <div className="spinner-border text-light text-center"></div>;
  } else {
    return <div className="spinner-border text-dark text-center"></div>;
  }
}
