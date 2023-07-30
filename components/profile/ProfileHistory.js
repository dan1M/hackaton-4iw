import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function ProfileHistory({ profile }) {
  const { supabaseClient } = useSessionContext();
  const [profileQuests, setProfileQuests] = useState([]);

  useEffect(() => {
    if (profile) fetchProfileQuests();
  }, [profile]);

  const fetchProfileQuests = async () => {
    const { data, error } = await supabaseClient
      .from("profilesquests")
      .select("id, quests(*)")
      .eq("profile_id", profile.id)
      .eq("isDone", true);

    if (data) {
      console.log("Quetes accomplies : ", data);
      setProfileQuests(data);
    }
  };

  return (
    <section>
      <div className="py-8">
        <h1 className="text-2xl font-bold tracking-wide text-center mt-4">
          Quêtes accomplies
        </h1>
        <br />
        <div>
          {profileQuests.map(quest => {
            return (
              <>
                <br />
                <div className="grid grid-cols-3 gap-4">
                  <br />
                  <div
                    className="bg-white rounded-lg shadow-md p-4"
                    key={quest.id}
                  >
                    <h3 className="text-gray-600 font-semibold mb-2">
                      Name : {quest.quests.name}
                    </h3>
                    <p className="text-gray-600">
                      Difficulty: {quest.quests.difficulty}
                    </p>
                    <p className="text-gray-600">XP: {quest.quests.xp}</p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
}
