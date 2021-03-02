const connectmssql = require('../MssqlDatabase')
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
class VoiceLogService{

   async VoiceLog(req){
	   console.log(req)
        try{
            let data1 =[]
            let data2 =[]
            let data3 =[]
            let data4=[]
            let result = []
            let columns = []
            let columnsName = ''
            let columnsdataName =''
            let arrcolumnName
			 let arrcolumnsdataName
            let VoiceLog= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_getlog_voice_qc`)
            })
            for (let j = 0; j < VoiceLog.recordsets[4].length; j++) {
                const item = {
                    "msg": VoiceLog.recordsets[4][j].msg,
                    "pagenum": VoiceLog.recordsets[4][j].pagenum,
                    "recnum": VoiceLog.recordsets[4][j].recnum,
                    "code": VoiceLog.recordsets[4][j].result
                }
                columnsName = VoiceLog.recordsets[4][j].columname
                columnsdataName=VoiceLog.recordsets[4][j].columnsdataName
                result.push(item)
            }       
            arrcolumnName = columnsName.split(',')
            arrcolumnsdataName = columnsdataName.split(',')

                for (let e = 0; e < arrcolumnName.length; e++) {
                    const items = {
                        'column_name': arrcolumnName[e],
                        'column_data': arrcolumnsdataName[e]
                    }
                    columns.push(items)
                }

            let resultJson = {
                "report_name": "Voice Log Analytic",
                "columns_name": columns,
                "recs":{
                    "box1":VoiceLog.recordsets[0],
                         "box2":VoiceLog.recordsets[1],
                         "box3":VoiceLog.recordsets[3],
                         "box4":VoiceLog.recordsets[2],
                }, 
                "result": result
            };
            
            log.info("response Data VoiceLog:",resultJson)
            return resultJson;
        }catch (err) {
            log.error("response Data VoiceLog:",err)
        }
    }
}
const voiceLogService =new VoiceLogService;
module.exports =voiceLogService;