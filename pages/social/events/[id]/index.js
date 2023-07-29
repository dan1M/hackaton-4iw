import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ProfileEvent from '@/components/eventview/ProfileEvent';

export default function ViewEvent() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [event, setEvent] = useState(null); 

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .select("*")
        .eq('id', id)
        .single();
      if (data) {
        setEvent(data);
      }
    } catch (error) {
      console.error('Error fetching event:', error.message);
    }
  };

  useEffect(() => {
    if (id) {
        fetchEvent();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full max-w-xl h-1/3 flex-col mx-auto mt-24 justify-center">
        {event ? (
          <ProfileEvent
            project={event} 
          />
        ) : (
          <p>Loading event details...</p>
        )}
      </div>
    </main>
  );
}
