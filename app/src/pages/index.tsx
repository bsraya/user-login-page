import { Button, Heading, Container } from '@chakra-ui/react';
import React from 'react';
import Layout from '../../components/layout';

export default function Home() {
  return (
    <Layout>
      <Container>
        <Heading>
          You are not logged in.
        </Heading>
        <Button>Sign In</Button>
        <Button>Sign Up</Button>
      </Container>
      
    </Layout>
  )
}
