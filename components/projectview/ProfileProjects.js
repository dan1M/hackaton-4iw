import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';

export default function ProfileProject({ project }) {
  const { supabaseClient } = useSessionContext();
  const [projectData, setProjectData] = useState(null);

  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*, client:client_id(name)')
        .eq('id', project.id);

      console.log(data);
      if (data) {
        setProjectData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching project:', error.message);
    }
  };

  useEffect(() => {
    showDetails();
  }, []);

  return (
    <div>
        <Title text='Détails du projet' />
      <div className='mt-12'>
      {projectData && (
        <div className="border rounded-lg shadow-md p-4">
          <div className="mb-4">
            <p className="text-lg font-bold">Nom du projet:</p>
            <p>{projectData.name}</p>
          </div>
          <div>
            <p className="text-lg font-bold">Date du projet:</p>
            <p>{projectData.created_at}</p>
          </div>
          <div>
           {projectData.client && (
            <div>
              <p className="text-lg font-bold">Client:</p>
              <p>{projectData.client.name}</p>
            </div>
          )}
          </div>
        </div>
      )}
      </div>
     
    </div>
  );
}
