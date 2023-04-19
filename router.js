const express = require('express');
const app = express();
const router = express.Router();
const upload = require('./uploadMiddleware');
const multer = require('multer')
const parser = require('@solidity-parser/parser');
const { json } = require('body-parser');
const fs = require('fs');
const path = require('path')
const extractAcel = require('./servera')



router.get('/', async function (req, res) {
  await res.render('index');
});

router.get('/new', async function (req, res) {
  await res.render('template');
});

function creatingFile(name, content){
 return new Promise((resolve, reject) => {
    fs.writeFile(name, content, 'utf8', function (err) {
      if (err) {
          reject("An error occured while writing JSON Object to File.");
          
      }
  
      resolve("JSON file saved.");
  
  });
  })
}

router.post('/create',  async function (req, res, next) {


    
  let jsonData = req.body

  const filename = "configFile.json"
  let jsonContent = JSON.stringify(jsonData);

await creatingFile(filename, jsonContent).then(data =>{
  console.log(data)
}).catch(err => {
  console.log(err)
})

const filepath = path.join(__dirname, 'configFile.json')
res.download(filepath, filename, function (err){
  if(err){
    console.log(err)
  }
  else {
    console.log("file sent")
  }
})

});


router.get('/files/:filename', async function (req, res, next) {


    
  let filename = req.params.filename

  console.log(filename)

const filepath = path.join(__dirname, filename)
console.log(filepath)


const readStream = fs.createReadStream(filepath);
res.setHeader('Content-Type', 'application/octet-stream');
readStream.on('data', chunk => {
  res.write(chunk);
});
readStream.on('end', () => {
  res.end();
});


});

router.post('/extract', upload.single('file'), async function (req, res) {
console.log('extraction start')


  let fileName = req.file.originalname

  

  let bufferData = req.file.buffer
  let stringData = bufferData.toString()
  let file = JSON.parse(stringData)
  
 
 
    await extractAcel(file, fileName, res)

    

    let acelFileName = fileName.split('.', 1)[0]+".jsonacel"

    const filepath = path.join(__dirname, acelFileName)
  
    const readStream = fs.createReadStream(filepath);
res.setHeader('Content-Type', 'application/octet-stream');
readStream.on('data', chunk => {
  res.write(chunk);
});
readStream.on('end', () => {
  res.end();
});

});

router.post('/post', upload.single('configFile'), async function (req, res, err) {
   
    if (err instanceof multer.MulterError) {
        console.log(err);
      } else if (err) {
        console.log(err);
      }

      let bufferData = req.file.buffer;
      let stringData = bufferData.toString();
      let jsonData = JSON.parse(stringData)
await res.render('updateConfigFile', {scs: jsonData.smartContracts});

  });

  router.post('/postSc', upload.single('ScCode'), async function (req, res, err) {
   
    if (err instanceof multer.MulterError) {
        console.log(err);
      } else if (err) {
        console.log(err);
      }

      let bufferData = req.file.buffer;
      let stringData = bufferData.toString();
      try {
        const ast = parser.parse(stringData)

      
        res.status(200).json(ast)
      }
      catch(e){
        if(e instanceof parser.ParserError){
            console.error(e.errors)
        }
      }

 
    return res
   
  });

  router.post('/update', async function (req, res, err) {
   
    return res.status(200).send(req.body.sc)

  });

module.exports = router;