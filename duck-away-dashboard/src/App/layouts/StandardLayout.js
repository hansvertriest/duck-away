import React from "react";

export const StandardLayout = ({children}) => {
  return (
    <div className="dashboard">
      <div className="dashboard__border"></div>
      <div className="dashboard__content">
        {children}
      </div>
    </div>
  );
};
