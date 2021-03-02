const grammarService =require('../services/grammarService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev = require('dotenv').config({
  path: './config/dev.env'
});
const process = require('process');
class GrammarController {
  async Grammarlist(req, res) {
    log.info("request Data:",req.body)
    const ret = await grammarService.grammarlist(req);
      res.json(ret);
      res.end();
  }
  async grammaraddupdatedelete(req, res) {
    log.info("request Data:",req.body)
    const ret = await grammarService.grammaraddupdatedelete(req);
    res.json(ret);
    res.end();
  }
  async grammardeploylist(req, res) {
    log.info("request Data:",req.body)
    const ret = await grammarService.grammardeploylist(req);
      res.json(ret);
      res.end();
  } 
  async getfilegrammar(req, res) {
    log.info("request Data:",req.body)
    const ret = await grammarService.getfilegrammar(req);
      res.json(ret);
      res.end();
  } 
  async addgrammar(req, res) {
    log.info("request Data:", req.body)
    const ret = await grammarService.addgrammar(req.body);
    res.json(ret);
    res.end();
 }
 async addgrammarfile(req, res) {
  log.info("request Data:", req.body)
  const ret = await grammarService.addgrammarfile(req.body);
  res.json(ret);
  res.end();
}
async serverlist(req, res) {
  log.info("request Data:", req.body)
  const ret = await grammarService.serverlist(req);
  res.json(ret);
  res.end();
}
async grammarIntentlist(req, res) {
  log.info("request Data:", req.body)
  const ret = await grammarService.grammarIntentList(req);
  res.json(ret);
  res.end();
}
async uploadgrammarfile(req, res) {
  try {
    console.log(req.body)
      log.info("request Data:", req.body)
      var multer = require('multer')
      var namefile
      var storage = multer.diskStorage({
          destination: (req, file, cb) => {
              cb(null, 'uploadgrammarfile/');
          },
          filename: (req, file, cb) => {
              namefile = file.originalname + '-' + Date.now()
              cb(null, file.originalname + '-' + Date.now()) // Rename original filenam + time stamp
          }
      });
      var upload = multer({
          storage
      }).any()

      var filessystem = require('fs');
      process.chdir(`${pathdev.parsed.baseHome}`);
      var dir = `${pathdev.parsed.baseHomeuploadgrammarfile}`;
      console.log(`Current directory: ${process.cwd()}`);
      if (!filessystem.existsSync(dir)) {
          filessystem.mkdirSync(dir);
      }
      upload(req, res, function (err) {
          log.info("request grammar file upload:", req)
          if (err instanceof multer.MulterError) {
              console.log(err)
              return
          } else if (err) {
              console.log(err)
              return err
          }
          if (err) {
              return res.end(err);
          }
          
          var path = require('path');
          var filePath = path.resolve(pathdev.parsed.baseHomeuploadgrammarfile + namefile);
          const fs = require('fs');
         
          async function updateUploadDB() {
              try {
                  var obj = {
                      "project_id": req.body.project_id,
                      "grammar_id": req.body.grammar_id,
                      "file_name": req.files[0].filename,
                      "file_path": filePath,
                      "user_login": req.body.user_login
              }
                  console.log(obj)
                  const uploadcallflow = await grammarService.uploadgrammarfile(obj)
                  console.log(uploadcallflow)
                  res.json(uploadcallflow);
                  res.end();
              } catch (error) {
                  console.log(error)
              }
          }

          updateUploadDB()

          // } else {
          //     var result = {
          //         "code": 401,
          //         "file_name": 'Please Upload  XML  File...'
          //     }
          //     console.log(result)
          //    res.json(result);
          //    res.end();
          // }


      })


  } catch (error) {
      console.log(error)
  }


}

}




const grammarController = new GrammarController();
module.exports= grammarController;