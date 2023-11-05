
const express = require('express')
const app = express()

const { imagedb } = require("./db");
const multer = require('multer');
const sharp = require('sharp');
const Promise = require('bluebird'); 



app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  const images = imagedb.prepare(`SELECT * FROM imagedb`).all();
  console.log(images);
  res.render('home' , {images})
})

app.get('/9171441509', (req,res) => {
res.render('admin')
} )

app.post("/image", upload.array("images", 5), async (req, res) => {

  const images = await Promise.map(
    req.files || [],
    async (file) => {
      const compressedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .webp({ quality: 40 })
        .toBuffer();

      if (compressedImageBuffer.length > 100000) {
        throw new Error("Image size exceeds 100KB");
      }

      return compressedImageBuffer;
    },
    { concurrency: 4 }
  );

  console.log('uploaded');

  for (const imageBuffer of images) {
    try{
      imagedb.prepare('INSERT INTO imagedb (name,image) VALUES (?,?)').run('gallery',imageBuffer);


    }catch(error){
      console.log(error);
    }

  }


  res.render("admin");
});




  app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});