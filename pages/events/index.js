import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/Button';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  place: Yup.string().required('place is required'),
});

const EventPage = () => {
  const { supabaseClient } = useSessionContext();
  const user = useUser();
  const [data, setData] = useState([]);
  const [editEventId, setEditEventId] = useState(null);

  const fetchEventData = async () => {
    try {
      const { data } = await supabaseClient.from('events').select('*');
      setData(data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEventData();
    }
  }, [user, supabaseClient]);

  const handleCreateEvent = async (values) => {
    try {
      const { data, error } = await supabaseClient.from('events').insert(values);
      if (error) {
        console.error('Error creating event:', error);
      } else {
        console.log('Event created successfully:', data);
        fetchEventData();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = (eventId) => {
    setEditEventId(eventId);
  };

  const handleUpPlaceEvent = async (values) => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .update(values)
        .eq('id', editEventId);
      if (error) {
        console.error('Error updating event:', error);
      } else {
        console.log('Event updated successfully:', data);
        setEditEventId(null);
        fetchEventData();
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const { error } = await supabaseClient.from('events').delete().eq('id', eventId);
      if (error) {
        console.error('Error deleting event:', error);
      } else {
        console.log('Event deleted successfully');
        fetchEventData();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <>
      {data.map((event) => (
        <div key={event.id}>
          {editEventId === event.id ? (
            <Formik
              initialValues={{ name: event.name, place: event.place }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleUpPlaceEvent({ ...values, id: event.id });
              }}
            >
              <Form>
                <div>
                  <label htmlFor='name'>Name:</label>
                  <Field type='text' name='name' />
                  <ErrorMessage name='name' component='div' className='error' />
                </div>
                <div>
                  <label htmlFor='place'>Place:</label>
                  <Field type='text' name='place' />
                  <ErrorMessage name='place' component='div' className='error' />
                </div>
                <Button type='submit' text='Save' />
              </Form>
            </Formik>
          ) : (
            <>
              <h2>{event.name}</h2>
              <p>{event.place}</p>
              <button onClick={() => handleEditEvent(event.id)}>Edit</button>
              <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
      <Formik
        initialValues={{ name: '', place: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleCreateEvent(values);
          resetForm();
        }}
      >
        <Form>
          <div>
            <label htmlFor='name'>Name:</label>
            <Field type='text' name='name' />
            <ErrorMessage name='name' component='div' className='error' />
          </div>
          <div>
            <label htmlFor='place'>Place:</label>
            <Field type='text' name='place' />
            <ErrorMessage name='place' component='div' className='error' />
          </div>
          <Button type='submit' text='Create' />
        </Form>
      </Formik>
    </>
  );
};

export default EventPage;
