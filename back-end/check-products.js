const axios = require('axios');

async function checkProducts() {
  try {
    const response = await axios.get('http://localhost:1337/api/products?populate=*');
    console.log('Total products:', response.data.data.length);
    console.log('Products:', response.data.data.map(p => ({
      id: p.id,
      name: p.attributes.productName,
      price: p.attributes.price
    })));
  } catch (error) {
    console.error('Error checking products:', error.response?.data || error.message);
  }
}

checkProducts(); 