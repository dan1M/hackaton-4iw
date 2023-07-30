import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';
import Loader from '@/components/Loading';
import moment from 'moment';

export default function ProfileProject({ project }) {
  const { supabaseClient } = useSessionContext();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*, client:client_id(name)')
        .eq('id', project.id);

      console.log(data);
      if (data) {
        setProjectData(data[0]);
        setIsLoading(false); 
      }
    } catch (error) {
      console.error('Error fetching project:', error.message);
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    showDetails();
  }, []);

  return (
    <div className="shadow-md rounded-lg p-6">
      <Title text="Détails du projet" />

      <div className="mt-8">
        {isLoading ? ( 
          <Loader />
        ) : (
          <div className="border rounded-lg shadow-md p-4 transform transition-transform hover:scale-95">
            <div className="mb-4 border-b pb-4">
              <p className="text-lg font-bold">Nom du projet:</p>
              <p>{projectData.name}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-lg font-bold">Date du projet:</p>
              <p>{moment(projectData.created_at).format('DD/MM/YYYY HH:mm:ss')}</p>
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
