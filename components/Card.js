import Image from "next/image";
import React, { useState,useEffect } from "react";
import CustomModal from "@/components/CustomModal";
import Button from "./Button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import FormClient from "./form-edit/edit-client";
import FormProject from "./form-edit/edit-project";
import FormEvent from "./form-edit/edit-event";
import FormQuest from "./form-edit/edit-quest";
import FormFormation from "./form-edit/edit-formation";

function Card({
  id,
  title,
  subtitle,
  duration,
  status,
  imageUrl,
  triggerFetch,
  type = "default",
}) {
  const [displayModalDelete, setDisplayModalDelete] = useState(false);
  const [displayModalEdit, setDisplayModalEdit] = useState(false);
  const [inscription, setInscription] = useState(false);
  const [showDropdown, setShowDrown] = useState(false);
  const { supabaseClient } = useSessionContext();


  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : null;
  const role = user?.role;

  const isRole = role === "mgr" || role === "rh";

  
 
  useEffect(() => {
    const fetchInscriptionStatus = async () => {
      if (type === "event" && user) {
        const isRegistered = await isUserRegisteredForEvent(id, user.id, supabaseClient);
        setInscription(isRegistered);
      } else if (type === "formation" && user) {
        const isRegisteredFormation = await isUserRegisteredFormation(id, user.id, supabaseClient);
        setInscription(isRegisteredFormation);
      }
    };
    fetchInscriptionStatus();
  }, [type, id, user, supabaseClient]);



  const isUserRegisteredForEvent = async (eventId, profileId, supabaseClient) => {
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
      console.error("Error checking event registration:", error.message);
      return false;
    }
  };


 
  const handleRegisterEvent = async (eventId) => {
    try {
      if (!user) {
        return;
      }

      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      const profileId = profileData?.id;

      if (!profileId) {
       
        return;
      }

      if (await isUserRegisteredForEvent(eventId, profileId, supabaseClient)) {
        const { data, error } = await supabaseClient
          .from('profilesevents')
          .delete()
          .eq('event_id', eventId)
          .eq('profile_id', profileId);

        if (data) {
         
          setInscription(false);
          fetchEvents();
        } 
      } else {
        const { data, error } = await supabaseClient
          .from('profilesevents')
          .insert([{ event_id: eventId, profile_id: profileId }]);

        if (data) {
         
          setInscription(true); 
          fetchEvents();
        } 
      }
    } catch (error) {
      console.error('Error registering/unregistering user for the event:', error.message);
    }
  };



  const isUserRegisteredFormation = async (formationId, profileId, supabaseClient) => {
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
  
  
  const handleRegisterFormation = async (formationId) => {
    try {
      if (!user) {
        return;
      }
  
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();
  
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }
  
      const profileId = profileData?.id;
  
      if (!profileId) {
        return;
      }
  
      const isRegistered = await isUserRegisteredFormation(formationId, profileId, supabaseClient);
  
      if (isRegistered) {
        const { data, error } = await supabaseClient
          .from('profilesformations')
          .delete()
          .eq('formation_id', formationId)
          .eq('profile_id', profileId);
  
        if (data) {
          setInscription(false);
        } else {
          console.error('Error unregistering user from the formation', error);
        }
      } else {
        const { data, error } = await supabaseClient
          .from('profilesformations')
          .insert([{ formation_id: formationId, profile_id: profileId }]);
  
        if (data) {
          setInscription(true);
        } else {
          console.error('Error registering user for the formation:', error);
        }
      }
    } catch (error) {
      console.error('Error registering/unregistering user for the formation', error.message);
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
        case "list":
          const { error5 } = await supabaseClient
            .from("lists")
            .delete()
            .eq("id", id);
          if (error5) console.log(error5);
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

  const handleShowDropdown = () => {
    setShowDrown(!showDropdown);
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-xs m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-carbon-blue dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4 relative ">
          <button
            onClick={handleShowDropdown}
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            className="inline-block text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
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
          {showDropdown && (
            <div
              id="dropdown"
              className=" absolute right-12 z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-primary"
            >
              <ul className="py-2" aria-labelledby="dropdownButton">
                {type !== "user" &&
                  title !== "Parler" &&
                  title !== "Visiter Profil" && (
                    <>
                      <li>
                        <a
                          onClick={() => setDisplayModalEdit(true)}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Edit
                        </a>
                      </li>
                    </>
                  )}
                <li>
                  <a
                    onClick={() => setDisplayModalDelete(true)}
                    href="#"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600  dark:hover:text-white"
                  >
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
       
        <div className="flex flex-col items-center pb-4 ">
          {imageUrl && (
            <Image
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={imageUrl}
              alt="Bonnie image"
              width={20}
              height={20}
            />
          )}

          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {title}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </span>
          {type === "formation" && (
            <div>
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">

              {type === "formation" && inscription && (
             <div>
          </div>
          )}
            </h5>
            <span className="text-sm text-black  text-black text-center">
             Durée:  {duration} Heures
            </span>
            <span className="text-sm text-black  text-black text-center">
            {status} 
            </span>
            </div>
          )}
          <div>
            
          </div>
         
        </div>
        <div style={{ textAlign: "center", cursor: "pointer" }}>
        {type === "event" && user && (
          <Button
            text={inscription ? "Se désinscrire" : "S'inscrire"}
            onClick={() => handleRegisterEvent(id)}
          />
        )}
      
      </div>
        <div style={{ textAlign: "center", cursor: "pointer" }}>
        {type === "formation" && user && (
          <Button
            text={inscription ? "Se désinscrire" : "S'inscrire"}
            onClick={() => handleRegisterFormation(id)}
          />
        )}
        {type === "formation" && !user && ( 
          <p>Please log in to register for this event.</p>
        )}
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
            ) : type === "list" ? (
              <FormList
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