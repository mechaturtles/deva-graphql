const { graphql, buildSchema } = require('graphql');

// Define the schema
const schema_string = `
  type Artist {
    id: ID!
    name: String!
  }
  
  type Query {
    artists: [Artist]!
  }
`
const schema = buildSchema(schema_string);

// Mock data
const artists = [
  {
    id: "A1B",
    name: "Sales"
  }
];

const releaseGroups = [
  {
    id: "R1C",
    title: "Sales LP",
    artistId: "A1B"
  },
  {
    id: "R2D", 
    title: "Forever & Ever",
    artistId: "A1B"
  }
];

const releases = [
  { id: "X1Y", title: "Chinese New Year", duration_ms: 180000, releaseGroupId: "R1C" },
  { id: "X2Z", title: "Renee", duration_ms: 210000, releaseGroupId: "R1C" },
  { id: "X3W", title: "Forever & Ever", duration_ms: 200000, releaseGroupId: "R2D" },
  { id: "X4V", title: "Talk a Lot", duration_ms: 190000, releaseGroupId: "R2D" }
];

// Resolver function
const root = {
  artists() {
    return artists;
  },
};

// Example query
const query = `
  query {
    artists {
      id
      name
    }
  }
`

// Execute the query
graphql({ schema, source: query, rootValue: root }).then((response) => {
  console.log(JSON.stringify(response, null, 2));
});
