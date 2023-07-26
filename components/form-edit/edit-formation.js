import { useEffect, useState } from "react";
import Button from "../Button";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function FormFormation({ id, triggerFetch }) {
  const { supabaseClient } = useSessionContext();
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    duration: "",
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabaseClient
      .from("formations")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFormData({
        name: data.name,
        place: data.place,
        duration: data.duration,
      });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateFormation = async e => {
    e.preventDefault();
    const { data, error } = await supabaseClient
      .from("formations")
      .update({
        name: formData.name,
        place: formData.place,
        duration: formData.duration,
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
      <form className="space-y-6" onSubmit={updateFormation}>
        {
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
              value={formData.name}
              required
            />

            <label
              htmlFor="place"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Lieu
            </label>
            <input
              type="text"
              name="place"
              id="place"
              className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Lieu"
              onChange={handleChange}
              value={formData.place}
              required
            />

            <label
              htmlFor="duration"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Durée
            </label>
            <input
              type="number"
              name="duration"
              id="duration"
              className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Durée"
              onChange={handleChange}
              value={formData.duration}
              required
            />
          </div>
        }

        <Button text="Modifier une formation" type="submit" />
      </form>
    </div>
  );
}
