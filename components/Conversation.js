import React, { useEffect } from "react";

const Conversation = ({ conversation, onClick }) => {
  return (
    <div
      className="bg-carbon-blue rounded-lg p-3"
      onClick={() => onClick(conversation)}
    >
      <div className="text-sm text-white font-semibold text-center flex items-center h-full">
        <p className="m-auto">{conversation.name}</p>
      </div>
    </div>
  );
};

export default Conversation;
