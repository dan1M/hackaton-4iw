
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

    setFormationData(data[0]);
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

    setUserData(data[0]);
  };

  const handleAcceptFormation = async (formationId) => {
    const { error } = await supabaseClient
      .from("profilesformations")
      .update({ status: "votre demande est accepter 😁 🤟🔥" })
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

  

  return (
    <div>
      <h1>Request List</h1>
      <table>
        <thead>
          <tr>
            <th>Formation</th>
            <th>Lieu</th>
            <th>Profil</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {formations.map((formation) => (
            <tr key={formation.id}>
              <td>{formationData.name}</td>
              <td>{formationData.place}</td>
              <td>{userData.username}</td>
              <td>
                <button onClick={() => handleAcceptFormation(formation.id)}>
                  Accepter
                </button>
                <button onClick={() => handleCancelFormation(formation.id)}>
                  Réfuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
