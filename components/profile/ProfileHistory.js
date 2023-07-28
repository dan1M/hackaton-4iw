import { AppContext } from '@/pages/_app';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useContext, useEffect, useState } from 'react';

export default function ProfileHistory({ profile }) {
  const { currentUser } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();
  const [profileQuests, setProfileQuests] = useState([]);

  useEffect(() => {
    if (profile) fetchProfileQuests();
  }, [profile]);

  const fetchProfileQuests = async () => {
    const { data, error } = await supabaseClient
      .from('profilesquests')
      .select('id, quests(*)')
      .eq('profile_id', profile.id)
      .eq('isDone', true);

    if (data) {
      console.log(data);
      setProfileQuests(data);
    }
  };

  return (
    <section>
      <div className='py-8'>
        <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
          Quêtes accomplies
        </h1>
        <div>
          {profileQuests.map((quest) => {
            return <div key={quest.id}>{quest.quests.name}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
