import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ProfileEvent from '@/components/eventview/ProfileEvent';
import Loader from '@/components/Loading';

export default function ViewClient() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchEvent = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data, error } = await supabaseClient
        .from('events')
        .select("*")
        .eq('id', id)
        .single();
        console.log(data);

      if (data) {
        setEvent(data);
      }
    } catch (error) {
      console.error('Error fetching event:', error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full h-screen flex justify-center items-center -mt-24">
        {isLoading ? (
          <Loader />
        ) : event ? (
          <ProfileEvent event={event} />
        ) : (
          <p>Client not found.</p>
        )}
      </div>
    </main>
  );
}
