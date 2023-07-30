import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';

export default function ProfileEvent({ event }) {
  const { supabaseClient } = useSessionContext();
  const [eventData, setEventData] = useState(null);

  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', event.id);

      if (data) {
        setEventData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching event:', error.message);
    }
  };

  useEffect(() => {
    showDetails();
  }, []);

  return (
    <div className="shadow-md rounded-lg p-6">
      <Title text="Détails de l'évènement" />

      <div className="mt-8">
        {eventData ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="transition-transform transform hover:scale-95 focus:outline-none focus:ring">
              <p className="text-lg font-bold">Nom de l'évènement</p>
              <p>{eventData.name}</p>
              <div className="border-t mt-4 pt-4">
                <p className="text-lg font-bold">Lieu</p>
                <p>{eventData.place}</p>
              </div>
            </div>
            <div className="transition-transform transform hover:scale-95 focus:outline-none focus:ring">
              <p className="text-lg font-bold">Date</p>
              <p>{eventData.created_at}</p>
              <div className="border-t mt-4 pt-4">
                
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
