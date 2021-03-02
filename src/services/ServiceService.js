let SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'Logfile.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);
const connectmssql = require('../MssqlDatabase')
const pathdev=require('dotenv').config({ path: './config/dev.env' });
class ServiceService {

    async Servicelist(req){
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        try{
            let Servicelist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getservice`)
            })
            columnsName = Servicelist.recordsets[1][0].columnName
            columnsdataName =Servicelist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName=columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "Service Management",
                "columnsname": columns,
                "recs":Servicelist.recordsets[0], 
                "result":  Servicelist.recordsets[1]
            };


			
            return resultJson

        }catch (err) {
            console.log(err)
        }
    }

    async Serviceaddupdatedelete(req){
        try{
            let Serviceadd = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_service`)      
            })
            let resultJson
            resultJson = {
                "code": Serviceadd.recordsets[0][0].code,
                "msg": Serviceadd.recordsets[0][0].msg,
            }
            return resultJson
        }catch (err) {
            console.log(err)
        }   
    }
}
const serviceService = new ServiceService();
module.exports = serviceService;