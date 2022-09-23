import React from "react";

const SidebarBtn = ({ Icon, text, className }) => {
  return (
    <button className={`${className} sidebar-btn`}>
      <Icon className="h-5 w-5" />
      <p>{text}</p>
    </button>
  );
};

export default SidebarBtn;
