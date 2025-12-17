import { NextRequest, NextResponse } from 'next/server';
import { cacheCharacter, getCachedCharacterById, getFilteredCharacters } from '../../../lib/data';
import { CharacterData, getCharacterById, searchCharacter, transformToCharacterData } from '../../../lib/superhero-api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const query = searchParams.get('query') || '';
        const alignment = searchParams.get('alignment') || 'all';
        const letter = searchParams.get('letter') || '';

        let characters: CharacterData[] = [];
        let hasMore = false;
        let total = 0;

        if (query) {
            const results = await searchCharacter(query);
            if (results && results.length > 0) {
                characters = results.map(transformToCharacterData);

                // Cache found characters (background)
                (async () => {
                    for (const char of characters) {
                        await cacheCharacter(char).catch(() => { });
                    }
                })();
            }
            total = characters.length;
        }
        else if (alignment !== 'all' || letter) {
            const offset = (page - 1) * limit;
            const result = await getFilteredCharacters(alignment, letter, limit, offset);

            characters = result.characters.map(char => ({
                superheroApiId: char.superhero_api_id,
                name: char.name,
                alignment: char.alignment,
                intelligence: char.intelligence,
                strength: char.strength,
                speed: char.speed,
                durability: char.durability,
                power: char.power,
                combat: char.combat,
                imageUrl: char.image_url,
            }));

            total = result.total;
            hasMore = offset + characters.length < total;
        }

        else {
            const startId = (page - 1) * limit + 1;
            const endId = startId + limit - 1;
            const MAX_ID = 732;

            const idsToFetch = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i).filter(id => id <= MAX_ID); // Ensure we don't go over 732

            // Fetch in parallel
            const fetchPromises = idsToFetch.map(async (id) => {
                // 1. Try Cache
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
                        } as CharacterData;
                    }
                } catch { }

                // 2. Fetch from API
                try {
                    const apiChar = await getCharacterById(id);
                    if (!apiChar) return null;

                    const charData = transformToCharacterData(apiChar);
                    // Cache it
                    await cacheCharacter(charData).catch(() => { });
                    return charData;
                } catch (error) {
                    console.warn(`Failed to fetch character ${id}`, error);
                    return null;
                }
            });

            const results = await Promise.all(fetchPromises);
            characters = results.filter((c): c is CharacterData => c !== null);
            hasMore = endId < MAX_ID;
            total = MAX_ID;
        }

        return NextResponse.json({
            success: true,
            data: characters,
            page,
            hasMore,
            total: total,
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch characters' }, { status: 500 });
    }
}
