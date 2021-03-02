const ConfmapService =require('../services/confmapService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
class ConfmapController {
	
  async listconfmap(req,res){
  log.info("request Data:",req.body)
  const ret = await ConfmapService.listConfmap(req.body);
  res.json(ret);
  res.end();
  }

  async updatelistConfmap(req,res){
  log.info("request Data:",req.body)
  const ret = await ConfmapService.updatelistConfmap(req.body);
  res.json(ret);
  res.end();
  }

  async addlistConfmap(req,res){
    log.info("request Data:",req.body)
    const ret = await ConfmapService.addlistConfmap(req.body);
    res.json(ret);
    res.end();
    }

    async deletelistConfmap(req,res){
      log.info("request Data:",req.body)
      const ret = await ConfmapService.deletelistConfmap(req.body);
      res.json(ret);
      res.end();
      }
	  
	  async listConfinputmap(req,res){
        log.info("request Data:",req.body)
        const ret = await ConfmapService.listConfinputmap(req.body);
        res.json(ret);
        res.end();
        }
      
        async updatelistConfinputmap(req,res){
        log.info("request Data:",req.body)
        const ret = await ConfmapService.updatelistConfinputmap(req.body);
        res.json(ret);
        res.end();
        }
      
        async addlistConfinputmap(req,res){
          log.info("request Data:",req.body)
          const ret = await ConfmapService.addlistConfinputmap(req.body);
          res.json(ret);
          res.end();
          }
      
          async deletelistConfinputmap(req,res){
            log.info("request Data:",req.body)
            const ret = await ConfmapService.deletelistConfinputmap(req.body);
            res.json(ret);
            res.end();
            }

}




const confmapController = new ConfmapController();
module.exports= confmapController;