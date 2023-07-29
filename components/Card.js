import Image from "next/image";
import React, { useState, useEffect } from "react";
import CustomModal from "@/components/CustomModal";
import { useRouter } from "next/router";
import Button from "./Button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import FormClient from "./form-edit/edit-client";
import FormProject from "./form-edit/edit-project";
import FormEvent from "./form-edit/edit-event";
import FormQuest from "./form-edit/edit-quest";
import FormFormation from "./form-edit/edit-formation";
import { ProgressBar } from "./ProgressBar";

function Card({
  id,
  title,
  subtitle,
  status,
  imageUrl,
  triggerFetch,
  quest,
  questDataSingle,
  type = "default",
}) {
  const [displayModalDelete, setDisplayModalDelete] = useState(false);
  const [displayModalEdit, setDisplayModalEdit] = useState(false);
  const [showDropdown, setShowDrown] = useState(false);
  const [inscription, setInscription] = useState(false);
  const { supabaseClient } = useSessionContext();
  const [questData, setQuestData] = useState(null);
  const router = useRouter();

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (quest) setQuestData(quest);
  }, [quest]);

  useEffect(() => {
    const fetchInscriptionStatus = async () => {
      if (type === "event" && user) {
        const isRegistered = await isUserRegisteredForEvent(
          id,
          user.id,
          supabaseClient
        );
        setInscription(isRegistered);
      } else if (type === "formation" && user) {
        const isRegisteredFormation = await isUserRegisteredFormation(
          id,
          user.id,
          supabaseClient
        );
        setInscription(isRegisteredFormation);
      }
    };
    fetchInscriptionStatus();
  }, [type, id, user, supabaseClient]);

  const isUserRegisteredForEvent = async (
    eventId,
    profileId,
    supabaseClient
  ) => {
    try {
      const { data, error } = await supabaseClient
        .from("profilesevents")
        .select("*")
        .eq("event_id", eventId)
        .eq("profile_id", profileId)
        .single();

      if (data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleRegisterEvent = async eventId => {
    try {
      if (!user) {
        return;
      }

      const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }

      const profileId = profileData?.id;

      if (!profileId) {
        return;
      }

      const statusformations =
        typeof window !== "undefined"
          ? JSON.parse(sessionStorage.getItem("profilesformations"))
          : null;
      const status = statusformations?.role;
      if (!status) {
        return "en attente d 'acceptation";
      }
      console.log(status);

      if (await isUserRegisteredForEvent(eventId, profileId, supabaseClient)) {
        const { data, error } = await supabaseClient
          .from("profilesevents")
          .delete()
          .eq("event_id", eventId)
          .eq("profile_id", profileId);

        if (data) {
          setInscription(false);
          fetchEvents();
        }
      } else {
        const { data, error } = await supabaseClient
          .from("profilesevents")
          .insert([{ event_id: eventId, profile_id: profileId }]);

        if (data) {
          setInscription(true);
          fetchEvents();
        }
      }
    } catch (error) {
      console.error(
        "Error registering/unregistering user for the event:",
        error.message
      );
    }
  };

  const isUserRegisteredFormation = async (
    formationId,
    profileId,
    supabaseClient
  ) => {
    try {
      const { data, error } = await supabaseClient
        .from("profilesformations")
        .select("*")
        .eq("formation_id", formationId)
        .eq("profile_id", profileId)
        .single();

      if (data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking formation registration:", error.message);
      return false;
    }
  };

  const handleRegisterFormation = async formationId => {
    try {
      if (!user) {
        return;
      }

      const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }

      const profileId = profileData?.id;

      if (!profileId) {
        return;
      }

      const isRegistered = await isUserRegisteredFormation(
        formationId,
        profileId,
        supabaseClient
      );

      if (isRegistered) {
        const { data, error } = await supabaseClient
          .from("profilesformations")
          .delete()
          .eq("formation_id", formationId)
          .eq("profile_id", profileId);

        if (data) {
          setInscription(false);
        } else {
          console.error("Error unregistering user from the formation", error);
        }
        window.location.reload();
      } else {
        const { data, error } = await supabaseClient
          .from("profilesformations")
          .insert([{ formation_id: formationId, profile_id: profileId }]);

        if (data) {
          setInscription(true);
        } else {
          console.error("Error registering user for the formation:", error);
        }
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Error registering/unregistering user for the formation",
        error.message
      );
    }
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
  const deleteClient = async id => {
    triggerFetch(id);
    if (id) {
      switch (type) {
        case "client":
          const { error } = await supabaseClient
            .from("clients")
            .delete()
            .eq("id", id);
          if (error) console.log(error);
          break;
        case "user":
          const { error1 } = await supabaseClient
            .from("profiles")
            .delete()
            .eq("id", id);
          if (error1) console.log(error1);
          break;
        case "project":
          const { error2 } = await supabaseClient
            .from("projects")
            .delete()
            .eq("id", id);
          if (error2) console.log(error2);
          break;
        case "event":
          const { error3 } = await supabaseClient
            .from("events")
            .delete()
            .eq("id", id);
          if (error3) console.log(error3);
          break;
        case "quests":
          const { error4 } = await supabaseClient

            .from("quests")
            .delete()
            .eq("id", id);
          if (error4) console.log(error4);
          break;
        default:
      }
    }
  };

  const handleShowDropdown = e => {
    e.preventDefault();
    e.stopPropagation();
    setShowDrown(!showDropdown);
  };

  return (
    <>
      <div
        className={
          "inline-flex p-1 cursor-pointer flex-col w-full max-w-xs mb-2 mr-2 rounded-lg group bg-gradient-to-br from-secondary to-carbon-blue shadow" +
          (quest && quest.quests.difficulty === "easy"
            ? " from-carbon-green to-carbon-blue"
            : quest && quest.quests.difficulty === "medium"
            ? " from-yellow-500 to-orange-500"
            : quest && quest.quests.difficulty === "hard"
            ? " from-orange-500 to-red-500"
            : quest && quest.quests.difficulty === "custom"
            ? " from-black to-red-500"
            : "")
        }
        onClick={() => {
          switch (type) {
            case "client":
              router.push(`/clients/${id}`);
              break;
            case "user":
              router.push(`/users/${id}`);
              break;
            case "project":
              router.push(`/projects/${id}`);
              break;
            case "event":
              router.push(`/social/events/${id}`);
              break;
            default:
          }
        }}
      >
        <div className="p-4 bg-white rounded-md">
          <div className="flex justify-end  relative ">
            {!quest && (
              <button
                onClick={handleShowDropdown}
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className="inline-block text-primary hover:bg-gray-100 rounded-lg text-sm p-1.5"
                type="button"
              >
                <span className="sr-only">Open dropdown</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>
            )}

            {showDropdown && !quest && (
              <div
                id="dropdown"
                className=" absolute right-12 z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-primary"
              >
                <ul className="py-2" aria-labelledby="dropdownButton">
                  {type !== "user" &&
                    title !== "Parler" &&
                    title !== "Visiter Profil" &&
                    title !== "Créer Evenement" && (
                      <>
                        <li>
                          <a
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDisplayModalEdit(true);
                              setShowDrown(false);
                            }}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Modifier
                          </a>
                        </li>
                      </>
                    )}
                  <li>
                    <a
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDrown(false);
                        setDisplayModalDelete(true);
                      }}
                      href="#"
                      className="block px-4 py-2 text-sm text-secondary hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Supprimer
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center ">
            {inscription && (
              <div className="text-xl w-24 text-black text-green-700 text-center">
                {status}
              </div>
            )}
            {imageUrl && (
              <Image
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={imageUrl}
                alt="Image"
                width={50}
                height={50}
              />
            )}

            <h5 className="mb-1 text-xl font-semibold text-primary">
              {quest ? quest.quests.description : title}
            </h5>
            {questDataSingle && (
              <>
                <h5 className="mb-1 text-xl font-semibold text-primary">
                  Xp : {questDataSingle.xp}
                </h5>
                <h5 className="mb-1 text-xl font-semibold text-primary">
                  Difficulté : {questDataSingle.difficulty}
                </h5>
                <h5 className="mb-1 text-xl font-semibold text-primary">
                  Fréquence : {questDataSingle.frequency}
                </h5>
              </>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </span>
            {quest && (
              <ProgressBar
                value={quest.values === null ? 0 : quest.values.length}
                maxValue={quest.quests.number_to_do}
              />
            )}
            {quest &&
              quest.quests.quest_type === "custom" &&
              quest.quests.type === "irl" && (
                <div className="mt-3">
                  <input
                    type="file"
                    name="fileProof"
                    id="fileProof"
                    accept=".jpg, .jpeg, .png, .pdf"
                    className="opacity-0 absolute z-0 w-0 h-0"
                  />
                  <label
                    htmlFor="fileProof"
                    className="bg-red-500 rounded-full px-2 py-1"
                  >
                    Preuve requise 📤
                  </label>
                </div>
              )}
          </div>
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            {type === "event" && user && (
              <Button
                text={inscription ? "Se désinscrire" : "S'inscrire"}
                onClick={() => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRegisterEvent(id);
                }}
              />
            )}
            {type === "event" && !user && (
              <p>Please log in to register for this event.</p>
            )}
          </div>
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            {type === "formation" && user && (
              <Button
                text={inscription ? "Se désinscrire" : "S'inscrire"}
                onClick={() => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRegisterFormation(id);
                }}
              />
            )}
            {type === "formation" && !user && (
              <p>Please log in to register for this event.</p>
            )}
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={displayModalDelete}
        onRequestClose={() => setDisplayModalDelete(false)}
        styles={customStyles}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setDisplayModalDelete(false)}
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
                Supprimer un client
              </h3>
              <Button
                text="Confirmer"
                type="submit"
                onClick={() => {
                  deleteClient(id);
                  setDisplayModalDelete(false);
                }}
              />
              <Button
                text="Annuler"
                onClick={() => setDisplayModalDelete(false)}
              />
            </div>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        isOpen={displayModalEdit}
        onRequestClose={() => setDisplayModalEdit(false)}
        styles={customStyles}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setDisplayModalEdit(false)}
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
            {type === "client" ? (
              <FormClient
                id={id}
                triggerFetch={() => {
                  triggerFetch();
                  setDisplayModalEdit(false);
                }}
              />
            ) : type === "project" ? (
              <FormProject
                id={id}
                triggerFetch={() => {
                  triggerFetch();
                  setDisplayModalEdit(false);
                }}
              />
            ) : type === "event" ? (
              <FormEvent
                id={id}
                triggerFetch={() => {
                  triggerFetch();
                  setDisplayModalEdit(false);
                }}
              />
            ) : type === "formation" ? (
              <FormFormation
                id={id}
                triggerFetch={() => {
                  triggerFetch();
                  setDisplayModalEdit(false);
                }}
              />
            ) : type === "quests" ? (
              <FormQuest
                id={id}
                triggerFetch={() => {
                  triggerFetch();
                  setDisplayModalEdit(false);
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default Card;
