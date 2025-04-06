import { buildSchema } from 'graphql';

// GraphQL Schema Definition
export const schema = buildSchema(`
  # Artist represents a musical artist/band
  type Artist {
    id: ID!
    name: String!
  }

  # ReleaseGroup represents an album or EP
  type ReleaseGroup {
    id: ID!
    title: String!
    artistId: ID!
  }

  # Release represents a specific track/song
  type Release {
    id: ID!
    title: String!
    duration_ms: Int!
    releaseGroupId: ID!
  }
  
  # Root Query type
  type Query {
    artists: [Artist]!
    releaseGroups: [ReleaseGroup]!
    releases: [Release]!
  }
`);

// Mock Data Store
interface Artist {
  id: string;
  name: string;
}

interface ReleaseGroup {
  id: string;
  title: string;
  artistId: string;
}

interface Release {
  id: string;
  title: string;
  duration_ms: number;
  releaseGroupId: string;
}

// Mock Data
const artists: Artist[] = [
  {
    id: "A1B",
    name: "Sales"
  }
];

const releaseGroups: ReleaseGroup[] = [
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

const releases: Release[] = [
  { id: "X1Y", title: "Chinese New Year", duration_ms: 180000, releaseGroupId: "R1C" },
  { id: "X2Z", title: "Renee", duration_ms: 210000, releaseGroupId: "R1C" },
  { id: "X3W", title: "Forever & Ever", duration_ms: 200000, releaseGroupId: "R2D" },
  { id: "X4V", title: "Talk a Lot", duration_ms: 190000, releaseGroupId: "R2D" }
];

// Root Resolver
export const root = {
  artists: () => artists,
  releaseGroups: () => releaseGroups,
  releases: () => releases
}; 