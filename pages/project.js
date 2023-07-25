import {Formik, Form, Field, ErrorMessage} from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'



const Project = () => {
    const [message] = useState('')
    const [submitted] = useState(false)
    const [error, setError] = useState(false);

    const initialValues = {
        name: '',
        create_at: '',
    }

    const schema = Yup.object({
        name: Yup.string().required('Required'),
        create_at: Yup.string().required('Required'),
        message: Yup.string().required('Required')
    })

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/project/${id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!data) {
                throw new Error('Something went wrong')
            }
            setError(false)
        } catch (error) {
            setError(true)
        }
    }

    const handleUpdate = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000${id}`, {
                method: 'PUT'
            })
            const data = await res.json()
            if (!data) {
                throw new Error('Something went wrong')
            }
            setError(false)
        } catch (error) {
            setError(true)
        }
    }

    const handleSubmit = async (values, onSubmitProps) => {
        try {
            const res = await fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            const data = await res.json()
            if (!data) {
                throw new Error('Something went wrong')
            }
            onSubmitProps.resetForm()
            setError(false)
        } catch (error) {
            setError(true)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-5xl font-bold">Project</h1>
                <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={schema}
            >
            {() => (
                <Form className="w-50">
                {error ? <p className="alert alert-danger">{error}</p> : null}
                <div className="mb-3">
                    <label
                    htmlFor="name"
                    className="form-label"
                    placeholder="Your Name"
                    >
                    Email
                    </label>
                    <Field
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    ></Field>
                    <br></br>
                    <ErrorMessage
                    component="span"
                    className="text-danger"
                    name="sexe"
                    ></ErrorMessage>
                    <br></br>
                    <label htmlFor="name" className="form-label">
                    Password
                    </label>
                    <Field
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    ></Field>
                    <ErrorMessage
                    component="span"
                    className="text-danger"
                    name="password"
                    ></ErrorMessage>
                </div>
                {/* <Button type="submit" className="btn btn-primary">
                    Log In
                </Button> */}
                {/* <button type="submit" className="btn btn-primary"> */}
                <button type="submit"class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                   Button
                </button>
                </Form>
            )}
            </Formik>
        </div>
    )
}

export default Project