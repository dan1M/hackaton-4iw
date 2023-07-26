import { useEffect, useState } from 'react';
import Button from '../Button';
import { useSessionContext } from '@supabase/auth-helpers-react';

export default function FormProject({ id, triggerFetch }) {
  const { supabaseClient } = useSessionContext();
  const [formData, setFormData] = useState({
    name: '',
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setFormData({ name: data.name });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateProject = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient
      .from('projects')
      .update({ name: formData.name })
      .eq('id', id)
      .select();

    if (data) {
      triggerFetch();
    }
  };

  return (
    <div className='px-6 py-6 lg:px-8'>
      <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>
        Modifier un projet
      </h3>
      <form className='space-y-6' onSubmit={updateProject}>
        {
          <div>
            <label
              htmlFor='name'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              className='bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white'
              placeholder='Name'
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>
        }

        <Button text='Modifier un projet' type='submit' />
      </form>
    </div>
  );
}
