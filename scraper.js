import gplay from 'google-play-scraper';
import fs from 'fs';

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
                icon: app.icon,   
                url: app.url,     
                developer: app.developer,
                score: app.scoreText,
                description: app.summary || 'Enjoy this wonderful game by SavyChamp.',
                // FIX: Removed .slice(0, 3) so it grabs ALL screenshots now!
                screenshots: Array.isArray(app.screenshots) ? app.screenshots : []
            });
            console.log(`Successfully scraped: ${app.title}`);
        }

        // Save the scraped data to games.json
        fs.writeFileSync('games.json', JSON.stringify(gamesData, null, 2));
        console.log('games.json has been updated!');
        
    } catch (error) {
        console.error('Error scraping data:', error);
        process.exit(1); 
    }
}

scrapeGames();