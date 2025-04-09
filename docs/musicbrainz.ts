/**
 * MusicBrainz API client for performing searches and lookups
 */

// Constants
const MUSICBRAINZ_API_URL = 'https://musicbrainz.org/ws/2';
const MUSICBRAINZ_HEADERS = {
    'User-Agent': 'Deva-GraphQL/1.0.0 (https://github.com/mechaturtles/deva-graphql)',
    'Accept': 'application/json'
};

/**
 * Validates an MBID format
 * @param mbid The MBID to validate
 * @returns true if the MBID is valid
 */
function isValidMBID(mbid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mbid);
}

/**
 * Validates an index name
 * @param index The index to validate
 * @returns true if the index is valid
 */
function isValidMusicBrainzIndex(index: string): boolean {
    return [
        'area',
        'artist',
        'event',
        'instrument',
        'label',
        'place',
        'recording',
        'release',
        'release-group',
        'series',
        'work',
        'annotation',
        'tag',
        'cdstub',
        'editor'
    ].includes(index);
}

/**
 * Performs a lookup of one or more MBIDs in MusicBrainz
 * @param index The type of entity to look up (artist, release, recording, etc.)
 * @param mbids A single MBID or array of MBIDs to look up
 * @returns The raw response from MusicBrainz
 * @throws Error if the request fails or if MBIDs are invalid
 */
export async function lookupMBIDs(index: string, mbids: string | string[]): Promise<any> {
    // Validate index
    if (!isValidMusicBrainzIndex(index)) {
        throw new Error(`Invalid index: ${index}. Must be one of: area, artist, event, instrument, label, place, recording, release, release-group, series, work, annotation, tag, cdstub, editor`);
    }

    // Normalize MBIDs to array
    const mbidArray = Array.isArray(mbids) ? mbids : [mbids];

    // Validate all MBIDs
    for (const mbid of mbidArray) {
        if (!isValidMBID(mbid)) {
            throw new Error(`Invalid MBID format: ${mbid}`);
        }
    }

    // Construct query string
    const query = mbidArray.map(mbid => `mbid:${mbid}`).join(' OR ');
    const url = `${MUSICBRAINZ_API_URL}/${index}?query=${encodeURIComponent(query)}&fmt=json`;

    try {
        const response = await fetch(url, { headers: MUSICBRAINZ_HEADERS });
        
        if (!response.ok) {
            throw new Error(`MusicBrainz API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch from MusicBrainz: ${error.message}`);
        }
        throw new Error('Failed to fetch from MusicBrainz: Unknown error');
    }
}

/**
 * Generic function to search a MusicBrainz Lucene index with a query
 * @param index The index to search (e.g., 'artist', 'release-group', 'release')
 * @param query The Lucene query string
 * @returns Promise resolving to the search results
 */
export async function searchMusicBrainzByLuceneQuery(index: string, query: string): Promise<any> {
  // Normalize index name for URL construction
  const normalizedIndex = index.replace('-', '%20');
  
  // Build the URL with the query
  const url = `${MUSICBRAINZ_API_URL}/${normalizedIndex}?query=${encodeURIComponent(query)}&fmt=json`;
  
  try {
    const response = await fetch(url, {
      headers: MUSICBRAINZ_HEADERS // Use MusicBrainz headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error searching index ${index}:`, error);
    
    // Return an empty result structure rather than throwing
    // This allows the GraphQL resolver to handle the error gracefully
    const emptyResult: any = {};
    const resultKey = index === 'release-group' ? 'release-groups' : `${index}s`;
    emptyResult[resultKey] = [];
    
    return emptyResult;
  }
}