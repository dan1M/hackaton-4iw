import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';

export default function ProfileFormation({ formation }) {
  const { supabaseClient } = useSessionContext();
  const [formationData, setFormationData] = useState(null);

  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('formations')
        .select('*')
        .eq('id', formation.id);

      console.log(data);
      if (data) {
        setFormationData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching formation:', error.message);
    }
  };

  useEffect(() => {
    showDetails();
  }, []);

  return (
    <div className="shadow-md rounded-lg p-6">
      <Title text="Détails de la formation" />

      <div className="mt-8">
        {formationData ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="transition-transform transform hover:scale-95 focus:outline-none focus:ring">
              <p className="text-lg font-bold">Nom de la formation</p>
              <p>{formationData.name}</p>
              <div className="border-t mt-4 pt-4">
                <p className="text-lg font-bold">Lieu</p>
                <p>{formationData.place}</p>
              </div>
            </div>
            <div className="transition-transform transform hover:scale-95 focus:outline-none focus:ring">
              <p className="text-lg font-bold">Temps</p>
              <p>{formationData.duration}</p>
              <div className="border-t mt-4 pt-4">
                <p className="text-lg font-bold">Date de la mise à jour</p>
                <p>{formationData.created_at}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Chargement des détails...</p>
        )}
      </div>
    </div>
  );
}
