const mongoose = require('mongoose')
//const { connect } = require('./server')
//const MONGODB_URI = 'mongodb+srv://admin2021:admin2021@cluster0.b4feb.mongodb.net/database'
//const MONGODB_URI = 'mongodb+srv://admindb:12345@dbmyfirstapp.sqjx6.mongodb.net/DBTest'
const MONGODB_URI = 'mongodb+srv://root:root@cluster0.b4feb.mongodb.net/database'

//authSource=admin&replicaSet=atlas-wjvtc8-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true

const dbConnection = async() =>{
    try {

        await mongoose.connect( MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }


}



module.exports = {
    dbConnection
}