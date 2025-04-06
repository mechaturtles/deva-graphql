import React from 'react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { graphql } from 'graphql';
import { schema, root } from './schema';
import 'graphiql/graphiql.css';

// Create a fetcher that executes queries locally
const fetcher = createGraphiQLFetcher({
  url: '/graphql',
  fetch: async (url, options) => {
    const { query, variables } = JSON.parse(options.body as string);
    const result = await graphql({ 
      schema, 
      source: query, 
      variableValues: variables,
      rootValue: root 
    });
    return new Response(JSON.stringify(result));
  }
});

export const App: React.FC = () => (
  <div style={{ height: '100vh' }}>
    <GraphiQL fetcher={fetcher} />
  </div>
); 