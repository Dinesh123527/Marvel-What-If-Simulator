
const http = require('http');

async function testProxy() {
    // SuperHeroAPI official format: https://www.superheroapi.com/api.php/access-token/character-id/image
    // This might be more permissible than the direct image URL from superherodb
    // Let's try to simulate fetching the image through the API endpoint structure if possible, 
    // or check if superherodb allows specific referrers.

    // Actually, let's try a direct fetch to the image with NO headers at all, just like curl
    const targetUrl = 'https://www.superherodb.com/pictures2/portraits/10/100/928.jpg';
    const proxyUrl = `http://localhost:3000/api/proxy-image?url=${encodeURIComponent(targetUrl)}`;

    console.log('Testing proxy again...');

    try {
        const res = await fetch(proxyUrl);
        console.log(`Status: ${res.status}`);

        if (res.ok) {
            console.log("Success!");
        } else {
            console.log("Failed");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testProxy();
