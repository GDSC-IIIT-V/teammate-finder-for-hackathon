import React from "react";
import "./loader.styles.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__container__spinner"></div>
      <p className="loader__text">Please wait while we fetch data</p>
    </div>
  );
};

export default Loader;
