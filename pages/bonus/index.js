import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Button from "@/components/Button";
import ProfileInfos from "@/components/profile/ProfileInfos";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileHistory from "@/components/profile/ProfileHistory";
import { AppContext } from "@/pages/_app";
import Title from "@/components/Title";

export default function Bonus() {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  useState(false);
  const [bonus, setBonus] = useState();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchBonus();
  }, []);
  const fetchBonus = async () => {
    const { data, error } = await supabaseClient.from("bonus").select("*");

    if (data) {
      console.log(data);
      setBonus(data);
    }
  };

  return (
    <main className="p-4 w-4/5 text-white">
      <br />
      <Title text="Bonus" />
      <div className="flex flex-col flex-wrap justify-center items-center">
        {bonus &&
          bonus.map(bonus => {
            return (
              <div className="border p-4 m-2 flex flex-col" key={bonus.id}>
                {" "}
                {/* Ajout de "flex flex-col" pour afficher les éléments en colonne */}
                <div>{bonus.name}</div>
                <div>{bonus.description}</div>
                <div>{bonus.lvl_bonus}</div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
