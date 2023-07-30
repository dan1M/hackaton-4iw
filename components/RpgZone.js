import { ProgressBar } from "./ProgressBar";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { AppContext } from "@/pages/_app";

export default function RpgZone() {
  const { supabaseClient } = useSessionContext();
  const { currentUser, updateCurrentUser } = useContext(AppContext);
  const [actualXp, setActualXp] = useState(0);
  const XP_PER_LVL = 100;

  useEffect(() => {
    if (currentUser) {
      getImageUser();
      calculateActualXp(currentUser.xp_global, currentUser.lvl_global);
    }
  }, [currentUser]);

  const getImageUser = async () => {
    const { data: publicUrl } = await supabaseClient.storage
      .from("uploads")
      .getPublicUrl(`contents/${currentUser.avatar_url}`);
    currentUser.imageUrl = publicUrl.publicUrl;
  };

  const calculateActualXp = (xpGlobal, actual_lvl) => {
    const actualXp = xpGlobal - (actual_lvl - 1) * XP_PER_LVL;
    setActualXp(actualXp);
  };

  return (
    <div className="fixed bottom-0 right-0 rounded-lg w-4/5 h-20 bg-white">
      <div className="flex items-center h-full max-w-5xl mx-auto">
        {currentUser && (
          <Image
            className="w-16 h-16 rounded-full mr-8 shadow-lg"
            src={currentUser?.imageUrl ?? "/noImage.jpeg"}
            alt=""
            width={50}
            height={50}
          />
        )}

        <p className="text-sm mr-2">
          Nv.&nbsp;{currentUser && currentUser.lvl_global}
        </p>
        <ProgressBar value={actualXp} maxValue={XP_PER_LVL} />
      </div>
    </div>
  );
}
