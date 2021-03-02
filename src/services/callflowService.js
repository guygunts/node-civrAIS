const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({
    path: './config/dev.env'
});
class callflowService {

    async Getdatacallflow(req) {
        try {
            let columns = []
            let columnsName = ''
            let columnsdataName = ''
            let arrcolumnName
            let arrcolumndataName

            let datacallflow = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOut')
                    .execute(`${pathdev.parsed.database}.civr.sp_getdata_callflow`)
            })
            columnsName = datacallflow.recordsets[1][0].columnName
            columnsdataName = datacallflow.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "callflow Management",
                "columnsname": columns,
                "recs": datacallflow.recordsets[0],
                "result": datacallflow.recordsets[1]
            };
            return resultJson;

        } catch (err) {
            console.log(err)
        }
    }

    async Getdatalistcallflow(req) {
        try {
            let columns = []
            let columnsName = ''
            let columnsdataName = ''
            let arrcolumnName
            let arrcolumndataName

            let datacallflow = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOut')
                    .execute(`${pathdev.parsed.database}.civr.sp_getfile_callflow`)
            })
            columnsName = datacallflow.recordsets[1][0].columnName
            columnsdataName = datacallflow.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "callflow Management",
                "columnsname": columns,
                "recs": datacallflow.recordsets[0],
                "result": datacallflow.recordsets[1]
            };
            return resultJson;

        } catch (err) {
            console.log(err)
        }
    }
    async addCallflow(req) {
        try {
            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_callflow`)
            })
            console.log(insert)
           // console.log(insert.recordsets[1][0])
            let resultJson = {
                "code": insert.recordsets[0][0].code,
                "msg": insert.recordsets[0][0].msg,
                "file_path": insert.recordsets[0][0].file_path,
                "dest_path": insert.recordsets[0][0].dest_path,
                "org_file": insert.recordsets[0][0].org_file,
                "file_callflow": insert.recordsets[1]
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }

    }
    async updateCallflow(req) {
        try {
            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_callflow`)
            })

            let resultJson = {
                "code": insert.recordsets[0][0].code,
                "msg": insert.recordsets[0][0].msg,
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }

    }
    async uploadFileCallflow(body_upload) {
        try {

            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(body_upload))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_upload_callflow`)
            })

            let resultJson = {
                "code": insert.recordsets[0][0].code,
                "msg": insert.recordsets[0][0].msg,
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }

    }
}
const CallflowService = new callflowService;
module.exports = CallflowService;