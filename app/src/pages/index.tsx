import React from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Formik, Field, Form } from 'formik';
import {
  Flex,
  Input,
  Button,
  Heading,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import * as Yup from 'yup';

const inter = Inter({ subsets: ['latin'] })

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name is too short")
    .max(50, "First name is too long")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Last name is too short")
    .max(50, "Last name is too long")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(8, "Password is too short")
    .max(50, "Password is too long")
    .required("Required"),
});

export default function Home() {
  const [show, setShow] = React.useState(false)
  const showPassword = () => setShow(!show)
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <Flex width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"}>
          <Container maxWidth="container.md" marginTop="auto" marginBottom="auto" justifyContent={"center"} alignContent={"center"} textAlign={"center"}>
            <Heading as="h1" marginBottom="1rem">Sign Up</Heading>
            <Formik
              initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
              validationSchema={SignupSchema}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2))
                  actions.setSubmitting(false)
                }, 1000)
              }}
            >
              {(props) => (
                <Form style={{ border: '1px solid #e2e8f0', padding: '1rem' }}>
                  <Field name='firstName'>
                    {({ field, form }: { field: any, form: any }) => (
                      <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                        <FormLabel htmlFor='firstName'>First Name</FormLabel>
                        <Input {...field} id='firstName' placeholder='First name' />
                        <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='lastName'>
                    {({ field, form }: { field: any, form: any }) => (
                      <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                        <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                        <Input {...field} id='lastName' placeholder='Last name' />
                        <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
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
          </Flex>
      </main>
    </>
  )
}