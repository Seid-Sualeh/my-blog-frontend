import React from "react";
import Card from "../../../components/card/card";
import Button from "../../../components/button/button";
import { formatRelativeTime } from "../../../utils/helpers";
import "./writer-list.css";

const WriterList = ({ writers, onEditWriter, onDeleteWriter, isLoading }) => {
  if (isLoading) {
    return (
      <div className="writer-list-loading">
        <p>Loading writers...</p>
      </div>
    );
  }

  if (!writers || writers.length === 0) {
    return (
      <Card className="writer-list-empty">
        <div className="empty-state">
          <h3>No writers yet</h3>
          <p>Add the first writer to get started!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="writer-list">
      {writers.map((writer) => (
        <Card key={writer._id} className="writer-card" hover={true}>
          <div className="writer-header">
            <div className="writer-avatar">
              {writer.profileImage ? (
                <img src={writer.profileImage} alt={writer.name} />
              ) : (
                <div className="avatar-placeholder">
                  {writer.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="writer-info">
              <h3 className="writer-name">{writer.name}</h3>
              <p className="writer-email">{writer.email}</p>
              {writer.blogCount > 0 && (
                <p className="writer-blog-count">
                  {writer.blogCount} blog{writer.blogCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="writer-status">
              {writer.isActive ? (
                <span className="status-active">Active</span>
              ) : (
                <span className="status-inactive">Inactive</span>
              )}
            </div>
          </div>

          {writer.bio && <p className="writer-bio">{writer.bio}</p>}

          {writer.socialLinks && (
            <div className="writer-social-links">
              {writer.socialLinks.website && (
                <a
                  href={writer.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐 Website
                </a>
              )}
              {writer.socialLinks.twitter && (
                <a
                  href={writer.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🐦 Twitter
                </a>
              )}
              {writer.socialLinks.linkedin && (
                <a
                  href={writer.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💼 LinkedIn
                </a>
              )}
            </div>
          )}

          <div className="writer-meta">
            <span>Joined {formatRelativeTime(writer.createdAt)}</span>
          </div>

          <div className="writer-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => onEditWriter(writer)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => onDeleteWriter(writer._id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WriterList;
