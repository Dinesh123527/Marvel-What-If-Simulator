const SUPERHERO_API_TOKEN = process.env.SUPERHERO_API_TOKEN;
const SUPERHERO_API_BASE_URL = process.env.SUPERHERO_API_BASE_URL || 'https://superheroapi.com/api';

export interface SuperHeroStats {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
}

export interface SuperHeroBiography {
    'full-name': string;
    'alter-egos': string;
    aliases: string[];
    'place-of-birth': string;
    'first-appearance': string;
    publisher: string;
    alignment: string;
}

export interface SuperHeroAppearance {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
    'eye-color': string;
    'hair-color': string;
}

export interface SuperHeroImage {
    url: string;
}

export interface SuperHeroWork {
    occupation: string;
    base: string;
}

export interface SuperHeroConnections {
    'group-affiliation': string;
    relatives: string;
}

export interface SuperHeroResponse {
    response: string;
    id: string;
    name: string;
    powerstats: SuperHeroStats;
    biography: SuperHeroBiography;
    appearance: SuperHeroAppearance;
    work: SuperHeroWork;
    connections: SuperHeroConnections;
    image: SuperHeroImage;
}

export interface SuperHeroSearchResult {
    response: string;
    'results-for': string;
    results: SuperHeroResponse[];
}

export interface CharacterData {
    superheroApiId: number;
    name: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    imageUrl: string;
    // Extended info
    fullName?: string;
    alterEgos?: string;
    aliases?: string[];
    placeOfBirth?: string;
    firstAppearance?: string;
    publisher?: string;
    gender?: string;
    race?: string;
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    // Work
    occupation?: string;
    base?: string;
    // Connections
    groupAffiliation?: string;
    relatives?: string;
}

/**
 * Search for a character by name
 */
export async function searchCharacter(name: string): Promise<SuperHeroResponse[] | null> {
    if (!SUPERHERO_API_TOKEN) {
        console.error('SUPERHERO_API_TOKEN not configured');
        return null;
    }

    try {
        const response = await fetch(
            `${SUPERHERO_API_BASE_URL}/${SUPERHERO_API_TOKEN}/search/${encodeURIComponent(name)}`
        );
        const data: SuperHeroSearchResult = await response.json();

        if (data.response === 'success' && data.results) {
            return data.results;
        }
        return null;
    } catch (error) {
        console.error(`Error searching for character ${name}:`, error);
        return null;
    }
}

/**
 * Get character by ID
 */
