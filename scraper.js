// File: scraper.js
import gplay from 'google-play-scraper';
import fs from 'fs';

// Get the App ID and Type passed from the GitHub Action input
const targetAppId = process.argv[2];
const targetType = process.argv[3] || 'game'; 

if (!targetAppId) {
    console.error('No App ID provided. Please provide an App ID as an argument.');
    process.exit(1);
}

async function scrapeSingleGame() {
    try {
        let gamesData = [];
        
        // Read existing games.json so we don't overwrite other items
        if (fs.existsSync('games.json')) {
            const rawData = fs.readFileSync('games.json', 'utf-8');
            if (rawData.trim() !== '') {
                gamesData = JSON.parse(rawData);
            }
        }

        console.log(`Fetching data for: ${targetAppId} (Type: ${targetType})...`);

        // Fetch data from Play Store
        const app = await gplay.app({ appId: targetAppId });
        
        const existingIndex = gamesData.findIndex(item => item.id === targetAppId);

        // Format the new details, ensuring we set the "type" property correctly
        const newItemData = {
            id: targetAppId,
            title: app.title,
            icon: app.icon,   
            url: app.url,     
            developer: app.developer,
            type: targetType, 
            description: app.summary || 'Enjoy this wonderful experience by SavyChamp.',
            screenshots: Array.isArray(app.screenshots) ? app.screenshots : []
        };
        
        if (existingIndex !== -1) {
            // Update existing entry
            gamesData[existingIndex] = newItemData;
            console.log(`Updated existing entry for: ${app.title}`);
        } else {
            // Add as a brand new entry
            gamesData.push(newItemData);
            console.log(`Added new entry for: ${app.title}`);
        }

        // Save the merged data back to games.json
        fs.writeFileSync('games.json', JSON.stringify(gamesData, null, 2));
        console.log('games.json has been successfully updated!');
        
    } catch (error) {
        console.error(`Error scraping data for ${targetAppId}:`, error.message);
        process.exit(1); 
    }
}

scrapeSingleGame();