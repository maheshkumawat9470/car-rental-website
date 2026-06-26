const fs = require('fs');
const https = require('https');

const dataFile = './data.json';
const scriptFile = './public/js/script.js';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

async function fetchWikimediaImageSearch(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&format=json&piprop=original`;
    https.get(url, { headers: { 'User-Agent': 'Bot/1.0' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.query && parsed.query.pages) {
            const pages = parsed.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pages[pageId] && pages[pageId].original) {
              resolve(pages[pageId].original.source);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function updateImages() {
  for (let vehicle of data.vehicles) {
    if (!vehicle.images[0].includes('unsplash.com')) {
      // It already has a valid wikimedia image from the previous run
      continue;
    }

    const query = vehicle.brand + ' ' + vehicle.model;
    console.log(`Fetching image for: ${query}`);
    let imgUrl = await fetchWikimediaImageSearch(query);
    
    if (!imgUrl) {
      imgUrl = await fetchWikimediaImageSearch(vehicle.model);
    }
    
    if (imgUrl) {
      vehicle.images = [imgUrl];
      console.log(`Found: ${imgUrl}`);
    } else {
      console.log(`Still not found for ${query}`);
      // Fallback to a placeholder with the car's name if we completely fail
      vehicle.images = [`https://placehold.co/800x600/1e293b/ffffff/png?text=${encodeURIComponent(query)}`];
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log('Updated data.json');
  
  // Also update script.js
  let scriptContent = fs.readFileSync(scriptFile, 'utf-8');
  for (let vehicle of data.vehicles) {
    const regex = new RegExp(`(_id:\\s*'${vehicle._id}'.*?images:\\s*\\[).*?(\\])`);
    scriptContent = scriptContent.replace(regex, `$1'${vehicle.images[0]}'$2`);
  }
  fs.writeFileSync(scriptFile, scriptContent);
  console.log('Updated script.js');
}

updateImages();
