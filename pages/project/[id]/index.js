import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ProfileProject from '@/components/projectview/ProfileProjects';

export default function ViewProject() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [project, setProject] = useState(null); 

  const fetchProject = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select("*")
        .eq('id', id)
        .single();
      if (data) {
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full max-w-xl h-1/3 flex-col mx-auto mt-24 justify-center">
        {project ? (
          <ProfileProject
            project={project} 
          />
        ) : (
          <p>Loading project details...</p>
        )}
      </div>
    </main>
  );
}
