const testtoolService =require('../services/testtoolService');
const uploadService =require('../services/uploadvoiceService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
	var filessystem = require('fs');
class TesttoolController {
    
    async listgetdatadropdown(req,res){
        const ret = await testtoolService.getdatadropdown(req.body);
        res.json(ret);
        res.end();
        }

  async listtesttool(req,res){
  log.info("request Data:",req.body)
  const ret = await testtoolService.listTesttool(req.body);
  res.json(ret);
  res.end();
  }

  async addlisttesttool(req,res){
    log.info("request Data:",req.body)
	let path = require('path');
    const xl = require('excel4node');
    const wb = new xl.Workbook();
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
        "index",
        "คำถาม (Utterances)",
        "expected intention",
        "InputFile",
		"grammar",
		"concept",
		
    ]
	
	const getversion= await testtoolService.getversionfrombuild(req.body)

	const readfile=await filessystem.readdirSync(getversion[0].full_patch)  
	const data= await uploadService.datafromtesttoolcalluploadvoice(req.body)
    let namegramar=req.body.grammar_name
	//req.body.grammar_name=`${getversion[0].full_patch}${namegramar}`
	let checkdata=0
	let filesList = await readfile.filter(function(e){
        return path.extname(e).toLowerCase() === '.gram'
      });

	for(let j=0; j<data.length; j++){
	for(let i=0; i<filesList.length; i++){
		if(filesList[i] == data[j].grammar){
			data[j].grammar=`${getversion[0].full_patch}${data[j].grammar}`
				checkdata=1
				continue
		}
	}
	}
	if(checkdata ==0){
		let ret={
			'code':401,
			'mess':'Grammar not found'
		}
		res.json(ret);
        res.end();
		return false
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
             ws.cell(rowIndex,columnIndex++).string(record [columnName])
         });
        rowIndex++;
    });
    
	let dir = `${pathdev.parsed.baseHomefileexcel}`;
    if (!filessystem.existsSync(dir)) {
        filessystem.mkdirSync(dir);
    }
    wb.write(`${pathdev.parsed.baseHomefileexcel}${namefile}.xlsx`);

           let datajson={
                'grammar_id':req.body.grammar_id,
                'intent_id':req.body.intent_id,
                'project_id':req.body.project_id,
                'excel_file_name':`${namefile}.xlsx`,
                'user_login':req.body.user_login,
				'excelFile':`${dir}${namefile}.xlsx`,
				'path_build':getversion[0].full_patch
            }
			
           let ret = await testtoolService.addlistTesttool(datajson);
		   console.log(ret)
      res.json(ret);
        res.end();
    
    }

    async editlisttesttool(req,res){
        log.info("request Data:",req.body)
        const ret = await testtoolService.editlistTesttool(req.body);
        res.json(ret);
        res.end();
        }

    async deletelisttesttool(req,res){
      log.info("request Data:",req.body)
      const ret = await testtoolService.deletelistTesttool(req.body);
      res.json(ret);
      res.end();
      }
	  
	 async downloadtesttool(req,res){
		log.info("request Data:",req.body)
		
      const ret = await testtoolService.downloadlistTesttool(req.query.grammar_test_id);
	  //const readfile=await filessystem.readdirSync(ret[0].result_path)  
	  console.log(ret[0].result_path)
      res.download(ret[0].result_path);
	 }		 

}


const testtoolController = new TesttoolController();
module.exports= testtoolController;