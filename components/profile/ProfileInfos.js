import { useSessionContext } from '@supabase/auth-helpers-react';
import { useState } from 'react';

export default function ProfileInfos({ profile }) {
  const { supabaseClient } = useSessionContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    console.log('update profile');
  };
  console.log('profile:', formData);
  return (
    <section>
      <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
        Infos
      </h1>
      <div>
        <div>
          <label
            htmlFor='email'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Email
          </label>
          <input
            type='text'
            name='email'
            defaultValue={profile?.email}
            id='email'
            className='text-sm rounded-lg outline-none block w-full p-2.5 dark:bg-transparent dark:placeholder-gray-400 '
            placeholder='Email'
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </section>
  );
}
