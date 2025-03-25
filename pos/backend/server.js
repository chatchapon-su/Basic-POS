const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')

const port = 8004

const fs = require('fs');
const fileUpload = require('express-fileupload');

const app = express()

app.use(bodyparser.json())
app.use(cors())
app.use(fileUpload());


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


//------Product------//

app.get('/products',async(req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM products')
        res.json(result[0])
    }catch(error){
        console.log("Select products Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/checkproductsid', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE productid = (SELECT MAX(productid) FROM products)');
        res.json(result[0]);
    } catch (error) {
        console.log("Select products Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});



app.post('/createproducts', async (req, res) => {
    try {
        let productdata = req.body;
        const productImage = req.files.productImageInput;

        if (!productImage) {
            return res.status(400).send('No files were uploaded.');
        }
		//console.log('test');
        const barcode = productdata.barcode;
        const newFileName = `${barcode}.jpg`;
        const uploadPath = `./product/${newFileName}`;
		
        productImage.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            productdata.productimage = newFileName;

            const result = await pool.query('INSERT INTO products SET ?', productdata);
            res.json(result[0]);
        });
    } catch (error) {
        console.log("Select createproduct Error");
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});


app.get('/productsbarcode/:barcode',async(req,res)=>{
    try{
        let barcode = req.params.barcode
        const result = await pool.query('SELECT * FROM products WHERE barcode=?',barcode)
        res.json(result[0])
    }catch(error){
        console.log("Get products Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/productsbarcodestart/:barcode', async (req, res) => {
    try {
        let barcode = req.params.barcode;
        const result = await pool.query('SELECT * FROM products WHERE barcode LIKE ?', [`${barcode}%`]);
        res.json(result[0]);
    } catch (error) {
        console.log("Get products Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});


app.get('/products/:productid',async(req,res)=>{
    try{
        let productid = req.params.productid
        const result = await pool.query('SELECT * FROM products WHERE productid=?',productid)
        res.json(result[0])
    }catch(error){
        console.log("Get products Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.put('/productstock/:productid',async(req,res)=>{
    try{
        let productid = req.params.productid
        let productdata = req.body
        const result = await pool.query('UPDATE products SET ? WHERE productid=?',[productdata,productid])
        res.json(result[0])
    }catch(error){
        console.log("Update products Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

//------Users------//

app.put('/membership/:userid', async (req, res) => {
    try {
		//console.log("Test 1");
        let userid = req.params.userid;
        let membershipdata = req.body;

        const additionalPoints = Math.floor(membershipdata.total / 100);
        if (additionalPoints > 0) {
            const currentMembershipResult = await pool.query('SELECT memberpoint FROM users WHERE phone = ?', [userid]);
			console.log("currentMembershipResult : ",currentMembershipResult)
            let currentMembership = currentMembershipResult[0][0].memberpoint || 0;

            const newMembership = currentMembership + additionalPoints;

            const result = await pool.query('UPDATE users SET memberpoint = ? WHERE phone = ?', [newMembership, userid]);
            res.json(result[0]);
        } else {
            res.json({ message: 'No point' });
        }
    } catch (error) {
        console.log("Update membership Error");
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});


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

app.post('/users',async(req,res)=>{
    try{
        let usersdata = req.body
        const result = await pool.query('INSERT INTO users SET ?',usersdata)
        res.json(result[0])
    }catch(error){
        console.log("Post users Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

//------POS------//

app.post('/pos',async(req,res)=>{
    try{
        let posdata = req.body
        const result = await pool.query('INSERT INTO poss SET ?',posdata)
        res.json(result[0])
    }catch(error){
        console.log("Post POS Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/pos/:posid',async(req,res)=>{
    try{
        let posid = req.params.posid
        const result = await pool.query('SELECT * FROM poss WHERE posid=?',posid)
        res.json({status:1})
    }catch(error){
        console.log("Get POS Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/pos',async(req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM poss WHERE posid=(SELECT max(posid) FROM poss)')
        res.json(result[0])
    }catch(error){
        console.log("Get POS Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/posrank', async (req, res) => {
    try {
        const result = await pool.query('SELECT productid, SUM(amount) as total FROM poss GROUP BY productid');
        res.json(result);
    } catch (error) {
        console.log("Get POS Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});

app.get('/posrank/:date', async (req, res) => {
    try {
        let date = req.params.date
        const result = await pool.query('SELECT productid, SUM(amount) as total FROM poss WHERE date=? GROUP BY productid ORDER BY total DESC',date);
        res.json(result);
    } catch (error) {
        console.log("Get POS date Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});

app.get('/posdatesell/:date', async (req, res) => {
    try {
        let date = req.params.date
        const result = await pool.query('SELECT * FROM poss WHERE date=?',date);
        res.json(result);
    } catch (error) {
        console.log("Get POS date Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});

app.get('/posall', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM poss');
        res.json(result);
    } catch (error) {
        console.log("Get POS Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});


//------PIN------//

app.post('/pin',async(req,res)=>{
    try{
        let pin = req.body
        const result = await pool.query('INSERT INTO pin SET ?',pin)
        res.json(result[0])
    }catch(error){
        console.log("Post PIN Error")
        res.status(500).json({
            message:error.message,
            error:error
        })
    }
})

app.get('/pinall', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pin');
        res.json(result[0]);
    } catch (error) {
        console.log("Get POS Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});

app.get('/pindatebuy/:date', async (req, res) => {
    try {
        let date = req.params.date
        const result = await pool.query('SELECT * FROM pin WHERE date=?',date);
        res.json(result);
    } catch (error) {
        console.log("Get POS date Error:", error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
});


app.listen(port,async(req,res)=>{
    await initMySQL()
    console.log(`Server Start On Port : ${port}`)
})