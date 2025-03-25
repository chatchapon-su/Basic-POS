const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const path = require('path');
const fs = require('fs');

const port = 8003

const app = express()

app.use(bodyparser.json())
app.use(cors())

let pool = null;


const initMySQL = async () => {
    pool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'yourdatabasepassword',
        database: 'pos',
        port: 3306
    });
};

app.get('/',(req,res)=>{
    res.send('Server Started')
})

//------------Product------------//

app.get('/products',async(req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM products WHERE status="selling"')
        res.json(result[0])
    }catch(error){
        console.log("Select products Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

//------------Users------------//

app.get('/users/:phone',async(req,res)=>{
    try{
        let phone = req.params.phone
        const result = await pool.query('SELECT * FROM users WHERE phone=?',phone)
        res.json(result[0][0])
    }catch(error){
        console.log("Select users Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/users/:phone/:password',async(req,res)=>{
    try{
        let phone = req.params.phone
        let password = req.params.password
        const result = await pool.query('SELECT * FROM users WHERE phone=? AND password=?',[phone,password])
        if(result[0].length==0){
            throw{
                message:"Users Not Found"
            }
        }
        res.json({status:1})
    }catch(error){
        console.log("Select users Error")
        res.status(500).json({
            message:error.message,
            error:error,
            status:0
        })
    }
})

app.post('/users',async(req,res)=>{
    try{
        let userdata = req.body
        const result = await pool.query('INSERT INTO users SET ?',userdata)
        res.json({
            message:"Post users Success",
            data:result[0]
        })
    }catch(error){
        console.log("Post users Error")
        res.status(500).json({
            message:error.message,
            error:error,
            status:0
        })
    }
})

const imageDirectory = 'C:/xampp/htdocs/project3_cleaningcode0.13response0.3/backend/product';

// Endpoint to serve images
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(imageDirectory, filename);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Send the image file
        res.sendFile(filePath);
    });
});


app.listen(port,async(req,res)=>{
    await initMySQL()
    console.log(`Server Start On Port : ${port}`)
})