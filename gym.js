
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
  const images = imagedb.prepare(`SELECT * FROM imagedb`).all();
res.render('admin', {images})
} )

app.get('/:id', (req,res) => {

  const id = req.params.id

  console.log(id);
  imagedb.prepare(`DELETE FROM imagedb WHERE id=?`).run(id);
  const images = imagedb.prepare(`SELECT * FROM imagedb`).all();
res.render('admin', {images})
} )

app.post("/image", upload.array("images", 5), async (req, res) => {


  const tab = req.body.tab
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
      imagedb.prepare('INSERT INTO imagedb (name,image) VALUES (?,?)').run(tab,imageBuffer);


    }catch(error){
      console.log(error);
    }

  }


  res.redirect("/9171441509");
});




  app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});