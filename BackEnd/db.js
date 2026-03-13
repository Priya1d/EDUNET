const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');
const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGOURI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToMongo;
