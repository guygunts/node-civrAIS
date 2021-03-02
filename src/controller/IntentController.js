const IntentService =require('../services/IntentService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );

class IntentController {
  async intentlist(req, res) {
    log.info("request Data:",req.body)
    const ret = await IntentService.Intentlist(req);
      res.json(ret);
      res.end();
  }
  async intentaddupdatedelete(req, res) {
    log.info("request Data:",req.body)
    const ret = await IntentService.Intentaddupdatedelete(req);
    res.json(ret);
    res.end();
  }

}




const intentController = new IntentController();
module.exports= intentController;