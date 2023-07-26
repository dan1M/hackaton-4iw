import React, { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Message from "../../components/Message";

const Chat = () => {
  const { supabaseClient } = useSessionContext();

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  const [user, setUser] = useState([]);

  const fetchMessages = async () => {
    const { data: messages, error } = await supabaseClient
      .from("messages")
      .select("*");
    setMessages(messages);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUser(user);

    fetchMessages();

    supabaseClient
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        payload => {
          console.log(payload);
        }
      )
      .subscribe();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const { error } = await supabaseClient
      .from("messages")
      .insert({ content: message, profile_id: user.id });
  };

  const handleChange = event => {
    setMessage(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white shadow rounded-lg">
        <div className="p-4">
          {messages.map(msg => (
            <Message
              key={msg.id}
              content={msg.content}
              sender={msg.profile_id}
            />
          ))}
        </div>

        <div className="border-t border-gray-200 p-4">
          <form className="flex" onSubmit={handleSubmit}>
            <input
              type="text"
              className="flex-1 appearance-none border rounded py-2 px-3 mr-2 focus:outline-none focus:border-blue-500"
              placeholder="Votre message..."
              value={message}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
