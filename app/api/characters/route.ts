import { getCharacterByName, getCharactersByNames, searchCharacter, transformToCharacterData } from '@/app/lib/superhero-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const names = searchParams.get('names');
    const search = searchParams.get('search');

    try {
        // Single character by name
        if (name) {
            const character = await getCharacterByName(name);
            if (character) {
                return NextResponse.json({ success: true, data: character });
            }
            return NextResponse.json(
                { success: false, error: `Character "${name}" not found` },
                { status: 404 }
            );
        }

        // Multiple characters by names
        if (names) {
            const nameList = names.split(',').map(n => n.trim());
            const characters = await getCharactersByNames(nameList);
            const data = Object.fromEntries(characters);
            return NextResponse.json({
                success: true,
                data,
                count: characters.size,
            });
        }

        // Search for characters
        if (search) {
            const results = await searchCharacter(search);
            if (results && results.length > 0) {
                const characters = results.map(transformToCharacterData);
                return NextResponse.json({
                    success: true,
                    data: characters,
                    count: characters.length,
                });
            }
            return NextResponse.json({
                success: true,
                data: [],
                count: 0,
            });
        }

        return NextResponse.json(
            { success: false, error: 'Please provide name, names, or search parameter' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Characters API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch character data' },
            { status: 500 }
        );
    }
}
