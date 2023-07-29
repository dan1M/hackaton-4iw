import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Button from "@/components/Button";
import ProfileInfos from "@/components/profile/ProfileInfos";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileHistory from "@/components/profile/ProfileHistory";
import { AppContext } from "@/pages/_app";
import CustomModal from "@/components/CustomModal";

export default function Profile() {
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

      console.log("quest", quest);
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
      <CustomModal
        isOpen={displayModalQuestSuccess}
        onRequestClose={() => setDisplayModalQuestSuccess(false)}
        styles={customStylesQuestModal}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setDisplayModalQuestSuccess(false)}
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
                Félicitations vous avez terminé une quête !
              </h3>
              <Button
                text="Fermer"
                onClick={() => setDisplayModalQuestSuccess(false)}
              />
            </div>
          </div>
        </div>
      </CustomModal>
      <div className="w-full h-28 bg-opacity-10 bg-slate-300 flex relative ">
        <div className="flex items-center absolute -bottom-2/3 left-1/2 -translate-x-1/2 z-10">
          <div class="custom-file-input p-5">
            <input
              type="file"
              id="fileInput"
              class="input-file"
              onChange={handleFileChange}
            />
            <label for="fileInput" class="file-label">
              +
            </label>
          </div>

          {profile && profile.imageUrl && (
            <Image
              className="w-24 h-24 rounded-full shadow-lg bg-white"
              src={profile.avatar_url ? profile.imageUrl : "./next.svg"}
              alt=""
              width={50}
              height={50}
            />
          )}
          <div className="ml-4">
            <h2 className="text-white text-3xl font-semibold ">
              {profile?.full_name}
            </h2>
            <p className="text-sm text-slate-400 mt-1">{profile?.job_title}</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-xl h-1/3 flex-col mx-auto mt-24 justify-center">
        <ul className="flex justify-center text-sm font-medium text-center text-gray-500 dark:text-white">
          <li className="mr-2">
            <Button
              type={activePage === "infos" ? "active" : "unstyled"}
              onClick={() => setActivePage("infos")}
              text="Infos"
            />
          </li>
          <li className="mr-2">
            <Button
              type={activePage === "skill" ? "active" : "unstyled"}
              onClick={() => setActivePage("skill")}
              text="Compétences"
            />
          </li>
          <li className="mr-2">
            <Button
              onClick={() => setActivePage("quest")}
              type={activePage === "quest" ? "active" : "unstyled"}
              text="Quêtes accomplies"
            />
          </li>
        </ul>

        {activePage === "infos" && <ProfileInfos profile={profile} />}
        {activePage === "skill" && <ProfileSkills profile={profile} />}
        {activePage === "quest" && <ProfileHistory profile={profile} />}
      </div>
    </main>
  );
}
