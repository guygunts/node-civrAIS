const sql = require('mssql')
const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({ path: './config/dev.env' });
const config = {
    user: pathdev.parsed.user,
    password: pathdev.parsed.password,
    server: pathdev.parsed.server,
    database: pathdev.parsed.database,
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    "options": {
        "trustedConnection": true,
        "useUTC": true
    },
    encrypt: false
}
class LoginsertService {

    async insertlog(req) {
        let datares =await connectmssql.then((pool) => {
            return pool.request().query(`insert INTO  civr.tbl_civr_transaction_log (username,browser,ip_address,activity,date_time) VALUES ('${req.username}','${req.browser}','${req.ip_address}','${req.activity}',CURRENT_TIMESTAMP)`)
        })
        return datares

    }

    async Listlog(req) {
        console.log(req)
        await sql.connect(config)
         let columns = []
        let columnname = "date_time,username,browser,ip_address,activity"

        let columndata = "date time,username,browser,ip_address,activity"

        let columnclassname = "text-left,text-left,text-left,text-left,text-left"

        let arraycolumnname = columnname.split(',')
        let arraycolumndata = columndata.split(',')
        let arraycolumnclassname = columnclassname.split(',')
        for (let e = 0; e < arraycolumnname.length; e++) {
            let items = {
                'column_field': arraycolumnname[e],
                'column_name': arraycolumndata[e],
                'className': arraycolumnclassname[e]
            }
            columns.push(items)
        }

        let stringsql = ` where 1=1`
		let stringsqlorder=``

		if(req.column !== '' && req.column !== null){
			if(req.column == 'no'){
				stringsqlorder +=` ORDER BY id`
			}else{
            stringsqlorder +=` ORDER BY ${req.column}`
			}
        }else{
			stringsqlorder +=` ORDER BY id`
		}
		
		if(req.dir !== '' && req.dir !== null){
            stringsqlorder +=` ${req.dir}`
        }else{
			stringsqlorder +=` asc`
		}
		
        if (req.text_search !== '' && req.text_search !== null) {
            stringsql += `and [username] like '%${req.text_search}%' or [browser] like '%${req.text_search}%' 
            or [ip_address] like '%${req.text_search}%' or [activity] like '%${req.text_search}%' `

        }
        console.log(stringsql)
        const page = await sql.query(`select count(id) page from civr.tbl_civr_transaction_log ${stringsql}`)
        let RowStart
        let RowEnd
        let pagenum = (page.recordset[0].page / req.page_size);
        if ((pagenum * req.page_size) < page.recordset[0].page) {
            pagenum += pagenum + 1
        }
        if (req.page_id == 1) {
            RowStart = 0;
            RowEnd = req.page_size;
        } else {
            RowStart = (req.page_size * (req.page_id - 1)) + 1;
            RowEnd = (req.page_size * req.page_id)
        }
        let totalpage = Math.ceil(page.recordset[0].page / req.page_size);
        let sql_query = `select substring(convert(varchar,date_time,120),1,30) date_time,username,browser,ip_address,activity
		 from civr.tbl_civr_transaction_log ${stringsql} ${stringsqlorder}  OFFSET ${RowStart}  ROWS 
        FETCH NEXT ${req.page_size} ROWS ONLY`
        console.log(sql_query)
        const result = await sql.query(sql_query)

        let responsedata = {
            "code": 200,
            "recnums": page.recordset[0].page,
            "totalpage": totalpage,
            "result": columns,
            "data": result.recordset
        }
        return responsedata
    }

}
const loginsertService = new LoginsertService;
module.exports = loginsertService;