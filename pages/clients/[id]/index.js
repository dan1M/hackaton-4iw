import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ProfileClient from '@/components/clientView/ProfileClient';
import Loader from '@/components/Loading';

export default function ViewClient() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchClient = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data, error } = await supabaseClient
        .from('clients')
        .select("*")
        .eq('id', id)
        .single();

      if (data) {
        setClient(data);
      }
    } catch (error) {
      console.error('Error fetching client:', error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full h-screen flex justify-center items-center -mt-24">
        {isLoading ? (
          <Loader />
        ) : client ? (
          <ProfileClient client={client} />
        ) : (
          <p>Client not found.</p>
        )}
      </div>
    </main>
  );
}
