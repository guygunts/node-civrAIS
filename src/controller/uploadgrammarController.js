const UploadgrammarService = require('../services/uploadgrammarService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const process = require('process');
class UploadgrammarController{
	
	async download (req,res){
		console.info(req.params)
		const data =await UploadgrammarService.downloadresult(req.params);
        res.download(data[0].url_patch,data[0].result_name)
    }
	
    async updategrammarresult (req,res){
        const update = await UploadgrammarService.updategrammarresult(req.body);
        res.json(update);
        res.end();
    }

	async uploadvoicelog (req,res){
		console.log("data request:",req.body)
        const update = await UploadgrammarService.uploadvoicelog(req.body);
        res.json(update);
        res.end();
    }
	
    async uploadgrammarController (req,res){
		console.log("data request:",req.body)
        const upload = await UploadgrammarService.UploadgrammarService(req.body);
        res.json(upload);
        res.end();
    }
    async uploadgrammar(req, res, next) {
        log.info("request Data uploadgrammar:"+req)
        var multer = require('multer')

        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploadgrammar/');
            },
            filename: (req, file, cb) => {
                
                cb(null, file.originalname + '-' + Date.now()) // Rename original filenam + time stamp
            }
        });
        var upload = multer({ storage }).any()
       
        var filessystem = require('fs');
		process.chdir(`${pathdev.parsed.baseHome}`);
        var dir = `${pathdev.parsed.baseHomeupload}`;
		console.log(`Current directory: ${process.cwd()}`);
        if (!filessystem.existsSync(dir)) {
            filessystem.mkdirSync(dir);
        }
        upload(req, res, function (err) {
            log.info("request Data upload:",req)
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err)
                return
            } else if (err) {
                console.log(err)
                return
                // An unknown error occurred when uploading.
            }
            if (err) {
                return res.end(err);
            }
           
            var obj = {
                "project_id": req.body.project_id,
                "user_login": req.body.user_login,
                "file_name": req.files[0].filename,
                "file_desc": req.body.file_desc
            }
           // console.log(obj);
            UploadgrammarService.uploadGrammar(obj)
          

            var result = {
                "code": 200,
                "file_name": req.files[0].filename
            }


            const excelToJson = require('convert-excel-to-json');
            var path = require('path');
            var filePath = path.resolve(pathdev.parsed.baseHomeupload+ req.files[0].filename);
            const result1 = excelToJson({
                sourceFile: filePath
            });
            console.log(filePath)
            console.log(result1.Sheet1)
            res.json(result);
            res.end();

        })

    }
    async processFile(req,res) {
        log.info("request Data processFile:",req)
        const Envnt =await UploadgrammarService.processFile(req);
        res.json(Envnt);
        res.end();
    }
    async buildGrammar(req,res) {
        log.info("request Data buildGrammar:",req)
        const buildgrammar = await UploadgrammarService.buildGrammar(req);
        res.json(buildgrammar);
        res.end();
    }
    async downloadGrammar(req,res){

	const data =await UploadgrammarService.downloadresult(req.params);
       // var pathResult = "/app/pyunimrcp/result/"
	   console.log(data)
        res.download(data.recordset[0].url_patch +"/"+ "/" + req.params.filename,req.params.filename)
            res.download(req.params.file_name)
            res.end()
    }
	
	async deploy(req,res){

            const datadeploy =await UploadgrammarService.deploy(req.body);
            res.json(datadeploy)
             res.end();
        }
		
}
const uploadgrammarController =new UploadgrammarController;
module.exports = uploadgrammarController;
