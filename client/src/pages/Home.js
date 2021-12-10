import React from 'react';
//this allows us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> in App.js
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import Auth from '../utils/auth';
import FriendList from '../components/FriendList';

const Home = () => {
  //use useQuery hook to make query request
  //the loading property allows us to conditionally render data based on whether or not there is data to even display
  const { loading, data } = useQuery(QUERY_THOUGHTS)

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  //the weird syntax is called optional chaining. It negates the need to check if an object even exists before accessing its properties. 
  //this is saying if data exists, store it in the thoughts constant we just created, if data is undefined, save an empty array to the thoughts component
  const thoughts = data?.thoughts || [];
  console.log(thoughts)

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
          {loggedIn && userData ? (
            <div className="col-12 col-lg-3 mb-3">
              <FriendList
                username={userData.me.username}
                friendCount={userData.me.friendCount}
                friends={userData.me.friends}
              />
            </div>
          ) : null}
      </div>
    </main>
  );
};

export default Home;
