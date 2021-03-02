let SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'Logfile.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);
const connectmssql = require('../MssqlDatabase')
const pathdev=require('dotenv').config({ path: './config/dev.env' });
class IntentService {

    async Intentlist(req){
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        try{
            let Intentlist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getintent`)
            })
            columnsName = Intentlist.recordsets[1][0].columnName
            columnsdataName =Intentlist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName=columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
			 const data = await connectmssql.then((pool) => {
            return pool.request().query(`select grammar_id,grammar_name from civr.tbl_grammar`)
        })
            let resultJson = {
                "reportname": "Intent Management",
                "columnsname": columns,
				"dropdown":data.recordsets[0],
                "recs":Intentlist.recordsets[0], 
                "result":  Intentlist.recordsets[1]
            };


			
            return resultJson

        }catch (err) {
            console.log(err)
        }
    }

    async Intentaddupdatedelete(req){
        try{
            let Intentadd = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_intent`)      
            })
            let resultJson
            resultJson = {
                "code": Intentadd.recordsets[0][0].code,
                "msg": Intentadd.recordsets[0][0].msg,
            }
            return resultJson
        }catch (err) {
            console.log(err)
        }   
    }
}
const intentService = new IntentService();
module.exports = intentService;