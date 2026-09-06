import gplay from 'google-play-scraper';
import fs from 'fs';

// Get the App ID passed from the GitHub Action input
const targetAppId = process.argv[2];

if (!targetAppId) {
    console.error('No App ID provided. Please provide an App ID as an argument.');
    process.exit(1);
}

async function scrapeSingleGame() {
    try {
        let gamesData = [];
        
        // 1. Read existing games.json so we don't overwrite other games
        if (fs.existsSync('games.json')) {
            const rawData = fs.readFileSync('games.json', 'utf-8');
            if (rawData.trim() !== '') {
                gamesData = JSON.parse(rawData);
            }
        }

        console.log(`Fetching data for: ${targetAppId}...`);

        // 2. Fetch data from Play Store for ONLY this game
        const app = await gplay.app({ appId: targetAppId });
        
        // Check if game already exists in games.json to preserve the "type" property
        const existingIndex = gamesData.findIndex(game => game.id === targetAppId);
        const existingType = existingIndex !== -1 && gamesData[existingIndex].type ? gamesData[existingIndex].type : 'game';

        // 3. Format the new details
        const newGameData = {
            id: targetAppId,
            title: app.title,
            icon: app.icon,   
            url: app.url,     
            developer: app.developer,
            type: existingType,
            description: app.summary || 'Enjoy this wonderful experience by SavyChamp.',
            screenshots: Array.isArray(app.screenshots) ? app.screenshots : []
        };
        
        if (existingIndex !== -1) {
            // Update existing game
            gamesData[existingIndex] = newGameData;
            console.log(`Updated existing entry for: ${app.title}`);
        } else {
            // Add as a brand new game
            gamesData.push(newGameData);
            console.log(`Added new entry for: ${app.title}`);
        }

        // 5. Save the merged data back to games.json
        fs.writeFileSync('games.json', JSON.stringify(gamesData, null, 2));
        console.log('games.json has been successfully updated!');
        
    } catch (error) {
        console.error(`Error scraping data for ${targetAppId}:`, error.message);
        process.exit(1); 
    }
}

scrapeSingleGame();