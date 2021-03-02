const Listupsellhistory =require('../services/upsellhistoryService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const fs = require('fs');
class ListupsellhistoryController {
	
	  async generatexml(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listupsellhistory.generatexml(req.body);
    let columnname="tbl_civr_package_upsell_history"
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
	
  async Listupsellhistory(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listupsellhistory.Listupsellhistory(req.body);
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

  async editlistupsellhistory(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listupsellhistory.editlistupsellhistory(req.body);
      res.json(ret);
      res.end();
  }
  
  async deletelistupsellhistory(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listupsellhistory.deletelistupsellhistory(req.body);
      res.json(ret);
      res.end();
  }

  async addlistupsellhistory(req, res) {
    log.info("request Data:",req.body)
      const ret =await Listupsellhistory.addlistupsellhistory(req.body);
      res.json(ret);
      res.end();
  }

}
const listupsellhistoryController = new ListupsellhistoryController();
module.exports= listupsellhistoryController;