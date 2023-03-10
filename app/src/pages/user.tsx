import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout';
import { Container } from '@chakra-ui/react';

export default function Home({ user }: any) {
  console.log(user);
  return (
    <Layout>
      <Container>
        {user}
      </Container>  
    </Layout>
  )
}

// get the user info by sending the session token to the backend /token endpoint
// if the token is valid, the backend will return the user info
// if the token is invalid, the backend will return an error
// if the token is expired, the backend will return an error
export async function getServerSideProps() {
  const session_token = localStorage.getItem('session_token');
  console.log(session_token)
  const res = await fetch(`http://localhost:5000/token/${session_token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (data.status_code === 401) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }
  return {
    props: {
      user: data.user
    }
  }
}