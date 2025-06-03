const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:1337/api';
const ADMIN_URL = 'http://localhost:1337/admin';

// Admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123';

// Sample data for products (shoes)
const shoes = [
  {
    productName: "Nike Air Max",
    price: 129.99,
    color: "Red",
    Size: "Medium",
    productImage: ["nike-air-max-red.jpg"]
  },
  {
    productName: "Adidas Ultraboost",
    price: 149.99,
    color: "Black",
    Size: "Large",
    productImage: ["adidas-ultraboost-black.jpg"]
  }
];

// Sample data for shirts
const shirts = [
  {
    productName: "Nike Dri-Fit T-Shirt",
    price: 29.99,
    color: "Blue",
    size: "Medium",
    productImage: ["nike-dri-fit-blue.jpg"]
  },
  {
    productName: "Adidas Climalite T-Shirt",
    price: 34.99,
    color: "Black",
    size: "Large",
    productImage: ["adidas-climalite-black.jpg"]
  }
];

// Sample data for accessories
const accessories = [
  {
    productName: "Nike Sport Cap",
    price: 24.99,
    productImage: ["nike-sport-cap.jpg"]
  },
  {
    productName: "Adidas Gym Bag",
    price: 39.99,
    productImage: ["adidas-gym-bag.jpg"]
  }
];

async function login() {
  try {
    const response = await axios.post(`${ADMIN_URL}/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    return response.data.data.token;
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    return null;
  }
}

async function uploadImage(imagePath, token) {
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(imagePath));
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });
    
    return response.data[0].id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function createProduct(data, type, token) {
  try {
    // First upload images
    const imageIds = await Promise.all(
      data.productImage.map(async (imageName) => {
        const imagePath = path.join(__dirname, 'public/uploads', imageName);
        return await uploadImage(imagePath, token);
      })
    );

    // Create product with uploaded image IDs
    const productData = {
      data: {
        ...data,
        productImage: imageIds
      }
    };

    const response = await axios.post(`${API_URL}/${type}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`Created ${type}:`, response.data.data.attributes.productName);
  } catch (error) {
    console.error(`Error creating ${type}:`, error.response?.data || error.message);
  }
}

async function importData() {
  try {
    // Login to get token
    const token = await login();
    if (!token) {
      console.error('Failed to get authentication token');
      return;
    }

    // Import shoes
    for (const shoe of shoes) {
      await createProduct(shoe, 'products', token);
    }

    // Import shirts
    for (const shirt of shirts) {
      await createProduct(shirt, 'proshirts', token);
    }

    // Import accessories
    for (const accessory of accessories) {
      await createProduct(accessory, 'proaccs', token);
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during data import:', error);
  }
}

importData(); 