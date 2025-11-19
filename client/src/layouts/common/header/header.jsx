
import React from "react";
import Button from "../../components/button/button";
import "./header.css";

const Header = ({ onShowBlogForm, onShowWriterForm }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <h1>📝 Blog Platform</h1>
          <p>Share your stories with the world</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" onClick={onShowWriterForm}>
            👤 Add Writer
          </Button>
          <Button onClick={onShowBlogForm}>✏️ Write Blog</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
