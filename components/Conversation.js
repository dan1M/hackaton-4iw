import React, { useEffect } from "react";

const Conversation = ({ conversation, onClick }) => {
  return (
    <div
      className="bg-gray-100 rounded-lg p-3 w-1/6"
      onClick={() => onClick(conversation)}
    >
      <div className="text-sm text-gray-800 font-semibold text-center flex items-center h-full">
        <p className="m-auto">{conversation.name}</p>
      </div>
    </div>
  );
};

export default Conversation;
