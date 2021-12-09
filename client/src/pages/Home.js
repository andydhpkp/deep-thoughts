import React from 'react';
//this allows us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> in App.js
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList'

const Home = () => {
  //use useQuery hook to make query request
  //the loading property allows us to conditionally render data based on whether or not there is data to even display
  const { loading, data } = useQuery(QUERY_THOUGHTS)

  //the weird syntax is called optional chaining. It negates the need to check if an object even exists before accessing its properties. 
  //this is saying if data exists, store it in the thoughts constant we just created, if data is undefined, save an empty array to the thoughts component
  const thoughts = data?.thoughts || [];
  console.log(thoughts)

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>{loading ? (
          <div>Loading...</div>
        ) : (
          <ThoughtList thoughts ={thoughts} title="Some Feed for Thought(s)..." />
        )}
        </div>
      </div>
    </main>
  );
};

export default Home;
