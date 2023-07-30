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
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const { currentUser, updateCurrentUser } = useContext(AppContext);
  const [profile, setProfile] = useState(null);
  const [activePage, setActivePage] = useState("infos");
  const [displayModalQuestSuccess, setDisplayModalQuestSuccess] =
    useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select()
      .eq("id", id)
      .single();

    const { data: publicUrl } = await supabaseClient.storage
      .from("uploads")
      .getPublicUrl(`contents/${data.avatar_url}`);

    data.imageUrl = publicUrl.publicUrl;

    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    supabaseClient
      .channel("profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        async payload => {
          const { data: publicUrl } = await supabaseClient.storage
            .from("uploads")
            .getPublicUrl(`contents/${payload.new.avatar_url}`);
          const userUpdate = payload.new;
          userUpdate.imageUrl = publicUrl.publicUrl;

          setProfile(userUpdate);

          const dataUser = JSON.stringify(payload.new);
          sessionStorage.setItem("user", dataUser);
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  useEffect(() => {
    if (profile && profile.id) {
      checkQuestVisitProfile();
    }
  }, [profile]);

  const checkQuestVisitProfile = async () => {
    const { data: profilequests } = await supabaseClient
      .from("profilesquests")
      .select("*")
      .match({ profile_id: currentUser.id, type: "visit" });

    profilequests.map(async profilequest => {
      const { data: quest } = await supabaseClient
        .from("quests")
        .select("*")
        .match({ id: profilequest.quest_id });

      if (!profilequest.values.includes(profile.id)) {
        if (quest[0].number_to_do === profilequest.values.length + 1) {
          const shouldUpdateLvl = miseAJourNiveau(
            currentUser.xp_global,
            quest[0].xp
          );
          if (shouldUpdateLvl) {
            const { data, error } = await supabaseClient
              .from("profiles")
              .update({
                xp_global: currentUser.xp_global + quest[0].xp,
                lvl_global: currentUser.lvl_global + 1,
              })
              .eq("id", currentUser.id)
              .select();

            if (data) {
              sessionStorage.setItem("user", JSON.stringify(data[0]));
              updateCurrentUser(data[0]);
            }
          } else {
            const { data, error } = await supabaseClient
              .from("profiles")
              .update({
                xp_global: currentUser.xp_global + quest[0].xp,
              })
              .eq("id", currentUser.id)
              .select();

            if (data) {
              sessionStorage.setItem("user", JSON.stringify(data[0]));
              updateCurrentUser(data[0]);
            }
          }

          //update de la quete

          const { error } = await supabaseClient
            .from("profilesquests")
            .update({
              values: [...profilequest.values, profile.id],
              isDone: true,
            })
            .eq("id", profilequest.id);
          setDisplayModalQuestSuccess(true);
        } else {
          const { error } = await supabaseClient
            .from("profilesquests")
            .update({
              values: [...profilequest.values, profile.id],
            })
            .eq("id", profilequest.id);
        }
      }
    });
  };

  const customStylesQuestModal = {
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
      maxWidth: "550px",
      backgroundColor: "#282B2A",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
    },
  };

  const miseAJourNiveau = (xpTotalAvantQuete, xpQuete) => {
    const xpTotalApresQuete = xpTotalAvantQuete + xpQuete;
    const niveauAvantQuete = obtenirNiveau(xpTotalAvantQuete);
    const niveauApresQuete = obtenirNiveau(xpTotalApresQuete);

    if (niveauApresQuete > niveauAvantQuete) {
      return true;
    } else {
      return false;
    }
  };

  const obtenirNiveau = xp => {
    const xpParNiveau = 100;
    let niveau = 1;

    while (xp >= xpParNiveau) {
      xp -= xpParNiveau;
      niveau += 1;
    }

    return niveau;
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    const { data, error } = await supabaseClient.storage
      .from("uploads/contents")
      .upload(file.name, file);

    const { data: user } = await supabaseClient
      .from("profiles")
      .update({ avatar_url: file.name })
      .eq("id", profile.id)
      .select();
  };

  return (
    <main className="w-full text-white">
      <br />
      <Title text="Bonus" />
    </main>
  );
}
