import { searchByTerms } from './musicbrainz';

/**
 * Scalar types supported in Deva schema
 */
type DevaScalarType = 'String' | 'Int' | 'Float' | 'Boolean' | 'ID';

/**
 * Field types in Deva schema, including scalars, nested objects, and arrays of nested objects
 */
type DevaFieldType =
    | DevaScalarType
    | DevaObjectSchema
    | [DevaObjectSchema];

/**
 * Schema for a Deva object, mapping field names to their types
 */
type DevaObjectSchema = {
    [fieldName: string]: DevaFieldType;
};

/**
 * Metadata for a Deva entity, including its source index and base fields
 */
interface DevaEntityMetadata {
    sourceIndex: string;
    baseFields: DevaObjectSchema;
}

/**
 * Schema for Deva metadata, containing all entities and their metadata
 */
interface DevaMetadataSchema {
    entities: {
        [entityName: string]: DevaEntityMetadata;
    };
}

// Type definitions for better type safety
type GraphQLType = 'ID' | 'String' | 'Int' | 'Float' | 'Boolean';

interface NestedObject {
    [key: string]: GraphQLType | NestedObject | NestedObject[];
}

interface BaseFields {
    [key: string]: GraphQLType | NestedObject | NestedObject[];
}

/**
 * Maps a JavaScript/JSON value type to a GraphQL type
 * @param value The value to analyze
 * @returns The corresponding GraphQL type
 */
function inferGraphQLType(value: unknown): GraphQLType {
    if (value === null || value === undefined) return 'String';
    
    switch (typeof value) {
        case 'string':
            return 'String';
        case 'number':
            return Number.isInteger(value) ? 'Int' : 'Float';
        case 'boolean':
            return 'Boolean';
        case 'object':
            if (value instanceof Date) return 'String';
            return 'String';
        default:
            return 'String';
    }
}

/**
 * Validates if a value is a valid entity object
 * @param value The value to validate
 * @returns true if the value is a valid entity object
 */
function isValidEntity(value: unknown): value is Record<string, unknown> {
    return value !== null && 
           typeof value === 'object' && 
           !Array.isArray(value) &&
           Object.keys(value).length > 0;
}

/**
 * Extracts base fields and their types from a sample entity, including nested fields
 * @param entity The entity to analyze
 * @returns Object mapping field names to their GraphQL types or nested field structures
 * @throws Error if the entity is invalid
 */
function extractBaseFields(entity: Record<string, unknown>): BaseFields {
    const baseFields: BaseFields = {};
    
    for (const [key, value] of Object.entries(entity)) {
        // Handle nested objects
        if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
            if (Array.isArray(value)) {
                // Handle arrays of objects
                if (value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
                    baseFields[key] = [extractBaseFields(value[0] as Record<string, unknown>)];
                } else {
                    // Handle arrays of primitive values
                    baseFields[key] = inferGraphQLType(value[0] || '');
                }
            } else {
                // Handle nested objects
                baseFields[key] = extractBaseFields(value as Record<string, unknown>);
            }
            continue;
        }
        
        // Special case for 'id' field
        if (key === 'id') {
            baseFields[key] = 'ID';
            continue;
        }

        baseFields[key] = inferGraphQLType(value);
    }

    if (Object.keys(baseFields).length === 0) {
        throw new Error('No valid fields found in entity');
    }

    return baseFields;
}

/**
 * Scans a Lucene index response to generate base fields for Deva schema
 * @param index The index to scan (e.g., 'artist', 'release', 'recording')
 * @param sampleQuery The Lucene query to fetch sample data
 * @returns The base fields and their types, including nested fields
 * @throws Error if no valid sample could be found
 */
export async function scanLuceneIndexForDevaBaseFields(
    index: string,
    sampleQuery: string
): Promise<BaseFields> {
    if (!index || !sampleQuery) {
        throw new Error('Index and sample query are required');
    }

    try {
        const response = await searchByTerms(index, sampleQuery);

        if (!isValidEntity(response)) {
            throw new Error('Invalid response structure');
        }

        // Find the array of results based on index name
        const pluralKey = `${index}s`;
        const results = response[pluralKey];

        if (!Array.isArray(results) || results.length === 0) {
            throw new Error(`No results found for index '${index}' with query '${sampleQuery}'`);
        }

        const sampleEntity = results[0];
        if (!isValidEntity(sampleEntity)) {
            throw new Error('Invalid sample entity structure');
        }

        return extractBaseFields(sampleEntity);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to scan index: ${error.message}`);
        }
        throw new Error('Failed to scan index: Unknown error');
    }
} 