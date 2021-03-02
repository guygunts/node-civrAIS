const ServiceService =require('../services/ServiceService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );

class ServiceController {
  async servicerlist(req, res) {
    log.info("request Data:",req.body)
    const ret = await ServiceService.Servicelist(req);
      res.json(ret);
      res.end();
  }
  async serviceaddupdatedelete(req, res) {
    log.info("request Data:",req.body)
    const ret = await ServiceService.Serviceaddupdatedelete(req);
    res.json(ret);
    res.end();
  }

}




const serviceController = new ServiceController();
module.exports= serviceController;