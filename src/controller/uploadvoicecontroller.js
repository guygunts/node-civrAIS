const uploadvoiceService =require('../services/uploadvoiceService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const process = require('process');
const filessystem = require('fs');
class UploadvoiceController {
    
    async listgetdatadropdown(req,res){
        const ret = await uploadvoiceService.getdatadropdown(req.body);
        res.json(ret);
        res.end();
        }

  async listuploadvoice(req,res){
  log.info("request Data:",req.body)
  const ret = await uploadvoiceService.listUploadvoice(req.body);
  res.json(ret);
  res.end();
  }

  async addlistuploadvoice(req,res){
    log.info("request Data:",req.body)
    var multer = require('multer')
    
	const ffmpeg = require('fluent-ffmpeg');
	const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    ffmpeg.setFfmpegPath(ffmpegPath);
	let dir
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
              dir = `${pathdev.parsed.baseHomevoice}`;
    if (!filessystem.existsSync(dir)) {
        filessystem.mkdirSync(dir);
    }
    dir +=`${req.body.grammar_name}/`
    if (!filessystem.existsSync(dir)) {
        filessystem.mkdirSync(dir);
    }
    dir +=`${req.body.intent_name}/`
    if (!filessystem.existsSync(dir)) {
        filessystem.mkdirSync(dir);
    }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            
            cb(null, file.originalname) 
        }
    });


    var upload = multer({ storage}).any()

    upload(req, res, async function (err) {

		let datares=[]
		let datajson={
			   'code':200,
			   'msg':'success',
			   'data':datares
		   }
       console.log(req.files)
	   let name
	   for(let i=0; i< req.files.length; i++){
		   name=req.files[i].filename.split('.')
		   console.log(name[0])
 ffmpeg(`${dir}${req.files[i].filename}`).toFormat('wav').audioFrequency(8000).audioChannels('1').audioCodec('pcm_mulaw').on('error', (err) => {
    console.log('An error occurred: ' + err.message);
})
.on('progress', (progress) => {

    console.log('Processing: ' + progress.targetSize + ' KB converted');
})
.on('end', async function() {

		  if(i+1 == req.files.length){
			  for(let i=0; i< req.files.length; i++){
				  filessystem.unlinkSync(`${dir}${req.files[i].filename}`)
			  }
    res.json(datajson);

  res.end();
  }
		
}).save(`${dir}${name[0]}.wav`);

	
    let datajsonpost={
                'no':i,
				'project_id':req.body.project_id,
                'grammar_id':req.body.grammar_id,
                'intent_id':req.body.intent_id,
                'voice_name':`${name[0]}.wav`,
                'user_login':req.body.user_login,
                'path':`${dir}${name[0]}.wav`
            }
			let ret = await uploadvoiceService.addlistConfmap(datajsonpost);
		   
		   datares.push(ret)
		   
}


    })
    }

    async deletelistuploadvoice(req,res){
      log.info("request Data:",req.body)
      const ret = await uploadvoiceService.deletelistConfmap(req.body);
      res.json(ret);
      res.end();
      }

      async editlistuploadvoice(req,res){
        log.info("request Data:",req.body)
        const ret = await uploadvoiceService.editlistConfmap(req.body);
        res.json(ret);
        res.end();
        }
		
	      async editlistuploadvoice(req,res){
        log.info("request Data:",req.body)
        const ret = await uploadvoiceService.editlistConfmap(req.body);
        res.json(ret);
        res.end();
        }

        async movefileuploadvoice(req,res){
            log.info("request Data:",req.body)
            const { COPYFILE_EXCL } = filessystem.constants;

            const newjson = await uploadvoiceService.listmovefilevoice(req.body);
			if (!filessystem.existsSync(`${pathdev.parsed.baseHomevoice}${req.body.grammmarname}/${req.body.intentname}/`)) {
					filessystem.mkdirSync(`${pathdev.parsed.baseHomevoice}${req.body.grammmarname}/${req.body.intentname}/`);
					}
            for(let i=0; i<newjson.length; i++){
                try{
					
	
                    let news=`${pathdev.parsed.baseHomevoice}${req.body.grammmarname}/${req.body.intentname}/${newjson[i].voice_name}`
                    newjson[i].newpath=news
                    filessystem.copyFileSync(newjson[i].path,news,COPYFILE_EXCL)
                }catch(err){
                    console.log(err)
                }
                    filessystem.unlinkSync(newjson[i].path)
            }
        
             const ret = await uploadvoiceService.movefilevoice(req.body);
            res.json(ret);
            res.end();
            }	
}


const uploadvoiceController = new UploadvoiceController();
module.exports= uploadvoiceController;