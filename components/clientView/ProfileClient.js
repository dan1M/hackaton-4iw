import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Title from '@/components/Title';

export default function ProfileEvent({ client }) {
  const { supabaseClient } = useSessionContext();
  const [clientData, setClientData] = useState(null);

  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('clients')
        .select('*')
        .eq('id', client.id);
        console.log(client.id);

        
      console.log(data);
      if (data) {
        setClientData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching client:', error.message);
    }
  };

  useEffect(() => {
    showDetails();
  }, []);

  return (
    <div className='mt-12'>
        <Title text='Détails du client' />
      <div>
            {clientData && (
                <div className="border rounded-lg shadow-md p-4">
                <div className="mb-4">
                    <p className="text-lg font-bold">Nom du projet:</p>
                    <p>{clientData.name}</p>
                </div>
                </div>     
            )}     
         </div>
     
    </div>
  );
}
