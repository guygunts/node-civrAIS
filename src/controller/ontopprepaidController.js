const Listontopprepaid =require('../services/ontopprepaidService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const fs = require('fs');
class ListontopprepaidController {
	
  async generatexml(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listontopprepaid.generatexml(req.body);
    let columnname="tbl_civr_ontop_prepaid"
    let arraycolumnname=columnname.split(',')
    for(let i=0; i<ret.length; i++){
      let text=`<?xml version="1.0" ?>\n`
        text+=`<RECORDS>\n`
      for(let j=0; j<ret[i].length; j++){
        text+=`<DATA_RECORD>\n`
        for(const [key,value] of Object.entries(ret[i][j])){
			if(value == null){
				text+=`<${key}></${key}>\n`
			}else{
				text+=`<${key}>${value}</${key}>\n`
			}
          
        }
        text+=`</DATA_RECORD>\n`
      }
      text+=`</RECORDS>\n`
      let path=`${pathdev.parsed.baseHomexml}${arraycolumnname[i]}.xml`
      console.log(path)
      fs.writeFileSync(path, text, function (err) {
        if (err) return console.log(err);
        console.log('done');
        });
    }

      let data={
        "code":200,
        "mess":"success"
      }
      res.json(data);
      res.end();
    }
	
  async Listontopprepaid(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listontopprepaid.Listontopprepaid(req.body);
		  for(let i=0; i<ret.data.length; i++){
    if(ret.data[i].Enable == 0){
     ret.data[i].Enable='N'
    }else{
     ret.data[i].Enable='Y'
    }
  }
      res.json(ret);
      res.end();
  }

  async editlistontopprepaid(req, res) {
    log.info("request Data:",req.body)
	 if(req.body.Data_pack_type == 'MB'){
      let covermb=req.body.Data_pack*1024
      req.body={...req.body,Data_Pack_Kb:covermb}

    }else  if(req.body.Data_pack_type == 'GB'){

      let covergb=req.body.Data_pack*1024*1024
      req.body={...req.body,Data_Pack_Kb:covergb}
    }else if(req.body.Data_pack_type == 'KB'){

      req.body={...req.body,Data_Pack_Kb:req.body.Data_pack}
    }else if(req.body.Data_pack_type =='Unlimit'){
		req.body.Data_GB='Unlimit'
      req.body={...req.body,Data_Pack_Kb:0}

    }
    const ret = await Listontopprepaid.editlistontopprepaid(req.body);
      res.json(ret);
      res.end();
  }
  
  async deletelistontopprepaid(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listontopprepaid.deletelistontopprepaid(req.body);
      res.json(ret);
      res.end();
  }

  async addlistontopprepaid(req, res) {
    log.info("request Data:",req.body)
	if(req.body.Data_pack_type == 'MB'){
      let covermb=req.body.Data_pack*1024
      req.body={...req.body,Data_Pack_Kb:covermb}

    }else  if(req.body.Data_pack_type == 'GB'){

      let covergb=req.body.Data_pack*1024*1024
      req.body={...req.body,Data_Pack_Kb:covergb}
    }else if(req.body.Data_pack_type == 'KB'){

      req.body={...req.body,Data_Pack_Kb:req.body.Data_pack}
    }else if(req.body.Data_pack_type =='Unlimit'){
		req.body.Data_GB='Unlimit'
      req.body={...req.body,Data_Pack_Kb:0}

    }
     const ret= await Listontopprepaid.addlistontopprepaid(req.body); 
      res.json(ret);
      res.end();
  }

}
const listontopprepaidController = new ListontopprepaidController();
module.exports= listontopprepaidController;