import React from 'react';
import { Formik, Field, Form } from 'formik';
import {
    Input,
    Button,
    Heading,
    useToast,
    Container,
    FormLabel,
    InputGroup,
    FormControl,
    FormErrorMessage,
    InputRightElement,
} from '@chakra-ui/react'
import * as Yup from 'yup';
import { useRouter } from "next/router";
import Layout from '../../components/layout';

const SigninSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Required"),
    password: Yup.string()
        .min(8, "Password is too short")
        .max(50, "Password is too long")
        .required("Required"),
});

export default function SignIn() {
    const Toast = useToast()
    const router = useRouter();
    const [show, setShow] = React.useState(false)
    const showPassword = () => setShow(!show)
    return (
        <Layout>
            <Container maxWidth="container.md" marginTop="auto" marginBottom="auto" justifyContent={"center"} alignContent={"center"} textAlign={"center"}>
            <Heading as="h1" marginBottom="1rem">Sign In</Heading>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={SigninSchema}
                onSubmit={async (values, actions) => {
                    await fetch('http://localhost:5000/signin', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify(values)
                    })
                        .then(res => res.json())
                        .then(data => {
                            setTimeout(() => {
                                if (data.status_code === 401) {
                                    Toast({
                                        title: "Error",
                                        description: data.message,
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    })
                                }

                                if (data.status_code === 404) {
                                    Toast({
                                        title: "Error",
                                        description: data.message,
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                    })
                                }
                                
                                if (data.status_code === 200) {
                                    Toast({
                                        title: "Success",
                                        description: data.message,
                                        status: "success",
                                        duration: 5000,
                                        isClosable: true,
                                    })
                                    localStorage.setItem('session_token', data.session_token)
                                    router.push('/user')
                                }
                                actions.setSubmitting(false)
                            }, 1000)
                    })
                }}
            >
                {(props) => (
                    <Form style={{ border: '1px solid #e2e8f0', padding: '1rem' }}>
                        <Field name='email'>
                        {({ field, form }: { field: any, form: any }) => (
                            <FormControl isInvalid={form.errors.email && form.touched.email}>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <Input {...field} id='email' placeholder='Email' />
                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                            </FormControl>
                        )}
                        </Field>
                        <Field name='password'>
                        {({ field, form }: { field: any, form: any }) => (
                            <FormControl isInvalid={form.errors.password && form.touched.password}>
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                {...field}
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                />
                                <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={showPassword}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                            </FormControl>
                        )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                        Submit
                        </Button>
                    </Form>
                )}
                </Formik>
            </Container>
        </Layout>
    )
}
