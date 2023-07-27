import { useEffect, useState } from "react";
import Button from "../Button";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function FormQuest({ id, triggerFetch }) {
  const { supabaseClient } = useSessionContext();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    difficulty: "",
    isSolo: false,
    frequency: "hebdo",
    xp: "",
    taskNumber: "",
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabaseClient
      .from("quests")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFormData({
        name: data.name,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        isSolo: data.isSolo,
        frequency: data.frequency,
        xp: data.xp,
        taskNumber: data.number_to_do,
      });
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const updateQuests = async e => {
    e.preventDefault();
    const formValues = formData;

    if (formData.difficulty !== "custom") {
      const customDifficulty = templateDifficultyQuest[formData.difficulty];
      formValues.xp = customDifficulty.xp;
      formValues.taskNumber = customDifficulty.number_to_do;
    }
    const { data, error } = await supabaseClient
      .from("quests")
      .update({
        name: formValues.name,
        description: formValues.description,
        type: formValues.type,
        difficulty: formValues.difficulty,
        isSolo: formValues.isSolo,
        frequency: formValues.frequency,
        xp: formValues.xp,
        number_to_do: formValues.taskNumber,
      })
      .eq("id", id)
      .select();

    if (data) {
      triggerFetch();
    }
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Modifer un client
      </h3>
      <form className="space-y-6" onSubmit={updateQuests}>
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
              value={formData.name}
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
              value={formData.description}
              required
            />
            <br />

            {/* <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                name="isSolo"
                className="sr-only peer"
                checked={formData.isSolo}
                onChange={handleChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Solo
              </span>
            </label> */}

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
              <option value="custom">Custom</option>
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

            {formData.difficulty === "custom" && (
              <div>
                <label
                  htmlFor="xp"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Xp
                </label>
                <input
                  type="number"
                  name="xp"
                  value={formData.xp}
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
                  value={formData.taskNumber}
                  className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder=""
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>
        }

        <Button text="Modifier une quête" type="submit" />
      </form>
    </div>
  );
}

const templateDifficultyQuest = {
  easy: {
    xp: 20,
    number_to_do: 3,
  },

  medium: {
    xp: 50,
    number_to_do: 50,
  },

  hard: {
    xp: 100,
    number_to_do: 10,
  },
};
