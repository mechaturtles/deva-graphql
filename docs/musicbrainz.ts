/**
 * MusicBrainz API client for performing searches and lookups
 */

// Constants
const MUSICBRAINZ_API_URL = 'https://musicbrainz.org/ws/2';
const DEFAULT_HEADERS = {
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
function isValidIndex(index: string): boolean {
    return ['artist', 'release', 'recording', 'work', 'label'].includes(index);
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
    if (!isValidIndex(index)) {
        throw new Error(`Invalid index: ${index}. Must be one of: artist, release, recording, work, label`);
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
        const response = await fetch(url, { headers: DEFAULT_HEADERS });
        
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