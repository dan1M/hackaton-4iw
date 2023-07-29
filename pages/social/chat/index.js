import React, { useEffect, useState, useContext } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Message from "../../../components/Message";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Conversation from "@/components/Conversation";
import { useRouter } from "next/router";
import Lottie from "lottie-react";

import confetti from "../../../public/animations/confetti.json";
import { AppContext } from "@/pages/_app";

const Chat = () => {
  const { currentUser, updateCurrentUser } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();
  const router = useRouter();

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

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, []);

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
      .or(
        `profile_id_creator.eq.${currentUser.id},profile_id_receiver.eq.${currentUser.id}`
      );

    console.log(data);
    setConversations(data);
  };

  useEffect(() => {
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
          console.log("PAYLOAD : ", payload);
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
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    const { data: profilequests } = await supabaseClient
      .from("profilesquests")
      .select("*")
      .match({ profile_id: currentUser.id, type: "talk" });

    profilequests.map(async profilequest => {
      const { data: quest } = await supabaseClient
        .from("quests")
        .select("*")
        .match({ id: profilequest.quest_id });

      if (quest[0].number_to_do === profilequest.values.length + 1) {
        const shouldUpdateLvl = miseAJourNiveau(
          currentUser.xp_global,
          quest[0].xp
        );
        if (shouldUpdateLvl) {
          const { data, error } = await supabaseClient
            .from("profiles")
            .update({
              xp_global: currentUser.xp_global + quest[0].xp,
              lvl_global: currentUser.lvl_global + 1,
            })
            .eq("id", currentUser.id)
            .select();

          if (data) {
            sessionStorage.setItem("user", JSON.stringify(data[0]));
            updateCurrentUser(data[0]);
          }
        } else {
          const { data, error } = await supabaseClient
            .from("profiles")
            .update({
              xp_global: currentUser.xp_global + quest[0].xp,
            })
            .eq("id", currentUser.id)
            .select();

          if (data) {
            sessionStorage.setItem("user", JSON.stringify(data[0]));
            updateCurrentUser(data[0]);
          }
        }

        const { error } = await supabaseClient
          .from("profilesquests")
          .update({
            values: [...profilequest.values, message],
          })
          .eq("id", profilequest.id);
        setDisplayModalQuestSuccess(true);
      } else {
        const { error } = await supabaseClient
          .from("profilesquests")
          .update({
            values: [...profilequest.values, message],
          })
          .eq("id", profilequest.id);
      }
    });
    if (conversationId === null) {
      const { error } = await supabaseClient.from("messages").insert({
        content: message,
        profile_id: currentUser.id,
        username: currentUser.username,
        fullname: currentUser.full_name,
      });
    } else {
      const { error } = await supabaseClient.from("messages").insert({
        content: message,
        profile_id: currentUser.id,
        username: currentUser.username,
        fullname: currentUser.full_name,
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
        profile_id_creator: currentUser.id,
        profile_id_receiver: newConversationuser,
        name: name,
      });
    handleCloseModal();
    fetchConversations();
  };

  const addXpToUser = async xp => {
    if (currentUser) {
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ xp_global: currentUser.xp_global + xp })
        .eq("id", currentUser.id)
        .select();

      if (data) {
        sessionStorage.setItem("user", JSON.stringify(data[0]));
        updateCurrentUser(data[0]);
      }
    }
  };

  const obtenirNiveau = xp => {
    const xpParNiveau = 100;
    let niveau = 1;

    while (xp >= xpParNiveau) {
      xp -= xpParNiveau;
      niveau += 1;
    }

    return niveau;
  };

  const miseAJourNiveau = (xpTotalAvantQuete, xpQuete) => {
    const xpTotalApresQuete = xpTotalAvantQuete + xpQuete;
    const niveauAvantQuete = obtenirNiveau(xpTotalAvantQuete);
    const niveauApresQuete = obtenirNiveau(xpTotalApresQuete);

    if (niveauApresQuete > niveauAvantQuete) {
      return true; // Le joueur a gagné un niveau
    } else {
      return false; // Le joueur n'a pas gagné de niveau
    }
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
    <div className="mx-auto p-4 flex w-4/5">
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
            <Button type="submit" text="Envoyer" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
