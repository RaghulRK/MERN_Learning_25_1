const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../Models/tourModel");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });


const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{console.log("DB connection is successfull!")});

// import file data

const fileData = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,"utf-8"));

// insert the imported data into DB

const importData = async()=>{
    try{
        await Tour.create(fileData);
        console.log("Data added suceesfully");
    } catch(err){
        console.log(err);
    }
    process.exit();
}

// delete all the data in DB

const deleteData = async()=>{
    try {
        await Tour.deleteMany();
        console.log("Data deleted successfully");
    } catch(err){
        console.log(err);
    }
    process.exit();
}   

if(process.argv[2] === "__import"){
    importData();
} else if(process.argv[2] === "__delete"){
    deleteData();
}
console.log(process.argv);