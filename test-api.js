
require('dotenv').config({ path: '.env.local' });

const token = process.env.SUPERHERO_API_TOKEN;
const baseUrl = process.env.SUPERHERO_API_BASE_URL || 'https://superheroapi.com/api';

async function testCharacter(name) {
    console.log(`Searching for ${name}...`);
    const url = `${baseUrl}/${token}/search/${encodeURIComponent(name)}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            console.log(`Found ${data.results.length} results for ${name}`);
            const first = data.results[0];
            console.log(`Name: ${first.name}`);
            console.log(`Image URL: ${first.image.url}`);
        } else {
            console.log(`No results found for ${name}`);
        }
    } catch (e) {
        console.error(`Error fetching ${name}:`, e.message);
    }
}

async function run() {
    if (!token) {
        console.error('No token found!');
        return;
    }
    await testCharacter('Loki');
    await testCharacter('Chitauri');
    await testCharacter('Mister Fantastic');
}

run();
