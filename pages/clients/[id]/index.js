import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ProfileClient from '@/components/clientView/ProfileClient';

export default function ViewClient() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [client, setClient] = useState(null); 

  const fetchClient = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('clients')
        .select("*")
        .eq('id', id)
        .single();
    console.log(data);
      if (data) {
        setClient(data);
      }
    } catch (error) {
      console.error('Error fetching client:', error.message);
    }
  };

  useEffect(() => {
    if (id) {
        fetchClient();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full max-w-xl h-1/3 flex-col mx-auto mt-24 justify-center">
        {client ? (
          <ProfileClient
            client={client} 
          />
        ) : (
          <p>Loading project details...</p>
        )}
      </div>
    </main>
  );
}
