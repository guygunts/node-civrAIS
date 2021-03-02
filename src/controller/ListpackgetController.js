const Listpackget =require('../services/ListpackgetService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const fs = require('fs');
class ListpackgetController {
  async Listpackget(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listpackget.ListpackgetService(req.body);
	  for(let i=0; i<ret.data.length; i++){
    if(ret.data[i].ENABLE == 0){
     ret.data[i].ENABLE='N'
    }else{
     ret.data[i].ENABLE='Y'
    }
  }
      res.json(ret);
      res.end();
  }

  async getdatalistpackget(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listpackget.getdatalistpackget(req.body);
      res.json(ret);
      res.end();
  }

  async editlistpackget(req, res) {
    log.info("request Data:",req.body)
    if(req.body.type_size == 'MB'){
      let covermb=req.body.Data_GB*1024
      req.body={...req.body,Data_Pack_Kb:covermb}

    }else  if(req.body.type_size == 'GB'){

      let covergb=req.body.Data_GB*1024*1024
      req.body={...req.body,Data_Pack_Kb:covergb}
    }else if(req.body.type_size == 'KB'){
      req.body={...req.body,Data_Pack_Kb:req.body.Data_GB}
    }else if(req.body.type_size =='Unlimit'){
		req.body.Data_GB='Unlimit'
      req.body={...req.body,Data_Pack_Kb:0}

    }


    const ret = await Listpackget.editlistpackget(req.body);
      res.json(ret);
      res.end();
  }
  
  async deletelistpackget(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listpackget.deletelistpackget(req.body);
      res.json(ret);
      res.end();
  }

  async addlistpackget(req, res) {
    log.info("request Data:",req.body)

    if(req.body.type_size == 'MB'){
      let covermb=req.body.Data_GB*1024
      req.body={...req.body,Data_Pack_Kb:covermb}

    }else  if(req.body.type_size == 'GB'){

      let covergb=req.body.Data_GB*1024*1024
      req.body={...req.body,Data_Pack_Kb:covergb}
    }else if(req.body.type_size == 'KB'){

      req.body={...req.body,Data_Pack_Kb:req.body.Data_GB}
    }else if(req.body.type_size =='Unlimit'){
		req.body.Data_GB='Unlimit'
      req.body={...req.body,Data_Pack_Kb:0}

    }


    const ret =  await Listpackget.addlistpackget(req.body);
      console.log(ret)
      res.json(ret);
      res.end();
  }

  async generatexml(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listpackget.generatexml(req.body);
    let columnname="tbl_civr_ontop_postpaid,tbl_civr_ontop_prepaid"
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

}
const listpackgetController = new ListpackgetController();
module.exports= listpackgetController;