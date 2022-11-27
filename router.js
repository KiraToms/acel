const express = require('express');
const app = express();
const router = express.Router();
const upload = require('./uploadMiddleware');
const multer = require('multer')
const parser = require('@solidity-parser/parser');
const { json } = require('body-parser');
const fs = require('fs');

router.get('/', async function (req, res) {
  await res.render('index');
});

router.get('/new', async function (req, res) {
  await res.render('template');
});

router.post('/create',  function (req, res, err) {

//   console.log('it worked')
    
  let jsonData = req.body

 
  let jsonContent = JSON.stringify(jsonData);
  //put it in public
  fs.writeFile("configTest2.json", jsonContent, 'utf8', function (err) {
    // fs.writeFile("KittyAOcel_22.jsonocel", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");

});

let rawdata = fs.readFileSync('configTest2.json');
//let config = JSON.parse(rawdata);
  //console.log(jsonData)   
 res.json(rawdata)
 //res.render('template');
 //res.send("About this wiki");
// await res.render('updateConfigFile', {scs: jsonData.smartContracts});

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
    // return res.status(200).json(jsonData)
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

        //get all enums as list propose as artifs
        //selected one should be kept as temp passed to form edit and written in template
        //but first give template as form filled out by user no help just interface
        //suggestions are next
        //ask med for the the js or node defill options best interactive faster code
        res.status(200).json(ast)
      }
      catch(e){
        if(e instanceof parser.ParserError){
            console.error(e.errors)
        }
      }

    //   let jsonData = JSON.parse(stringData)
    return res
    // await res.render('updateConfigFile', {scs: jsonData.smartContracts});

  });

  router.post('/update', async function (req, res, err) {
   
    return res.status(200).send(req.body.sc)

  });

module.exports = router;