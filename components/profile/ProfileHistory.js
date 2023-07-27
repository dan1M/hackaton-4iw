import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function ProfileHistory({ profile }) {
  const [user, setUser] = useState(null);
  const { supabaseClient } = useSessionContext();
  const [profileQuests, setProfileQuests] = useState([]);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }, []);

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
