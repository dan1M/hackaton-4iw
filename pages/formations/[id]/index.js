import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ProfileFormation from '@/components/formationview/ProfileFormation';
import Loader from '@/components/Loading';

export default function ViewClient() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [formation, setFormation] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchFormation = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data, error } = await supabaseClient
        .from('formations')
        .select("*")
        .eq('id', id)
        .single();

      if (data) {
        setFormation(data);
      }
    } catch (error) {
      console.error('Error fetching formation:', error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (id) {
        fetchFormation();
    }
  }, [id]);

  return (
    <main className="w-full text-white">
      <div className="w-full h-screen flex justify-center items-center -mt-24">
        {isLoading ? (
          <Loader />
        ) : formation ? (
          <ProfileFormation formation={formation} />
        ) : (
          <p>Client not found.</p>
        )}
      </div>
    </main>
  );
}
