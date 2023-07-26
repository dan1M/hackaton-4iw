import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import CustomModal from '@/components/CustomModal';
import { useSessionContext } from '@supabase/auth-helpers-react';

const Projects = () => {
  const { supabaseClient } = useSessionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    user_id: '',
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabaseClient.from('projects').select('*');
      if (data) {
        setProjects(data);
      }
      if (error) {
        console.error('Error fetching projects:', error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabaseClient.from('clients').select('*');
      if (data) {
        setClients(data);
      }
      if (error) {
        console.error('Error fetching clients:', error);
      }
    } catch (error) {
      console.error('Error fetching clients:', error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabaseClient.from('profiles').select('*');
      if (data) {
        setUsers(data);
      }
      if (error) {
        console.error('Error fetching users:', error);
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data: projectData, error: projectError } = await supabaseClient
        .from('projects')
        .insert([
          { name: formData.name, client_id: formData.client_id },
        ]);

      if (projectData) {
        console.log('Project added successfully!');

        // Now, associate the selected user with the newly created project
        const projectId = projectData[0].id;
        const userId = formData.user_id;

        if (userId) {
          const { data: associationData, error: associationError } = await supabaseClient
            .from('profilesprojects')
            .insert([
              { id_profile: userId, id_project: projectId },
            ]);

          if (associationData) {
            console.log('User associated with the project successfully!');
          } else {
            console.error('Error associating user with the project:', associationError);
          }
        }

        handleCloseModal();
        fetchProjects();
      } else {
        console.error('Error adding project:', projectError);
      }
    } catch (error) {
      console.error('Error adding project:', error.message);
    }
  };

  const handleAddClientToProject = async (projectId) => {
    try {
      const { data: projectData, error: projectError } = await supabaseClient
        .from('projects')
        .update({ client_id: formData.client_id })
        .eq('id', projectId);

      if (projectData) {
        console.log('Client added to the project successfully!');
        fetchProjects();
      } else {
        console.error('Error adding client to the project:', projectError);
      }
    } catch (error) {
      console.error('Error adding client to the project:', error.message);
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px',
      padding: '20px',
      border: 'none',
      maxWidth: '400px',
      backgroundColor: '#282B2A',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
    },
  };

  return (
    <main className="p-4">
      <Button text="Ajouter un projet" onClick={handleOpenModal} />

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
                className='w-3 h-3'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
              <span className='sr-only'>Close modal</span>
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
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Liste déroulante pour sélectionner un utilisateur (rh ou mgr) */}
                {users.filter((user) => user.role === 'rh' || user.role === 'mgr').length > 0 && (
                  <div>
                    <label
                      htmlFor="user"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Utilisateur associé (RH ou MGR)
                    </label>
                    <select
                      id="user"
                      name="user_id"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users
                        .filter((user) => user.role === 'rh' || user.role === 'mgr')
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.full_name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <Button text="Ajouter un projet" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>

      <div className="flex flex-wrap">
        {projects?.map((project) => (
          <Card
            key={project.id}
            id={project.id}
            title={project.name}
            imageUrl={'next.svg'}
            triggerFetch={(id) => {
              if (id) {
                setProjects(projects.filter((project) => project.id !== id));
              } else {
                fetchProjects();
              }
            }}
            type="project"
          >
            {/* Add a button to add a client to the project */}
            <Button text="Ajouter un client" onClick={() => handleAddClientToProject(project.id)} />
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Projects;
