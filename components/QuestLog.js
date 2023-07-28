import { AppContext } from '@/pages/_app';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useContext, useEffect, useState } from 'react';
import Card from './Card';

export default function QuestLog() {
  const { currentUser } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();
  const [userQuests, setUserQuests] = useState([]);
  useEffect(() => {
    supabaseClient
      .channel('profilesquests')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profilesquests',
        },
        (payload) => {
          // update userQuests with id of payload.new
          const index = userQuests.findIndex(
            (userQuest) => userQuest.id === payload.new.id
          );
          const newUserQuests = [...userQuests];
          newUserQuests[index] = payload.new;
          setUserQuests(newUserQuests);
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    if (currentUser) fetchUserQuests();
  }, [currentUser]);

  const fetchUserQuests = async () => {
    const { data, error } = await supabaseClient
      .from('profilesquests')
      .select('*, quests(*)')
      .eq('profile_id', currentUser.id)
      .eq('isDone', false);

    if (data) {
      console.log(data);
      setUserQuests(data);
    }
  };

  return (
    <div className='absolute bg-primary bg-opacity-30 h-full w-1/6 right-0  text-white px-4'>
      <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
        Quêtes en cours
      </h1>
      <h2 className='text-xl font-bold mt-2'>Journalière</h2>
      {userQuests.map((quest) => {
        return (
          quest.quests.frequency === 'journa' && (
            <Card key={quest.id} quest={quest} type='quests' />
          )
        );
      })}
      <h2 className='text-xl font-bold mt-2'>Hebdomadaire</h2>
      {userQuests.map((quest) => {
        return (
          quest.quests.frequency === 'hebdo' && (
            <Card key={quest.id} quest={quest} type='quests' />
          )
        );
      })}
    </div>
  );
}
