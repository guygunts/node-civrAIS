const testsentenceService =require('../services/testsentenceService');
const AdmZip = require('adm-zip');
const testtoolService =require('../services/testtoolService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
	var filessystem = require('fs');
	const process = require('process');
class testsentenceController {
    
    async listgetdatadropdown(req,res){
        const ret = await testsentenceService.getdatadropdown(req.body);
        res.json(ret);
        res.end();
        }

  async listtestsentence(req,res){
  log.info("request Data:",req.body)
  const ret = await testsentenceService.listTestsentence(req.body);
  res.json(ret);
  res.end();
  }

  async addlisttestsentence(req,res){
    log.info("request Data:",req.body)

    let datajson=[]
	if(req.body.sentence_name !== ''){
    let sentence=req.body.sentence_name.split(',')

        for(let i=0; i<sentence.length; i++){
           let data={
			   "project_id":req.body.project_id,
                "sentence_name":sentence[i],
                "intent_id":req.body.intent_id,
                "grammar_id":req.body.grammar_id,
                "concept_name":req.body.concept_name,
				"user_login":req.body.user_login
            }
            datajson.push(data)
        }
	}
	
		
		       if(typeof req.body.datafile !== 'undefined'){

            for(let i=0; i<req.body.datafile.length; i++){
                let data={
                    "project_id":req.body.project_id,
                     "sentence_name":req.body.datafile[i].Sentence,
                     "intent_id":req.body.intent_id,
                     "grammar_id":req.body.grammar_id,
                     "concept_name":req.body.concept_name,
                     "user_login":req.body.user_login
                 }
                 datajson.push(data)
             }
        }
        let resjson=[]
        for(let i=0; i<datajson.length; i++){
           let ret = await testsentenceService.addlistTestsentence(datajson[i]);
           resjson.push(ret)
        }
      res.json(resjson);
        res.end();
    
    }

    async editlisttestsentence(req,res){
        log.info("request Data:",req.body)
        const ret = await testsentenceService.editlistTestsentence(req.body);
        res.json(ret);
        res.end();
        }

    async deletelisttestsentence(req,res){
      log.info("request Data:",req.body)
      let ret
      if(typeof req.body.delete_data !== 'undefined'){
        for(let i=0; i<req.body.delete_data.length; i++){
             ret = await testsentenceService.deletelistTestsentence(req.body.delete_data[i]);
        }

      }else{
         ret = await testsentenceService.deletelistTestsentence(req.body);
      }
      console.log(ret)
      res.json(ret);
      res.end();
      }
	  
	 async downloadtestsentence(req,res){
		log.info("request Data:",req.body)
		
      const ret = await testsentenceService.downloadlistTestsentence(req.query.grammar_test_id);
	  console.log(ret[0].result_path)
      res.download(ret[0].result_path);
	 }		 
	
	
	 async listtestsentencefile(req,res){
  log.info("request Data:",req.body)
  const ret = await testsentenceService.listTestsentencefile(req.body);
  res.json(ret);
  res.end();
  }
  
  
	async addtestsentencefile(req,res){
		log.info("request Data:",req.body)
        const fs = require('fs')
        const path = require('path')
        const util = require('util');
     const xl = require('excel4node');
      
      const wb =new xl.Workbook()
	  Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear();
  var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
  var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  return "".concat(yyyy).concat(mm).concat(dd);
};

Date.prototype.yyyymmddhhmm = function() {
  var yyyymmdd = this.yyyymmdd();
  var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
  var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
  return "".concat(yyyymmdd).concat(hh).concat(min);
};

	  Date.prototype.yyyymmddhhmmss = function() {
  var yyyymmddhhmm = this.yyyymmddhhmm();
  var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
  return "".concat(yyyymmddhhmm).concat(ss);
};
let d = new Date();
     let  namefile=`${req.body.grammar_version}-${d.yyyymmddhhmmss()}`;
     const headingColumnNames = [
         "No",
         "Sentence",
         "Return Tag(nlu)",
         "grammar",
         "concept"
     ]
     const getversion= await testtoolService.getversionfrombuild(req.body)
	 let data = await testsentenceService.getgrammar(req.body)

     const zip = new AdmZip();
     const data1=await fs.readdirSync(getversion[0].full_patch)  //getversion
     let filesList = await data1.filter(function(e){
         return path.extname(e).toLowerCase() === '.gram'
       });
	      let check
     for(var i = 0; i < data.length;i++){
        for(let j=0; j<filesList.length; j++){
            if(data[i].grammar==filesList[j]){
				
				if(check == filesList[j]){
					break
				}else{
					zip.addLocalFile(getversion[0].full_patch+filesList[j]);
					 check =filesList[j]
                break
				}
            }
        }
         
     }
     const ws = wb.addWorksheet('Sheel1');
     let headingColumnIndex = 1;
     headingColumnNames.forEach(heading => {
         ws.cell(1, headingColumnIndex++)
             .string(heading)
     });
     let rowIndex = '2';
     data.forEach( record => {
         let columnIndex = 1;
         Object.keys(record).forEach(columnName =>{
			 if(typeof record [columnName] == 'number'){
              ws.cell(rowIndex,columnIndex++).number(record [columnName]+1)
			 }else{
				 ws.cell(rowIndex,columnIndex++).string(record [columnName])
			 }
          });
         rowIndex++;
     });
		console.log('pass execl')	
      let dir = `${pathdev.parsed.baseHomefileexcel}`;
     if (!filessystem.existsSync(dir)) {
         filessystem.mkdirSync(dir);
     }
     wb.writeP = util.promisify(wb.write);

     await wb.writeP(`${pathdev.parsed.baseHomefileexcel}${namefile}.xlsx`)
     zip.addLocalFile(`${pathdev.parsed.baseHomefileexcel}${namefile}.xlsx`);
    //await wb.writeP(`uploadfileexcel/${namefile}.xlsx`)
    // zip.addLocalFile(`uploadfileexcel/${namefile}.xlsx`);
     const downloadName = `zipfiletestsentence/file-test-${Date.now()}.zip`;
  console.log('pass zip')
     const zipz = zip.toBuffer();
	 process.chdir(`${pathdev.parsed.baseHome}`);
     zip.writeZip(downloadName);
	console.log('pass create zip')
     
	 		let datajson={
                 'project_id':req.body.project_id,
                 'excel_file_name':`${namefile}.xlsx`,
                 'user_login':req.body.user_login,
                 'excelFile':`${dir}${namefile}.xlsx`,
                 'zip':downloadName
             }
             
      const ret = await testsentenceService.addTestsentencefile(datajson,downloadName);
	  res.json(ret);
      res.end();
	 }	
	 
	  async editlisttestsentencefile(req,res){

        var multer = require('multer')
        var filessystem = require('fs');
    
        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
                let div=pathdev.parsed.baseHomereulttextsentence
                if (!filessystem.existsSync(div)) {
                    filessystem.mkdirSync(div);
                }
                cb(null, div);
            },
            filename: (req, file, cb) => {
                console.log(file.originalname)
                cb(null, file.originalname) 
            }
        });
    
    
        var upload = multer({ storage}).any()
    
        upload(req, res, async function (err) {
			console.log('==============================================================')
			console.log(req.body)
			if(req.body.status.indexOf('Success')>=0){
           req.body.result_path=`${pathdev.parsed.baseHomereulttextsentence}${req.body.filename}`
			}else{
			req.body.result_path=''
			}
               const ret = await testsentenceService.editTestsentencefile(req.body);
               
               res.json(ret);
               res.end();
    
        })
        }

    async deletelisttestsentencefile(req,res){
      log.info("request Data:",req.body)
      const ret = await testsentenceService.deleTestsentencefile(req.body);
      res.json(ret);
      res.end();
      }
	  
	 async downloadtestsentencefile(req,res){
		log.info("request Data:",req.body)
		
      const ret = await testsentenceService.downloadTestsentencefile(req.query.grammar_test_id);
	  console.log(ret[0].result_path)
      res.download(ret[0].result_path);
	 }	
}


const TestsentenceController = new testsentenceController();
module.exports= TestsentenceController;