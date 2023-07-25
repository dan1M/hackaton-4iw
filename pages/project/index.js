import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/Button';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});

const ProjectPage = () => {
  const { supabaseClient } = useSessionContext();
  const user = useUser();
  const [data, setData] = useState([]);
  const [editProjectId, setEditProjectId] = useState(null);

  const fetchProjectData = async () => {
    try {
      const { data } = await supabaseClient.from('projects').select('*');
      setData(data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjectData();
    }
  }, [user, supabaseClient]);

  const handleCreateProject = async (values) => {
    try {
      const { data, error } = await supabaseClient.from('projects').insert(values);
      if (error) {
        console.error('Error creating project:', error);
      } else {
        console.log('Project created successfully:', data);
        fetchProjectData();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = (projectId) => {
    setEditProjectId(projectId);
  };

  const handleUpdateProject = async (values) => {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .update(values)
        .eq('id', editProjectId);
      if (error) {
        console.error('Error updating project:', error);
      } else {
        console.log('Project updated successfully:', data);
        setEditProjectId(null);
        fetchProjectData();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const { error } = await supabaseClient.from('projects').delete().eq('id', projectId);
      if (error) {
        console.error('Error deleting project:', error);
      } else {
        console.log('Project deleted successfully');
        fetchProjectData();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <>
      {data.map((project) => (
        <div key={project.id}>
          {editProjectId === project.id ? (
            <Formik
              initialValues={{ name: project.name }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleUpdateProject({ ...values, id: project.id });
              }}
            >
              <Form>
                <div>
                  <label htmlFor='name'>Name:</label>
                  <Field type='text' name='name' />
                  <ErrorMessage name='name' component='div' className='error' />
                </div>
                <Button type='submit' text='Save' />
              </Form>
            </Formik>
          ) : (
            <>
              <h2>{project.name}</h2>
              <button onClick={() => handleEditProject(project.id)}>Edit</button>
              <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleCreateProject(values);
          resetForm();
        }}
      >
        <Form>
          <div>
            <label htmlFor='name'>Name:</label>
            <Field type='text' name='name' />
            <ErrorMessage name='name' component='div' className='error' />
          </div>
          <Button type='submit' text='Create' />
        </Form>
      </Formik>
    </>
  );
};

export default ProjectPage;