export async function getCharacterById(id: number): Promise<SuperHeroResponse | null> {
    if (!SUPERHERO_API_TOKEN) {
        console.error('SUPERHERO_API_TOKEN not configured');
        return null;
    }

    try {
        const response = await fetch(
            `${SUPERHERO_API_BASE_URL}/${SUPERHERO_API_TOKEN}/${id}`
        );
        const data: SuperHeroResponse = await response.json();

        if (data.response === 'success') {
            return data;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching character ${id}:`, error);
        return null;
    }
}

/**
 * Parse stat value (handles "null" strings)
 */
function parseStat(value: string): number {
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

/**
 * Map alignment to our enum
 */
function mapAlignment(alignment: string): 'hero' | 'villain' | 'anti-hero' {
    const lower = alignment?.toLowerCase() || '';
    if (lower === 'bad') return 'villain';
    if (lower === 'neutral' || lower === '-') return 'anti-hero';
    return 'hero';
}

/**
 * Transform API response to our CharacterData format
 */
export function transformToCharacterData(hero: SuperHeroResponse): CharacterData {
    return {
        superheroApiId: parseInt(hero.id, 10),
        name: hero.name,
        alignment: mapAlignment(hero.biography?.alignment),
        intelligence: parseStat(hero.powerstats?.intelligence),
        strength: parseStat(hero.powerstats?.strength),
        speed: parseStat(hero.powerstats?.speed),
        durability: parseStat(hero.powerstats?.durability),
        power: parseStat(hero.powerstats?.power),
        combat: parseStat(hero.powerstats?.combat),
        imageUrl: hero.image?.url || '',
        // Extended biography info
        fullName: hero.biography?.['full-name'] || '',
        alterEgos: hero.biography?.['alter-egos'] || '',
        aliases: hero.biography?.aliases || [],
        placeOfBirth: hero.biography?.['place-of-birth'] || '',
        firstAppearance: hero.biography?.['first-appearance'] || '',
        publisher: hero.biography?.publisher || '',
        // Appearance
        gender: hero.appearance?.gender || '',
        race: hero.appearance?.race || '',
        height: hero.appearance?.height?.[1] || '',
        weight: hero.appearance?.weight?.[1] || '',
        eyeColor: hero.appearance?.['eye-color'] || '',
        hairColor: hero.appearance?.['hair-color'] || '',
        // Work
        occupation: hero.work?.occupation || '',
        base: hero.work?.base || '',
        // Connections
        groupAffiliation: hero.connections?.['group-affiliation'] || '',
        relatives: hero.connections?.relatives || '',
    };
}

/**
 * Search and get the best match for a character name
 * Prioritizes exact matches and Marvel characters
 */
export async function findBestMatch(name: string): Promise<CharacterData | null> {
    const results = await searchCharacter(name);
    if (!results || results.length === 0) return null;

    // Try to find exact match first
    const exactMatch = results.find(
        r => r.name.toLowerCase() === name.toLowerCase()
    );
    if (exactMatch) {
        return transformToCharacterData(exactMatch);
    }

    // Try to find Marvel character
    const marvelMatch = results.find(
        r => r.biography?.publisher?.toLowerCase().includes('marvel')
    );
    if (marvelMatch) {
        return transformToCharacterData(marvelMatch);
    }

    return transformToCharacterData(results[0]);
}

export const MCU_CHARACTER_IDS: Record<string, number> = {
    'Tony Stark': 346,
    'Iron Man': 346,
    'Steve Rogers': 149,
    'Captain America': 149,
    'Thor': 659,
    'Hulk': 332,
    'Bruce Banner': 332,
    'Black Widow': 107,
    'Natasha Romanoff': 107,
    'Hawkeye': 313,
    'Clint Barton': 313,

    // Spider-Man
    'Spider-Man': 620,
    'Peter Parker': 620,

    // Mystic Arts
    'Doctor Strange': 226,
    'Scarlet Witch': 579,
    'Wanda Maximoff': 579,
    'Wong': 735,

    // Vision & Mind Stone
    'Vision': 697,
    'Quicksilver': 534,
    'Pietro Maximoff': 534,

    // Wakanda
    'Black Panther': 106,
    "T'Challa": 106,
    'Shuri': 601,

    // Captain Marvel
    'Captain Marvel': 157,
    'Carol Danvers': 157,
    'Monica Rambeau': 443,

    // Ant-Man & Wasp
    'Ant-Man': 30,
    'Scott Lang': 30,
    'Wasp': 708,
    'Hope Van Dyne': 708,
    'Hank Pym': 30,       // Uses Ant-Man data
    'Janet Van Dyne': 708, // Uses Wasp data

    // Cap's Allies
    'Falcon': 250,
    'Sam Wilson': 250,
    'Winter Soldier': 732,
    'Bucky Barnes': 732,
    'War Machine': 703,
    'James Rhodes': 703,
    'Pepper Potts': 519,  // Rescue

    // Guardians of the Galaxy
    'Nebula': 455,
    'Gamora': 275,
    'Rocket Raccoon': 550,
    'Rocket': 550,
    'Groot': 303,
    'Drax': 234,
    'Star-Lord': 630,
    'Peter Quill': 630,
    'Mantis': 426,
    'Yondu': 741,

    // SHIELD
    'Nick Fury': 456,
    'Maria Hill': 431,
    'Phil Coulson': 186,

    // Asgardians
    'Odin': 478,
    'Hela': 316,
    'Frigga': 659,        // Uses Thor data as placeholder
    'Sif': 602,

    // Villains
    'Thanos': 655,
    'Loki': 414,
    'Ultron': 680,
    'Ronan': 556,
    'Malekith': 423,
    'Alexander Pierce': 456, // Uses Nick Fury as placeholder
    'Crossbones': 190,
    'Arnim Zola': 52,

    // Other Heroes
    'Jane Foster': 659,    // Uses Thor data as placeholder
    'Harley Keener': 346,  // Uses Iron Man data as placeholder
    'Happy Hogan': 346,    // Uses Iron Man data as placeholder

    // Dark World / Other
    'Collector': 186,      // Placeholder
    'Kang Variants': 655,  // Uses Thanos as placeholder
    'He Who Remains': 655, // Uses Thanos as placeholder
    'America Chavez': 25,  // Miss America
};

import { cacheCharacter, getCachedCharacterById } from './data';

/**
 * Get character data by name with caching
 * 1. Check if we have a pre-mapped ID
 * 2. Check database cache
 * 3. Fetch from API and cache the result
 */
export async function getCharacterByName(name: string): Promise<CharacterData | null> {
    // Check if we have a pre-mapped ID
    const id = MCU_CHARACTER_IDS[name];

    if (id) {
        // Check cache first
        try {
            const cached = await getCachedCharacterById(id);
            if (cached) {
                return {
                    superheroApiId: cached.superhero_api_id,
                    name: cached.name,
                    alignment: cached.alignment,
                    intelligence: cached.intelligence,
                    strength: cached.strength,
                    speed: cached.speed,
                    durability: cached.durability,
                    power: cached.power,
                    combat: cached.combat,
                    imageUrl: cached.image_url,
                };
            }
        } catch (error) {
            // Cache lookup failed, continue to API
            console.log('Cache lookup failed, fetching from API:', error);
        }

        // Fetch from API
        const hero = await getCharacterById(id);
        if (hero) {
            const charData = transformToCharacterData(hero);

            // Cache the result
            try {
                await cacheCharacter(charData);
                console.log(`✅ Cached character: ${charData.name}`);
            } catch (error) {
                console.error('Failed to cache character:', error);
            }

            return charData;
        }
    }

    // Fall back to search
    const charData = await findBestMatch(name);
    if (charData) {
        // Cache the result
        try {
            await cacheCharacter(charData);
            console.log(`✅ Cached character: ${charData.name}`);
        } catch (error) {
            console.error('Failed to cache character:', error);
        }
    }
    return charData;
}

/**
 * Get multiple characters by names with caching
 */
export async function getCharactersByNames(names: string[]): Promise<Map<string, CharacterData>> {
    const results = new Map<string, CharacterData>();

    for (const name of names) {
        const character = await getCharacterByName(name);
        if (character) {
            results.set(name, character);
        }
    }

    return results;
}

