const configService =require('../services/configService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const fs = require('fs');
class ConfigController {
	
 async generateIni(req, res) {
  log.info("request Data:",req.body)
  const ret = await configService.generateIni(req.body);
  let text=`[Settings]\n`
  ret.forEach((data)=>{
     let datacomment=`#===rule${data.valiablename} ${data.Page} ${data.item} ${data.value}\n`
     text +=datacomment
    let datafrom =`config_no.${data.valiablename}=${data.value}\n`
    text +=datafrom
  })

  let path=`${ret[0].dumppath}${ret[0].configfilename}.ini`
  console.log(path)
  fs.writeFileSync(path, text, function (err) {
    if (err) return console.log(err);
    console.log('done');
    });
    let data={
      "code":200,
      "mess":"success"
    }
    res.json(data);
    res.end();
  }

  async listconfig(req,res){
  log.info("request Data:",req.body)
  const ret = await configService.listconfig(req.body);
  res.json(ret);
  res.end();
  }

  async updatelistconfig(req,res){
  log.info("request Data:",req.body)
  const ret = await configService.updatelistconfig(req.body);
  res.json(ret);
  res.end();
  }

  async addlistconfig(req,res){
    log.info("request Data:",req.body)
    const ret = await configService.addlistconfig(req.body);
    res.json(ret);
    res.end();
    }

    async deletelistconfig(req,res){
      log.info("request Data:",req.body)
      const ret = await configService.deletelistconfig(req.body);
      res.json(ret);
      res.end();
      }


async listfilename(req,res){
  log.info("request Data:",req.body)
  const ret = await configService.listnameflie(req.body);
  res.json(ret);
  res.end();
  }

  async updatenamefile(req,res){
  log.info("request Data:",req.body)
  const ret = await configService.updatenamefile(req.body);
  res.json(ret);
  res.end();
  }

  async insertnamefile(req,res){
    log.info("request Data:",req.body)
    const ret = await configService.insertnamefile(req.body);
    res.json(ret);
    res.end();
    }

    async deletenamefile(req,res){
      log.info("request Data:",req.body)
      const ret = await configService.deletenamefile(req.body);
      res.json(ret);
      res.end();
      }
}




const configController = new ConfigController();
module.exports= configController;