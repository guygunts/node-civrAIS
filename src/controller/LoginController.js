const loginService =require('../services/LoginService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );

class LoginController {
  async loginUser(req, res) {
    log.info("request Data:",req.body)
    const ret = await loginService.loginUser(req.body);
      res.json(ret);
      res.end();
  }
  async adminMenu(req, res) {
    log.info("request Data:",req.body)
    const ret = await loginService.adminMenu(req);
    res.json(ret);
    res.end();
  }
  async dashBoard(req, res) {
    log.info("request Data:",req.body)
    const ret = await loginService.dashBoard(req);
    res.json(ret);
    res.end();
  }
  async rePort(req, res) {
    log.info("request Data:",req.body)
    const ret = await loginService.rePort(req);
    res.json(ret);
    res.end();
  }
}




const loginController = new LoginController();
module.exports= loginController;