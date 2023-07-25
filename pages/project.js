
import { useUser, useSessionContext} from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  create_at: Yup.string().required('date is required'),
});
const initialValues = {
    name: '',
    create_at: '',
    };

const LoginPage = () => {
  const{ supabaseClient} = useSessionContext();
  const user = useUser();
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchProjectData() {
      try {

        // const { data } = await supabaseClient.from('projects').select('*').limit(5);
        //insert
     const { data } = await supabaseClient.from('projects').insert('*').limit(5);
                       
        if (data.length > 0) {
        
          const { name, create_at } = data[0];
          setData({ name, create_at });
        }
        confirm.log(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    }

  
    if (user) fetchProjectData();
  }, [user, supabaseClient]);
    
  return (
    <>
      

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
  
          console.log(values);
        }}
      >
        <Form>
          <div>
            <label htmlFor="name">Name:</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="create_at">create at:</label>
            <Field type="date" name="create_at" />
            <ErrorMessage name="create_at" component="div" className="error" />
          </div>

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
};

export default LoginPage;
