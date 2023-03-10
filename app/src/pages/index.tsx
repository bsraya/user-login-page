import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout';
import { Button, Heading, Container } from '@chakra-ui/react';

export default function Home({ user }: any) {
  console.log(user);
  return (
    <Layout>
      <Container>
        <Heading>
          You are not logged in.
        </Heading>
        <Link href="/signin">
          <Button>
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button>
            Sign Up
          </Button>
        </Link>
      </Container>  
    </Layout>
  )
}