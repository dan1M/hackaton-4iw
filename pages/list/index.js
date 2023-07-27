import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import { useSessionContext } from "@supabase/auth-helpers-react";

const List = () => {
  const { supabaseClient } = useSessionContext();

  const [formations, setFormations] = useState([]);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    const { data, error } = await supabaseClient
      .from("profilesformations")
      .select("*");

    if (error) {
      console.error("Error fetching formations:", error);
    } else {
      setFormations(data);
    }
  };

  const handleAcceptFormation = async (formationId) => {
    const { error } = await supabaseClient
      .from("profilesformations")
      .update({ status: "accepted" })
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
      .update({ status: "cancelled" })
      .eq("id", formationId);

    if (error) {
      console.error("Error cancelling formation:", error);
    } else {
      fetchFormations();
    }
  };

  return (
    <div>
      <h1>Request List</h1>
      {formations.map((formation) => (
        <Card
          key={formation.id}
          title={formation.name}
          subtitle={formation.place}
          imageUrl={"next.svg"}
          onAccept={() => handleAcceptFormation(formation.id)}
          onCancel={() => handleCancelFormation(formation.id)}
          type="list"
        />
      ))}
    </div>
  );
};

export default List;
