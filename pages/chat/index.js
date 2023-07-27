import React, { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Message from "../../components/Message";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Conversation from "@/components/Conversation";
import Lottie from "lottie-react";

import json from "../../public/animations/animation.json";
import confetti from "../../public/animations/confetti.json";

const Chat = () => {
  const { supabaseClient } = useSessionContext();

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [name, setName] = useState([]);

  const [displayModalQuestSuccess, setDisplayModalQuestSuccess] =
    useState(false);

  const [conversationId, setConversationId] = useState(null);

  const [newConversationuser, setNewConversationUser] = useState();

  const [user, setUser] = useState([]);

  const fetchMessages = async (id = 0) => {
    console.log("CONV ID : ", conversationId);

    if (id !== 0) {
      const { data: messages, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("conversation_id", id);
      setMessages(messages);
    } else {
      if (conversationId === null) {
        const { data: messages, error } = await supabaseClient
          .from("messages")
          .select("*")
          .filter("conversation_id", "is", null);
        setMessages(messages);
      } else {
        const { data: messages, error } = await supabaseClient
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId);
        setMessages(messages);
      }
    }
  };

  const fetchUsers = async () => {
    const { data: users, error } = await supabaseClient
      .from("profiles")
      .select("*");
    setUsers(users);
  };

  const fetchConversations = async () => {
    const { data, error } = await supabaseClient
      .from("private_conversations")
      .select("*")
      .or(`profile_id_creator.eq.${user.id},profile_id_receiver.eq.${user.id}`);

    console.log(data);
    setConversations(data);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUser(user);

    fetchMessages();

    fetchUsers();

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
          console.log(payload.new.conversation_id);
          console.log(conversationId);
          if (payload.new.conversation_id === null) {
            fetchMessages();
          } else {
            fetchMessages(payload.new.conversation_id);
          }
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    if (user.id) {
      console.log("USER : ", user);

      fetchConversations();
    }
  }, [user.id]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const handleSubmit = async e => {
    e.preventDefault();

    const { data: profilequests } = await supabaseClient
      .from("profilesquests")
      .select("*")
      .match({ profile_id: user.id, type: "talk" });

    console.log("PROFILE QUEST : ", profilequests);
    profilequests.map(async profilequest => {
      const { data: quest } = await supabaseClient
        .from("quests")
        .select("*")
        .match({ id: profilequest.quest_id });

      console.log("QUEST : ", quest[0]);

      if (quest[0].number_to_do === profilequest.values.length + 1) {
        const { error } = await supabaseClient
          .from("profilesquests")
          .update({
            values: [...profilequest.values, message],
          })
          .eq("id", profilequest.id);
        setDisplayModalQuestSuccess(true);
        console.log("FINISHED");
      } else {
        const { error } = await supabaseClient
          .from("profilesquests")
          .update({
            values: [...profilequest.values, message],
          })
          .eq("id", profilequest.id);
        console.log("NOT FINISHED");
      }
    });
    if (conversationId === null) {
      const { error } = await supabaseClient.from("messages").insert({
        content: message,
        profile_id: user.id,
        username: user.username,
        fullname: user.full_name,
      });
    } else {
      const { error } = await supabaseClient.from("messages").insert({
        content: message,
        profile_id: user.id,
        username: user.username,
        fullname: user.full_name,
        conversation_id: conversationId,
      });
    }
  };

  const handleChange = event => {
    setMessage(event.target.value);
  };

  const handleSelectChange = event => {
    console.log(event.target.value);
    setNewConversationUser(event.target.value);
  };

  const handleNameChange = event => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConversationClick = conversation => {
    console.log("Conversation cliquée :", conversation);
    setConversationId(conversation.id);
  };

  const handleCreateNewConversation = async e => {
    e.preventDefault();
    console.log(newConversationuser);
    const { error } = await supabaseClient
      .from("private_conversations")
      .insert({
        profile_id_creator: user.id,
        profile_id_receiver: newConversationuser,
        name: name,
      });
    handleCloseModal();
    fetchConversations();
  };

  const customStylesQuestModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "8px",
      padding: "20px",
      border: "none",
      maxWidth: "550px",
      backgroundColor: "#282B2A",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
    },
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "8px",
      padding: "20px",
      border: "none",
      maxWidth: "400px",
      backgroundColor: "#282B2A",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
    },
  };

  return (
    <div className="container mx-auto p-4 flex">
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        styles={customStyles}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCloseModal}
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Nouvelle discussion
              </h3>
              <form
                className="space-y-6"
                onSubmit={handleCreateNewConversation}
              >
                {
                  <div>
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nom de la personne
                      </label>
                      <select
                        onChange={handleSelectChange}
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.full_name}
                          </option>
                        ))}
                      </select>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nom
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Nomm"
                        value={name}
                        onChange={handleNameChange}
                        required
                      />
                    </div>
                  </div>
                }

                <Button text="Démarrer la discussion" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        isOpen={displayModalQuestSuccess}
        onRequestClose={() => setDisplayModalQuestSuccess(false)}
        styles={customStylesQuestModal}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setDisplayModalQuestSuccess(false)}
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Félicitations vous avez terminé une quête !
              </h3>
              <Button
                text="Fermer"
                onClick={() => setDisplayModalQuestSuccess(false)}
              />
            </div>
          </div>
          <Lottie
            animationData={confetti}
            style={{ width: "auto", height: "200px" }}
          />
        </div>
      </CustomModal>
      <div className="flex flex-col space-y-4">
        <Button
          text="Nouvelle discussion"
          type="submit"
          onClick={handleOpenModal}
        />
        <h1 className="text-2xl font-bold text-white">Conversations</h1>
        <div className="flex flex-col space-y-2">
          <div
            className="bg-carbon-blue rounded-lg p-3"
            onClick={() => {
              setConversationId(null);
            }}
          >
            <div className="text-sm text-white dark:bg-blue-carbon font-semibold text-center flex items-center h-full">
              <p className="m-auto">Entreprise</p>
            </div>
          </div>

          {conversations &&
            conversations.map(conversation => (
              <Conversation
                key={conversation.id}
                conversation={conversation}
                onClick={handleConversationClick}
              />
            ))}
        </div>
      </div>
      <div className="max-w-lg ml-36 mt-24 bg-primary shadow rounded-lg">
        <div className="p-4 max-h-96 overflow-y-auto">
          {messages &&
            messages.map(msg => (
              <Message
                key={msg.id}
                content={msg.content}
                sender={msg.fullname}
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
