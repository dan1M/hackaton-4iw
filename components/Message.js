import React from "react";

const Message = ({ content, sender }) => {
  return (
    <div className="bg-carbon-blue rounded-lg p-3 mb-2">
      <div className="text-sm text-white p-2">
        <strong>{sender}</strong>: {content}
      </div>
    </div>
  );
};

export default Message;
