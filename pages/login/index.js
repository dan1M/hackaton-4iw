import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const handleFormsubmit = async e => {
    e.preventDefault();

    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .match({ email: email, password: password });

    if (data.length === 0) {
      setError("Mot de passe ou email inccorect.");
    } else {
      const dataUser = JSON.stringify(data[0]);
      sessionStorage.setItem("user", dataUser);
      router.push("/quests");
    }
  };

  return (
    <div className="z-50 w-full p-4  h-[calc(100%-1rem)] max-h-full">
      <div className="relative w-full max-w-md max-h-full m-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-primary">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Se connecter
            </h3>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <form className="space-y-6" onSubmit={handleFormsubmit}>
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Connectez-vous
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
