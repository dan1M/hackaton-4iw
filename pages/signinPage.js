import { Formik, Field, ErrorMessage, Form, Label} from "formik";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";


const SignInPage = () => {

    const [error, setError] = useState("");

  const initialeValues = {
    email: "",
    password: "",
    };

    const schema = Yup.object().shape({
        email: Yup
        .string()
        .email().
        required("Required"),
        password: Yup.string().required("Required"),
    });

    const handleFormsubmit = async (values) => {
        const { email, password } = values;
        const response = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.error) {
            setError(data.error);
        }
    };
    

return (
    <Formik
    initialValues={initialeValues}
    onSubmit={handleFormsubmit}
    validationSchema={schema}
  >
    {() => (
      <Form className="w-50">
        {error ? <p className="alert alert-danger">{error}</p> : null}
        <div className="mb-3">
          <label
            htmlFor="name"
            className="font-medium text-gray-700"
            placeholder="Your Name"
          >
            Name
          </label>

          <Field
             className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            type="text"
            name="name"
            placeholder="Your name"
          ></Field>
          <ErrorMessage
            component="span"
            className="text-danger"
            name="name"
          ></ErrorMessage>
          <br></br>
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

          <ErrorMessage
            component="span"
            className="text-danger"
            name="email"
            label="email"
          ></ErrorMessage>
          <br></br>
          {/* <label htmlFor="name" className="form-label">
            Sexe
          </label> */}
          <br></br>
          <Field
            className="form-control"
            label = "sexe"
            type="text"
            name="sexe"
            placeholder="Your gender"
          ></Field>
          <ErrorMessage
            component="span"
            className="text-danger"
            name="sexe"
          ></ErrorMessage>
          <br></br>
          <label htmlFor="dvvsvsdvsd"
           className="form-label"
           label="password"
           >
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
          Create Account
        </Button> */}
        <Link href="/login">
          {/* <a className="text-blue-500"> or Already have account ?</a> */}
        </Link>
      </Form>
    )}
  </Formik>
)
}

export default SignInPage;
