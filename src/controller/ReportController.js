const ReportService = require('../services/ReportService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
class report{
    async report(req,res){
        if(req.body.report_name=='SR'){
			log.info("request Data SR:",req.body)
          const report= await  ReportService.ServiceReport(req.body);
            res.json(report);
            res.end();
        }else if(req.body.report_name=='AR'){
			log.info("request Data AR:",req.body)
            const accuracy = await ReportService.AccuracyReport(req.body);
            res.json(accuracy);
            res.end();
        }else if(req.body.report_name=='ER'){
			log.info("request Data ER:",req.body)
            const Envnt =await ReportService.EventReport(req.body);
            res.json(Envnt);
            res.end();
        }else if(req.body.report_name=='TR'){
			log.info("request Data TR:",req.body)
            const TopTen =await ReportService.TopTenReport(req.body);
            res.json(TopTen);
            res.end();
        }else if(req.body.report_name=='UR'){
			log.info("request Data UR:",req.body)
            const Usage =await ReportService.UsageReport(req.body);
            res.json(Usage);
            res.end();
        }else if(req.body.report_name=='PR'){
			log.info("request Data PR:",req.body)
            const Performance =await ReportService.PerformanceReport(req.body);
            res.json(Performance);
            res.end();
        }else if(req.body.report_name=='QC'){
			log.info("request Data QC:",req.body)
            const Performance =await ReportService.summaryQReport(req.body);
            res.json(Performance);
            res.end();        
        }else{
            res.end("please enter type SR,AR,ER,TR,UR,PR");
        }   
    }
}
const Report = new report();
module.exports = Report;