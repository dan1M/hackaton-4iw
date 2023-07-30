import Button from "@/components/Button";
import Card from "@/components/Card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState, useContext } from "react";
import CustomModal from "@/components/CustomModal";
import Title from "@/components/Title";
import { AppContext } from "@/pages/_app";
import { useRouter } from "next/router";

const Event = () => {
  const { currentUser, updateCurrentUser } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evenements, setEvenements] = useState([]);
  const [displayModalQuestSuccess, setDisplayModalQuestSuccess] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabaseClient.from("events").select("*");
    setEvenements(data);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleCreateEvent = async e => {
    e.preventDefault();
    const { error } = await supabaseClient
      .from("events")
      .insert({ name: formData.name });
    handleCloseModal();
    fetchEvents();

    const { data: profilequests } = await supabaseClient
      .from("profilesquests")
      .select("*")
      .match({ profile_id: currentUser.id, type: "event" });

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
            values: [...profilequest.values, formData.name],
            isDone: true,
          })
          .eq("id", profilequest.id);
        setDisplayModalQuestSuccess(true);
      } else {
        const { error } = await supabaseClient
          .from("profilesquests")
          .update({
            values: [...profilequest.values, formData.name],
          })
          .eq("id", profilequest.id);
      }
    });
  };

  const miseAJourNiveau = (xpTotalAvantQuete, xpQuete) => {
    const xpTotalApresQuete = xpTotalAvantQuete + xpQuete;
    const niveauAvantQuete = obtenirNiveau(xpTotalAvantQuete);
    const niveauApresQuete = obtenirNiveau(xpTotalApresQuete);

    if (niveauApresQuete > niveauAvantQuete) {
      return true;
    } else {
      return false;
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

  return (
    <main className="p-4 w-4/5">
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
        </div>
      </CustomModal>
      <Title text="Evènements" />
      <br />
      {currentUser.role === "rh" && (
        <Button text="Ajouter un évènement" onClick={handleOpenModal} />
      )}

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
                Ajouter un évènement
              </h3>
              <form className="space-y-6" onSubmit={handleCreateEvent}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button text="Ajouter un évènement" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>
      <div className="flex flex-wrap justify-center">
        {evenements?.map(evenement => {
          return (
            <Card
              key={evenement.id}
              id={evenement.id}
              title={`Nom : ${evenement.name}`}
              triggerFetch={id => {
                if (id) {
                  setEvenements(
                    evenements.filter(evenement => evenement.id !== id)
                  );
                } else {
                  fetchEvents();
                }
              }}
              type="event"
            />
          );
        })}
      </div>
    </main>
  );
};

export default Event;
