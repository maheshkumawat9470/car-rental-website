const fs = require('fs');
const google = require('googlethis');

const dataFile = './data.json';
const scriptFile = './public/js/script.js';

let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

async function fetchGoogleImage(query) {
  try {
    const images = await google.image(query, { safe: false });
    if (images && images.length > 0) {
      // Find the first valid looking URL
      for (let img of images) {
        if (img.url && img.url.startsWith('http')) {
          return img.url;
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function updateImages() {
  for (let vehicle of data.vehicles) {
    // Only fetch for vehicles that currently have placehold.co or unsplash fallback
    if (vehicle.images[0].includes('placehold.co') || vehicle.images[0].includes('unsplash.com') || vehicle.images[0].includes('wikimedia')) {
      const query = vehicle.brand + ' ' + vehicle.model + ' ' + vehicle.type;
      console.log(`Fetching image for: ${query}`);
      
      let imgUrl = await fetchGoogleImage(query);
      
      if (imgUrl) {
        vehicle.images = [imgUrl];
        console.log(`Found: ${imgUrl}`);
      } else {
        console.log(`Still not found for ${query}`);
      }
      
      await new Promise(r => setTimeout(r, 1000)); // be nice to google
    }
  }
  
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log('Updated data.json');
  
  // Also update script.js fallback data
  let scriptContent = fs.readFileSync(scriptFile, 'utf-8');
  for (let vehicle of data.vehicles) {
    const regex = new RegExp(`(_id:\\s*'${vehicle._id}'.*?images:\\s*\\[).*?(\\])`);
    scriptContent = scriptContent.replace(regex, `$1'${vehicle.images[0]}'$2`);
  }
  fs.writeFileSync(scriptFile, scriptContent);
  console.log('Updated script.js');
}

updateImages();
