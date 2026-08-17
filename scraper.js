const gplay = require('google-play-scraper');
const fs = require('fs');

// Your App IDs from the Google Play links
const appsToScrape = [
    'com.levelsparkcompany.arrows.paint',
    'com.happycasualcompany.jiggytiles'
];

async function scrapeGames() {
    try {
        let gamesData = [];
        
        for (let appId of appsToScrape) {
            // Fetch data from Play Store
            const app = await gplay.app({ appId: appId });
            
            // Extract the specific details you want
            gamesData.push({
                id: appId,
                title: app.title,
                icon: app.icon, // High-res app icon
                url: app.url,   // Direct link to Play Store
                developer: app.developer,
                score: app.scoreText
            });
            console.log(`Successfully scraped: ${app.title}`);
        }

        // Save the scraped data to games.json
        fs.writeFileSync('games.json', JSON.stringify(gamesData, null, 2));
        console.log('games.json has been updated!');
        
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

scrapeGames();