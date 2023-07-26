import React from "react";

const Message = ({ content, sender }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3">
      <div className="text-sm text-gray-600">
        <strong>{sender}</strong>: {content}
      </div>
    </div>
  );
};

export default Message;
