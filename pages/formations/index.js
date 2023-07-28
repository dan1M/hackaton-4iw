import Button from "@/components/Button";
import Card from "@/components/Card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import CustomModal from "@/components/CustomModal";

const Formations = () => {
  const { supabaseClient } = useSessionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formations, setFormations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    place: "",
    duration: 0,
  });

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
    fetchFormations();
  }, []);
  
  const fetchFormations = async () => {
    const { data, error } = await supabaseClient
      .from("formations")
      .select(`
        *,
        profilesformations:profilesformations(*)
      `);

    if (data) {
      setFormations(data);
    }
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

  const handleCreateFormation = async e => {
    e.preventDefault();
    const { error } = await supabaseClient.from("formations").insert({
      name: formData.name,
      place: formData.place,
      duration: formData.duration,
    });
    handleCloseModal();
    fetchFormations();
  };

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const role = user?.role;

  const formationStatus = typeof window != "undefined" ? JSON.parse(sessionStorage.getItem("profilesformations")) : null;
  const status = formationStatus?.status;

  console.log(status);

  const isRole = role === 'mgr' || role === 'rh';
  
  return (
    <main className="p-4">
        <Button text="Ajouter une formation" onClick={handleOpenModal} />

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
                Ajouter une formation
              </h3>
              <form className="space-y-6" onSubmit={handleCreateFormation}>
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
                      required
                    />
                  </div>
                }

                <Button text="Ajouter une formation" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>
      <div className="flex flex-wrap">
      {formations?.map((formation) => {
          const formationStatus = formation.profilesformations?.[0]?.status;
          return (
            <Card
              key={formation.id}
              id={formation.id}
              title={formation.name}
              duration={formation.duration}
              formationStatus={formationStatus}
              imageUrl={"next.svg"}
              triggerFetch={(id) => {
                if (id) {
                  setFormations(formations.filter((formation) => formation.id !== id));
                } else {
                  fetchFormations();
                }
              }}
              type="formation"
            />
          );
        })}
      </div>
    </main>

  );
};

export default Formations;