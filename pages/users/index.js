import Button from "@/components/Button";
import Card from "@/components/Card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import CustomModal from "@/components/CustomModal";
import Title from "@/components/Title";

const Users = () => {
  const { supabaseClient } = useSessionContext();
  const [displayNewUser, setDisplayNewUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "dev",
    job_title: "",
  });
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabaseClient.from("profiles").select("*");
    const usersWithImages = await Promise.all(
      data.map(async user => {
        const { data: publicUrl } = await supabaseClient.storage
          .from("uploads")
          .getPublicUrl(`contents/${user.avatar_url}`);

        user.imageUrl = publicUrl.publicUrl;
        return user;
      })
    );
    setUsers(usersWithImages);
  };
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateUser = async e => {
    e.preventDefault();
    const { data, error } = await supabaseClient
      .from("profiles")
      .insert({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        job_title: formData.job_title,
      })
      .select();

    if (data) {
      setDisplayNewUser(false);
      fetchUsers();
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
    <main className="p-4 w-4/5">
      <Title text="Collaborateurs" />
      <Button
        text="Ajouter un utilisateur"
        onClick={() => {
          setDisplayNewUser(!displayNewUser);
        }}
      />

      <CustomModal
        isOpen={displayNewUser}
        onRequestClose={() => setDisplayNewUser(false)}
        styles={customStyles}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setDisplayNewUser(false)}
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
                Ajouter un utilisateur
              </h3>
              <form className="space-y-6" onSubmit={handleCreateUser}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="full_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nom complet
                  </label>
                  <input
                    name="full_name"
                    id="full_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Rôle
                    </label>
                    <select
                      id="role"
                      name="role"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="com">Commercial</option>
                      <option value="rh">Ressource Humaines</option>
                      <option value="dev">Consultant</option>
                      <option value="mgr">Manager</option>
                    </select>
                  </div>
                  <div className="flex-2">
                    <label
                      htmlFor="job_title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Métier
                    </label>
                    <input
                      name="job_title"
                      id="job_title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Développeur Web"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <Button text="Ajouter un utilisateur" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>

      <div className="flex flex-wrap justify-center">
        {users?.map(user => {
          return (
            <Card
              key={user.id}
              id={user.id}
              title={user.full_name}
              subtitle={user.job_title}
              imageUrl={user.avatar_url ? user.imageUrl : "/noImage.jpeg"}
              triggerFetch={id => {
                if (id) {
                  setUsers(users.filter(user => user.id !== id));
                } else {
                  fetchUsers();
                }
              }}
              type="user"
            />
          );
        })}
      </div>
    </main>
  );
};

export default Users;
