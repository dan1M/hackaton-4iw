import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';

export default function ProfileEvent({ event }) {
  const { supabaseClient } = useSessionContext();
  const [projectData, setProjectData] = useState(null);

  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', event.id);

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
        <Title text="Détails de l'évènement" />
      <div className='mt-12'>
      {projectData && (
        <div className="border rounded-lg shadow-md p-4">
          <div className="mb-4">
            <p className="text-lg font-bold">Nom de l'évènement:</p>
            <p>{projectData.name}</p>
          </div>
          <div>
            <p className="text-lg font-bold">Date du projet:</p>
            <p>{projectData.place}</p>
          </div>
        </div>
      )}
      </div>
     
    </div>
  );
}
