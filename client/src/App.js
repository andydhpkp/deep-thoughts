import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

//establish a new link to GraphQL server at /graphql
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

//instantiate the apollo client instance anc create the connection to the API endpoint
//instantiate a new cache object using new InMemoryCache()
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

function App() {
  
  return (
    //enable our application to interact with out Apollo client instance
    //Wrap everything in ApolloProvider because we're passing the client variable in as the value for the client prop in the provider, everything between the tags will eventually have access to the server's API through the client
    <ApolloProvider client={client}>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
