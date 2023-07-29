import React, { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Button from "@/components/Button";
import Title from '@/components/Title';

const List = () => {
  const { supabaseClient } = useSessionContext();

  const [formations, setFormations] = useState([]);
  const [formationData, setFormationData] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    const { data, error } = await supabaseClient
      .from("profilesformations")
      .select("id, formation_id, profile_id");

    if (error) {
      console.error("Error fetching formations:", error);
    } else {
      setFormations(data);
    }
  };

  const fetchFormationData = async (formationId) => {
    const { data, error } = await supabaseClient
      .from("formations")
      .select("name, place")
      .eq("id", formationId);

    if (error) {
      console.error("Error fetching formation data:", error);
      return {};
    }

    setFormationData((prevFormationData) => ({
      ...prevFormationData,
      [formationId]: data[0],
    }));
  };

  const fetchUserData = async (userId) => {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*") 
      .eq("id", userId);

    if (error) {
      console.error("Error fetching user data:", error);
      return {};
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      [userId]: data[0],
    }));
  };

  const handleAcceptFormation = async (formationId) => {
    const { error } = await supabaseClient
      .from("profilesformations")
      .update({ status: "✅" })
      .eq("id", formationId);

    if (error) {
      console.error("Error accepting formation:", error);
    } else {
      fetchFormations();
    }
  };

  const handleCancelFormation = async (formationId) => {
    const { error } = await supabaseClient
      .from("profilesformations")
      .delete()
      .eq("id", formationId);

    if (error) {
      console.error("Error cancelling formation:", error);
    } else {
      fetchFormations();
    }
  };

  useEffect(() => {
    formations.forEach((formation) => {
      fetchFormationData(formation.formation_id);
      fetchUserData(formation.profile_id);
    });
  }, [formations]);
  const styles = {
    container: "p-4 ",
    title: "text-2xl font-bold mb-4 text-center text-white",
    table: "w-full border-collapse border border-gray-200 mt-12",
    th: "border border-gray-200 px-4 py-2 bg-gray-100",
    td: "border border-gray-200 px-4 py-2 text-white",
    acceptBtn: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2",
    cancelBtn:
      "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl ml-2",
  };

  return (
    <main style={{justifyContent:"center",justifyItems:"center",marginLeft:"auto", marginRight:"auto"}}>
    <div className={styles.container}>
    <Title text='Liste des commandes' />

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Formation</th>
            <th className={styles.th}>Lieu</th>
            <th className={styles.th}>Profil</th>
            <th className={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {formations.map((formation) => (
            <tr key={formation.id}>
              <td className={styles.td}>{formationData[formation.formation_id]?.name}</td>
              <td className={styles.td}>{formationData[formation.formation_id]?.place}</td>
              <td className={styles.td}>{userData[formation.profile_id]?.username}</td>
              <td className={styles.td}>
                <Button
                  onClick={() => handleAcceptFormation(formation.id)}
                  text="Accepter"
                >
                  Accepter
                </Button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => handleCancelFormation(formation.id)}
                >
                  Réfuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </main>
  );
};

export default List;
