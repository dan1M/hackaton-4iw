import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CustomModal from "@/components/CustomModal";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Projects = () => {
  const { supabaseClient } = useSessionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    client_id: "",
    user_ids: [],
  });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabaseClient.from("projects").select("*");
      if (data) {
        setProjects(data);
      }
      if (error) {
        console.error("Error fetching projects:", error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabaseClient.from("clients").select("*");
      if (data) {
        setClients(data);
      }
      if (error) {
        console.error("Error fetching clients:", error);
      }
    } catch (error) {
      console.error("Error fetching clients:", error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabaseClient.from("profiles").select("*");
      if (data) {
        setUsers(data);
      }
      if (error) {
        console.error("Error fetching users:", error);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };
  const user =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("user"))
      : null;
  const role = user?.role;
  console.log(role);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenAssociateModal = () => {
    setIsAssociateModalOpen(true);
  };

  const handleCloseAssociateModal = () => {
    setIsAssociateModalOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProject = async e => {
    e.preventDefault();
    try {
      const { data: projectData, error: projectError } = await supabaseClient
        .from("projects")
        .insert([{ name: formData.name, client_id: formData.client_id }]);

      if (projectData) {
        console.log("Project added successfully!");
        handleCloseModal();
        fetchProjects();
      } else {
        console.error("Error adding project:", projectError);
      }
    } catch (error) {
      console.error("Error adding project:", error.message);
    }
  };

  const handleAddClientToProject = async projectId => {
    try {
      const { data: projectData, error: projectError } = await supabaseClient
        .from("projects")
        .update({ client_id: formData.client_id })
        .eq("id", projectId);

      if (projectData) {
        console.log("Client added to the project successfully!");
        fetchProjects();
      } else {
        console.error("Error adding client to the project:", projectError);
      }
    } catch (error) {
      console.error("Error adding client to the project:", error.message);
    }
  };

  const handleAssociateChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAssociateMultiSelectChange = e => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setFormData(prevData => ({
      ...prevData,
      user_ids: selectedOptions,
    }));
  };

  const handleAssociateProjectToDev = async e => {
    e.preventDefault();
    try {
      const { data: associationData, error: associationError } =
        await supabaseClient.from("profilesprojects").insert(
          formData.user_ids.map(user_id => ({
            id_profile: user_id,
            id_project: formData.project_id,
          }))
        );

      if (associationData) {
        console.log("Users associated with the project successfully!");
        handleCloseAssociateModal();
        fetchProjects();
      } else {
        console.error(
          "Error associating users with the project:",
          associationError
        );
      }
    } catch (error) {
      console.error("Error associating users with the project:", error.message);
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

  return (
    <main className="p-4">
      <div>
        {(role === "mgr" || role === "rh") && (
          <Button text="Ajouter un projet" onClick={handleOpenModal} />
        )}
      </div>
      <div>
        {/* {(role === 'mgr' || role === 'rh') && ( */}
        <Button text="Ajouter un projet" onClick={handleOpenModal} />
        {/* )} */}
      </div>

      {/* Formulaire pour ajouter un projet */}

      <div>
        {/* {(role === 'mgr' || role === 'rh') && ( */}
        <Button
          text="Associer un projet aux développeurs"
          onClick={handleOpenAssociateModal}
        />
        {/* )} */}
      </div>

      {/* Formulaire pour ajouter un projet */}

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
                Ajouter un projet
              </h3>
              <form className="space-y-6" onSubmit={handleCreateProject}>
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

                {/* Liste déroulante pour sélectionner un client */}
                <div>
                  <label
                    htmlFor="client"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Client associé
                  </label>
                  <select
                    id="client"
                    name="client_id"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button text="Ajouter un projet" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Formulaire pour associer un projet aux développeurs */}
      <CustomModal
        isOpen={isAssociateModalOpen}
        onRequestClose={handleCloseAssociateModal}
        styles={customStyles}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCloseAssociateModal}
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
                Associer un projet aux développeurs
              </h3>
              <form
                className="space-y-6"
                onSubmit={handleAssociateProjectToDev}
              >
                {/* Liste déroulante pour sélectionner un projet */}
                <div>
                  <label
                    htmlFor="project"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Projet à associer
                  </label>
                  <select
                    id="project"
                    name="project_id"
                    onChange={handleAssociateChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">électionner un project pour les</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="project"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Développeurs à associer
                  </label>
                  <select
                    id="users"
                    name="user_id"
                    onChange={handleAssociateMultiSelectChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">électionner un developpeur ou plus</option>
                    {users.map(user => (
                      <option key={user.username} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  text="Associer le projet aux développeurs"
                  type="submit"
                />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>

      <div className="flex flex-wrap">
        {projects?.map(project => (
          <Card
            key={project.id}
            id={project.id}
            title={project.name}
            imageUrl={"noImage.jpeg"}
            triggerFetch={id => {
              if (id) {
                setProjects(projects.filter(project => project.id !== id));
              } else {
                fetchProjects();
              }
            }}
            type="project"
          >
            <Button
              text="Ajouter un client"
              onClick={() => handleAddClientToProject(project.id)}
            />
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Projects;
