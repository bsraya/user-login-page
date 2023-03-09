import { Button, Heading, Container } from '@chakra-ui/react';
import React from 'react';
import Layout from '../../components/layout';
import Link from 'next/link';

export default function Home() {
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
