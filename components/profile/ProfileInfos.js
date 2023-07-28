import { useSessionContext } from '@supabase/auth-helpers-react';
import { useContext, useEffect, useState } from 'react';
import Button from '../Button';
import { AppContext } from '@/pages/_app';

export default function ProfileInfos({ profile }) {
  const { currentUser } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({
      email: profile?.email,
      password: profile?.password,
      username: profile?.username,
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(formData)
      .eq('id', profile.id)
      .select();

    if (data) {
      setIsEditing(!isEditing);
    }
  };

  return (
    <section>
      <div className='py-8'>
        <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
          Infos
        </h1>
        <div>
          {profile && currentUser && profile.id === currentUser.id && (
            <div className='flex items-center'>
              <label
                htmlFor='full_name'
                className='block text-md font-semibold'
              >
                Nom&nbsp;complet&nbsp;:
              </label>
              <input
                type='text'
                name='full_name'
                defaultValue={profile?.full_name}
                id='full_name'
                className={
                  'text-md outline-none block w-full p-2.5 dark:bg-transparent ' +
                  (isEditing ? 'border-b-2 border-white' : 'border-none')
                }
                onChange={handleChange}
                readOnly={!isEditing}
                required
              />
            </div>
          )}
          <div className='flex items-center'>
            <label htmlFor='username' className='block text-md font-semibold'>
              Pseudo&nbsp;:
            </label>
            <input
              type='text'
              name='username'
              defaultValue={profile?.username}
              id='username'
              className={
                'text-md outline-none block w-full p-2.5 dark:bg-transparent ' +
                (isEditing ? 'border-b-2 border-white' : 'border-none')
              }
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='email' className='block text-md font-semibold'>
              Email&nbsp;:
            </label>
            <input
              type='text'
              name='email'
              defaultValue={profile?.email}
              id='email'
              className={
                'text-md outline-none block w-full p-2.5 dark:bg-transparent ' +
                (isEditing ? 'border-b-2 border-white' : 'border-none')
              }
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>
          {profile && currentUser && profile.id === currentUser.id && (
            <div className='flex items-center'>
              <label htmlFor='password' className='block text-md font-semibold'>
                Mot&nbsp;de&nbsp;passe&nbsp;:
              </label>
              <input
                type={!isEditing ? 'password' : 'text'}
                name='password'
                defaultValue={profile?.password}
                id='password'
                className={
                  'text-md outline-none block w-full p-2.5 dark:bg-transparent ' +
                  (isEditing ? 'border-b-2 border-white' : 'border-none')
                }
                onChange={handleChange}
                readOnly={!isEditing}
                required
              />
            </div>
          )}
        </div>
      </div>

      {profile && currentUser && profile.id === currentUser.id && (
        <>
          <div className='flex justify-center '>
            {!isEditing ? (
              <Button
                text='Modifier'
                onClick={() => setIsEditing(!isEditing)}
              />
            ) : (
              <div className='flex'>
                <Button text='Enregistrer' onClick={updateProfile} />
                <Button
                  text='Annuler'
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setFormData({
                      email: profile?.email,
                      password: profile?.password,
                      username: profile?.username,
                    });
                  }}
                />
              </div>
            )}
          </div>

          <div className='py-8'>
            <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
              Paramètres
            </h1>
          </div>
        </>
      )}
    </section>
  );
}
