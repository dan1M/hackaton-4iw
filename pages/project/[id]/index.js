import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import ProfileProject from "@/components/projectview/ProfileProjects";
import Loader from "@/components/Loading";

export default function ViewProject() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setProject(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching project:", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full h-screen flex justify-center items-center -mt-24">
        {isLoading ? (
          <Loader />
        ) : project ? (
          <ProfileProject project={project} />
        ) : (
          <p>Project not found.</p>
        )}
      </div>
    </main>
  );
}
