const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        //mongoose will return a promise here, we want to wait for it before connecting so we use await 
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongo db connected...');
    } catch (error) {
        console.error(err.message);
        // Exit the process with failure
        process.exit(1);
    }
}

module.exports = connectDB;