const performance=require('../services/PerformanceLogService');

class performanceController{
    async performanceController(req,res){
        let body='';
        req.on('data', chunk => {
            body += chunk.toString('utf8'); 
        });
        req.on('end', async () => {
             performance.InsertPerformance(body);
             console.log(res)
           res.end("Insert success");
        });

    }
}
const PerformanceController =new performanceController;
module.exports=PerformanceController;