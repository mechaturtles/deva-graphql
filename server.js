const { graphql, buildSchema } = require('graphql');

// Define the schema
const schema = buildSchema(`
  type Query {
    artists(where: ArtistWhereInput): [Artist]
  }

  input ArtistWhereInput {
    id: IDFilter
  }

  input IDFilter {
    _eq: String
  }

  type Artist {
    id: String
    name: String
    release_groups: [ReleaseGroup]
  }

  type ReleaseGroup {
    id: String
    title: String
    releases: [Release]
  }

  type Release {
    id: String
    title: String
    duration_ms: Int
  }
`);

// Mock data
const mockData = [
  {
    id: "A1B",
    name: "Sales",
    release_groups: [
      {
        id: "R1C",
        title: "Sales LP",
        releases: [
          { id: "X1Y", title: "Chinese New Year", duration_ms: 180000 },
          { id: "X2Z", title: "Renee", duration_ms: 210000 },
        ],
      },
      {
        id: "R2D",
        title: "Forever & Ever",
        releases: [
          { id: "X3W", title: "Forever & Ever", duration_ms: 200000 },
          { id: "X4V", title: "Talk a Lot", duration_ms: 190000 },
        ],
      },
    ],
  },
];

// Resolver function
const root = {
  artists: ({ where }) => {
    if (where?.id?._eq) {
      return mockData.filter((artist) => artist.id === where.id._eq);
    }
    return [];
  },
};

// Example query
const query = `
  query {
    artists(where: { id: { _eq: "A1B" } }) {
      id
      name
      release_groups {
        id
        title
        releases {
          id
          title
          duration_ms
        }
      }
    }
  }
`;

// Execute the query
graphql({ schema, source: query, rootValue: root }).then((response) => {
  console.log(JSON.stringify(response, null, 2));
});
