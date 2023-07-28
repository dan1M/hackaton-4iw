import React, { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

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
      .select("*");
    if (error) {
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
      return {};
    }

    setFormationData(data[0]);
  };

  const fetchUserData = async (userId) => {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("username")
      .eq("id", userId);

    if (error) {
      return {};
    }

    setUserData(data[0]);
  };

  const handleAcceptFormation = async (formationId) => {
    try {
      const formationToUpdate = formations.find((formation) => formation.id === formationId);
      const newStatus = "accepter";
      setFormations((prevFormations) =>
        prevFormations.map((formation) =>
          formation.id === formationId ? { ...formation, status: newStatus } : formation
        )
      );

      const { error: formationError } = await supabaseClient
        .from("profilesformations")
        .update({ status: newStatus })
        .eq("id", formationId);
  
      if (formationError) {
    
        setFormations((prevFormations) =>
          prevFormations.map((formation) =>
            formation.id === formationId ? { ...formation, status: formationToUpdate.status } : formation
          )
        );
        return;
      }
      const { data: usersData, error: usersError } = await supabaseClient
        .from("profilesformations")
        .select("*")
        .eq("formation_id", formationId);
  
      if (usersError) {
        return;
      }
      const usersToUpdate = usersData.map((user) => user.profile_id);
  
      if (usersToUpdate.length > 0) {
        const { error: updateUsersError } = await supabaseClient
          .from("profiles")
          .update({ status: newStatus }) 
          .in("id", usersToUpdate);
  
        if (updateUsersError) {
         return;
        }
      }
    } catch (error) {
      console.error("Error accepting formation:", error.message);
    }
  };
  
  

  const handleCancelFormation = async (formationId) => {
    const { error } = await supabaseClient
      .from("profilesformations")
      .delete()
      .eq("id", formationId);

    if (error) {
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


 
  return (
    <div className="py-8 tableau">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">liste des demandes</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead>
            <tr>
              <th className="border">Formation</th>
              <th className="border">Lieu</th>
              <th className="border">Profil</th>
              <th className="border">Action</th>
            </tr>
          </thead>
          <tbody>
            {formations.map((formation) => (
              <tr key={formation.id}>
                <td className="border text-gray-500">{formationData.name}</td>
                <td className="border text-gray-500">{formationData.place}</td>
                <td className="border text-gray-500">{userData.username}</td>
                <td className="border text-center">
                  <button
                    className="bg-green-500 text-white py-1 px-4 rounded mr-2"
                    onClick={() => handleAcceptFormation(formation.id)}
                  >
                    Accepter
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-4 rounded"
                    onClick={() => handleCancelFormation(formation.id)}
                  >
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
