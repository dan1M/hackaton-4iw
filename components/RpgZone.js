import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import Button from './Button';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { AppContext } from '@/pages/_app';

export default function RpgZone() {
  const { supabaseClient } = useSessionContext();
  const { currentUser, updateCurrentUser } = useContext(AppContext);
  const [actualXp, setActualXp] = useState(0);
  const XP_PER_LVL = 100;

  useEffect(() => {
    if (currentUser) {
      calculateActualXp(currentUser.xp_global, currentUser.lvl_global);
    }
  }, [currentUser]);

  const calculateActualXp = (xpGlobal, actual_lvl) => {
    const actualXp = xpGlobal - (actual_lvl - 1) * XP_PER_LVL;
    setActualXp(actualXp);
  };

  const addXpToUser = async () => {
    const xpToAdd = 10;

    if (currentUser) {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update({ xp_global: currentUser.xp_global + xpToAdd })
        .eq('id', currentUser.id)
        .select();

      if (data) {
        sessionStorage.setItem('user', JSON.stringify(data[0]));
        updateCurrentUser(data[0]);
      }
    }
  };

  return (
    <div className='fixed bottom-0 right-0 rounded-lg w-4/5 h-20 bg-white'>
      <div className='flex items-center h-full max-w-5xl mx-auto'>
        <Image
          className='w-16 h-16 rounded-full mr-8 shadow-lg'
          src={currentUser?.avatar_url ?? '/next.svg'}
          alt=''
          width={16}
          height={16}
        />

        <p className='text-sm mr-2'>
          Nv.&nbsp;{currentUser && currentUser.lvl_global}
        </p>
        <div className='w-full'>
          <div className='w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 relative'>
            <div
              className='bg-green-600 h-3 rounded-full dark:bg-green-500 relative transition-all duration-300'
              style={{
                width: `${(actualXp / XP_PER_LVL) * 100}%`,
                maxWidth: '100%',
              }}
            >
              {(actualXp / XP_PER_LVL) * 100 > 0 &&
                (actualXp / XP_PER_LVL) * 100 < 100 && (
                  <p className='text-xs mr-2 absolute right-0 top-0 leading-none text-white'>
                    {actualXp}
                  </p>
                )}
            </div>
            <p className='text-xs mr-2 absolute right-0 top-0 leading-none text-white'>
              {XP_PER_LVL}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
