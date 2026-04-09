const { connectDB, mongoose } = require('./db');
const Product = require('./product');

const insertSampleData = async () => {
  try {
    await connectDB();

    await Product.insertMany([
      {
        name: 'mac',
        price: 10000,
        description: 'Saad mac',
      },
      {
        name: 'Smart TV',
        price: 50000,
        description: 'Samsung TV',
      },
    ]);

    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

insertSampleData();