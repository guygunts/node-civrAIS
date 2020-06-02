const Listpackget =require('../services/ListpackgetService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );

class ListpackgetController {
  async Listpackget(req, res) {
    log.info("request Data:",req.body)
    const ret = await Listpackget.ListpackgetService(req.body);
      res.json(ret);
      res.end();
  }
}
const listpackgetController = new ListpackgetController();
module.exports= listpackgetController;