const logService =require ('../services/logService'); 

class logController{
    async logContrller(req,res){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString('utf8');
        });
        req.on('end', async () => {
            try {
                const Insert = await logService.InsertLog(body);
                //console.clear()
                var result = {
                    "code": Insert[0][0].result,
                    "msg": Insert[0][0].msg
                }
                console.log(result)
                res.json(result)
                res.end();

            } catch (err) {
                res.json(err)
                res.end
            }
        });
    }
    async converController(req,res){
       const conver= await logService.getconversation(req);
        res.json(conver);
        res.end();
    }

    async updatevoiceController(req,res){
       const updarte= await logService.updatevoice(req);
       res.json(updarte)
       res.end();
         
     }

    async logdetail(req,res){
        const log= await logService.logdetail(req);
        res.json(log);
        res.end();
    }

    async logvoice(req,res){
        const log= await logService.logvoice(req);
        res.json(log);
        res.end();
    }

    async logcept(req,res){
        const log= await logService.logcept(req);
        res.json(log);
        res.end();
    }

    async summaryqc(req,res){
        const summaryqc= await logService.summaryqc(req.body);
        res.json(summaryqc);
        res.end();
    }
}
const LogController =new logController();
module.exports =LogController;
