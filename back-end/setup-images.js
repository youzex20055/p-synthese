const fs = require('fs');
const path = require('path');
const https = require('https');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Sample product images to download
const images = [
  {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png',
    filename: 'nike-air-max-red.jpg'
  },
  {
    url: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2b9eb0b6d4f34f1b8f0aaf0100d4b1a5_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
    filename: 'adidas-ultraboost-black.jpg'
  },
  {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61d07a2c-4bc8-4dba-a6e4-5de058c7c416/dri-fit-mens-training-top-4PJ7Jm.png',
    filename: 'nike-dri-fit-blue.jpg'
  },
  {
    url: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a/Climalite_T-Shirt_Black_GM3573_01_laydown.jpg',
    filename: 'adidas-climalite-black.jpg'
  },
  {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f/sport-cap-4PJ7Jm.png',
    filename: 'nike-sport-cap.jpg'
  },
  {
    url: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a/gym-bag_Black_GM3573_01_laydown.jpg',
    filename: 'adidas-gym-bag.jpg'
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(uploadsDir, filename));
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function downloadAllImages() {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages(); 