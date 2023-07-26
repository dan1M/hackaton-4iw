import Button from "@/components/Button";
import Card from "@/components/Card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import CustomModal from "@/components/CustomModal";
import Sidebar from "@/components/Sidebar";

const Quests = () => {
  const { supabaseClient } = useSessionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCustomOpen, setIsModalCustomOpen] = useState(false);

  const [quests, setQuests] = useState([]);

  const [forms, setForms] = useState({
    visit: true,
    talk: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "irl",
    difficulty: "easy",
    isSolo: false,
    frequency: "hebdo",
    xp: "",
    taskNumber: 0,
  });

  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
      type: "irl",
      difficulty: "easy",
      isSolo: false,
      frequency: "hebdo",
      xp: "",
      taskNumber: 0,
      questType: "default",
    });
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

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    const { data } = await supabaseClient.from("quests").select("*");
    setQuests(data);
  };

  const handleOpenModal = () => {
    setFormData(prevData => ({
      ...prevData,
      questType: "default",
    }));
    setIsModalOpen(true);
  };

  const handleOpenModalCustom = () => {
    setIsModalCustomOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModalCustom = () => {
    setIsModalCustomOpen(false);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    // If the input type is checkbox (toggle)
    if (type === "checkbox") {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked, // Set the value of the toggle to the checked property
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreateQuest = async e => {
    e.preventDefault();
    console.log(formData);
    const { error } = await supabaseClient.from("quests").insert({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      difficulty: formData.difficulty,
      isSolo: formData.isSolo,
      frequency: formData.frequency,
      xp: formData.xp,
      number_to_do: formData.taskNumber,
      quest_type: formData.questType,
    });
    resetFormData();
    handleCloseModal();
    handleCloseModalCustom();
  };

  return (
    <main className="p-4">
      <Button text="Ajouter une quete" onClick={handleOpenModal} />
      <Button text="Ajouter une quete custom" onClick={handleOpenModalCustom} />

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
                Ajouter une quête
              </h3>
              <form className="space-y-6" onSubmit={handleCreateQuest}>
                {
                  <div>
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
                      placeholder="Nom"
                      onChange={handleChange}
                      required
                    />

                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Description"
                      onChange={handleChange}
                      required
                    />
                    <br />

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        name="isSolo"
                        className="sr-only peer"
                        onChange={handleChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Solo
                      </span>
                    </label>

                    <label
                      htmlFor="type"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={handleChange}
                      name="type"
                      id="type"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="irl">En réalité</option>
                      <option value="ig">En jeu</option>
                    </select>

                    <label
                      htmlFor="difficulty"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Difficulté
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={handleChange}
                      name="difficulty"
                      id="difficulty"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="easy">Facile</option>
                      <option value="medium">Moyen</option>
                      <option value="hard">Difficile</option>
                    </select>

                    <label
                      htmlFor="frequency"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Fréquence
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={handleChange}
                      name="frequency"
                      id="frequency"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="journa">Journalière</option>
                      <option value="hebdo">Hebdomadaire</option>
                    </select>

                    <label
                      htmlFor="xp"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Xp
                    </label>
                    <input
                      type="number"
                      name="xp"
                      id="xp"
                      className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="xp"
                      onChange={handleChange}
                      required
                    />

                    <label
                      htmlFor="taskNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre à réaliser
                    </label>
                    <input
                      type="number"
                      name="taskNumber"
                      id="taskNumber"
                      className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder=""
                      onChange={handleChange}
                      required
                    />
                  </div>
                }

                <Button text="Ajouter une quête" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isModalCustomOpen}
        onRequestClose={handleCloseModalCustom}
        styles={customStyles}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCloseModalCustom}
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
                Ajouter une quête
              </h3>
              <form className="space-y-6" onSubmit={handleCreateQuest}>
                {
                  <div>
                    <input
                      type="button"
                      name="visit"
                      value="Visite"
                      id="visit"
                      onClick={() => {
                        setForms({ visit: true, talk: false });
                        setFormData(prevData => ({
                          ...prevData,
                          questType: "visit",
                        }));
                      }}
                      className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                    <br />
                    <input
                      type="button"
                      name="talk"
                      value="Parler"
                      id="talk"
                      onClick={() => {
                        setForms({ visit: false, talk: true });
                        setFormData(prevData => ({
                          ...prevData,
                          questType: "talk",
                        }));
                      }}
                      className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                    <div>
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
                        placeholder="Nom"
                        onChange={handleChange}
                        required
                      />

                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Description"
                        onChange={handleChange}
                        required
                      />
                      <br />
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          name="isSolo"
                          className="sr-only peer"
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Solo
                        </span>
                      </label>

                      <label
                        htmlFor="type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={handleChange}
                        name="type"
                        id="type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="irl">En réalité</option>
                        <option value="ig">En jeu</option>
                      </select>

                      <label
                        htmlFor="difficulty"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Difficulté
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={handleChange}
                        name="difficulty"
                        id="difficulty"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="easy">Facile</option>
                        <option value="medium">Moyen</option>
                        <option value="hard">Difficile</option>
                      </select>

                      <label
                        htmlFor="frequency"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Fréquence
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={handleChange}
                        name="frequency"
                        id="frequency"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="journa">Journalière</option>
                        <option value="hebdo">Hebdomadaire</option>
                      </select>

                      <label
                        htmlFor="xp"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Xp
                      </label>
                      <input
                        type="number"
                        name="xp"
                        id="xp"
                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="xp"
                        onChange={handleChange}
                        required
                      />

                      <label
                        htmlFor="taskNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nombre à réaliser
                      </label>
                      <input
                        type="number"
                        name="taskNumber"
                        id="taskNumber"
                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder=""
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                }

                <Button text="Ajouter quête" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>
      <div className="flex flex-wrap">
        {quests?.map(quest => {
          return (
            <Card
              key={quest.id}
              id={quest.id}
              title={quest.name}
              imageUrl={"next.svg"}
              triggerFetch={id => {
                if (id) {
                  setQuests(quests.filter(quest => quest.id !== id));
                } else {
                  fetchQuests();
                }
              }}
              type="quests"
            />
          );
        })}
      </div>
    </main>
  );
};

export default Quests;