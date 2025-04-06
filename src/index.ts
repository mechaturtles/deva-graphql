import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

// Define a simple query type
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL!'
    }
  }
});

// Create the schema
const schema = new GraphQLSchema({
  query: QueryType
});

// Export the schema and types
export { schema, QueryType }; 