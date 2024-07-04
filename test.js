const axios = require('axios');

const postData = async () => {
  try {
    const response = await axios.post('http://localhost:3000/referrals', {
      name: 'John Doe',
      email: 'johndoe@example.com',
      referredBy: 'Jane Smith'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

postData();
