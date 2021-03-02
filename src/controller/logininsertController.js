const loginsertService =require('../services/loginsertService');
class LoginsertController {
  async logininsert(req, res) {
    const ret = await loginsertService.insertlog(req.body);
      res.json(ret);
      res.end();
  }

  async loginview(req, res) {
    const ret = await loginsertService.Listlog(req.body);
      res.json(ret);
      res.end();
  }
  
}




const loginsertController = new LoginsertController();
module.exports= loginsertController;