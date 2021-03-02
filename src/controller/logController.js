const logService =require ('../services/logService'); 
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const AdmZip = require('adm-zip');
class logController{
    async logContrller(req,res){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString('utf8');
        });
        req.on('end', async () => {
            try {
				 log.info("request Data:",req.body)
                const Insert = await logService.InsertLog(body);
                //console.clear()
                var result = {
                    "code": Insert[0][0].result,
                    "msg": Insert[0][0].msg
                }
                console.log(result)
                res.json(result)
                res.end();

            } catch (err) {
                res.json(err)
                res.end
            }
        });
    }
    async logContrllerReprocess(req,res){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString('utf8');
        });
        req.on('end', async () => {
            try {
				 log.info("request Data:",req.body)
                const Insert = await logService.InsertLog(body);
                console.log(Insert)
                var result = {
                    "code": Insert.recordsets[0][0].result,
                    "msg": Insert.recordsets[0][0].msg
                }
                console.log(result)
                res.json(result)
                res.end();

            } catch (err) {
                res.json(err)
                res.end
            }
        });
    }
    async converController(req,res){
		 log.info("request Data:",req.body)
       const conver= await logService.getconversation(req);
        res.json(conver);
        res.end();
    }

    async updatevoiceController(req,res){
		 log.info("request Data:",req.body)
       const updarte= await logService.updatevoice(req);
       res.json(updarte)
       res.end();
         
     }

    async logdetail(req,res){
		 log.info("request Data:",req.body)
        const data= await logService.logdetail(req);
        res.json(data);
        res.end();
    }

    async logvoice(req,res){
		 log.info("request Data:",req.body)
        const data= await logService.logvoice(req);
        res.json(data);
        res.end();
    }

    async logcept(req,res){
		 log.info("request Data:",req.body)
        const data= await logService.logcept(req);
        res.json(data);
        res.end();
    }

    async summaryqc(req,res){
		 log.info("request Data:",req.body)
        const summaryqc= await logService.summaryqc(req.body);
        res.json(summaryqc);
        res.end();
    }
	
	async downloadgrammar(req,res){
        const path = require('path')
        const fs = require('fs')
        let dir = './zipdownload/';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

	console.log(req)
    const data=await fs.readdirSync(req.body.full_path)  
        let filesList = await data.filter(function(e){
            return path.extname(e).toLowerCase() === '.gram'
          });
    const zip = new AdmZip();
    for(var i = 0; i < filesList.length;i++){
        zip.addLocalFile(req.body.full_path+filesList[i]);
    }
    zip.addLocalFile(pathdev.parsed.baseHomeupload+req.body.file_excel);
    // Define zip file name
    const downloadName = `gram-${Date.now()}.zip`;
 
    const data1 = zip.toBuffer();
 
    // save file zip in root directory
    zip.writeZip(dir+downloadName);
    
    // code to download zip file
 
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${downloadName}`);
    res.set('Content-Length',data1.length);
    res.send(data1);
    }
}
const LogController =new logController();
module.exports =LogController;
