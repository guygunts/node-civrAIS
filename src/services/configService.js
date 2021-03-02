const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({ path: './config/dev.env' });
class ConfigService {

    async generateIni(req) {

        const data = await connectmssql.then((pool) => {
            return pool.request().query(`select config_no,Page,item,value,valiablename,configfilename,dumppath,a.config_filename_no  from civr.tbl_civr_global_config a  left join civr.tbl_civr_filename_config b on a.config_filename_no=b.config_filename_no where a.config_filename_no='${req.config_filename_no}'`)
        })
        return data.recordset
    }



    async listconfig(req) {

        let stringsql = ` where config_filename_no='${req.config_filename_no}'`

        if (req.text_search !== '' && req.text_search !== null) {
            stringsql += ` and [Page] like '%${req.text_search}%' or item like '%${req.text_search}%' 
        or value like '%${req.text_search}%' or valiablename like '%${req.text_search}%' `
        }

        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(config_no) page from civr.tbl_civr_global_config ${stringsql}`)
        })
        let RowStart
        let RowEnd
        let pagenum = (page.recordset[0].page / req.page_size);
        if ((pagenum * req.page_size) < page.recordset[0].page) {
            pagenum += pagenum + 1
        }
        if (req.page_id == 1) {
            RowStart = 1;
            RowEnd = req.page_size;
        } else {
            RowStart = (req.page_size * (req.page_id - 1)) + 1;
            RowEnd = (req.page_size * req.page_id)
        }
        let totalpage = Math.ceil(page.recordset[0].page / req.page_size);
        let sql_query = `select
                config_no,
                Page,
                item,
                value,
                valiablename,
				substring(convert(varchar,create_date,  120),1,30)  create_date,
				substring(convert(varchar,update_date,  120),1,30)  update_date
     from civr.tbl_civr_global_config ${stringsql}`
	 //ORDER BY config_no OFFSET ${RowStart}  ROWS FETCH NEXT ${req.page_size} ROWS ONLY 
        console.log(sql_query)

        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })

        let header = [
            {
                "column_field": "Page",
                "column_name": "Page",
                "className": "text-left",

            }, {

                "column_field": "item",
                "column_name": "item",
                "className": "text-left",

            }, {
                "column_field": "value",
                "column_name": "value",
                "className": "text-left",

            }, {
                "column_field": "valiablename",
                "column_name": "valiablename",
                "className": "text-left",

            }, {
                "column_field": "create_date",
                "column_name": "create_date",
                "className": "text-left",

            }, {
                "column_field": "update_date",
                "column_name": "update_date",
                "className": "text-left",

            }
        ]
        const dropdown = await connectmssql.then((pool) => {
            return pool.request().query(`select config_filename_no,configfilename from civr.tbl_civr_filename_config `)
        })
        let responsedata = {
            "code": 200,
            "dropdown": dropdown.recordsets[0],
            "recnums": page.recordset[0].page,
            "totalpage": totalpage,
            "result": header,
            "data": result.recordset
        }
        return responsedata
    }

    async updatelistconfig(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`UPDATE civr.tbl_civr_global_config
        SET     [Page]='${req.Page}'
                ,item='${req.item}'
                ,value='${req.value}'
				,valiablename='${req.valiablename}'
				,update_date=current_timestamp
				,update_by='${req.user_login}'
          where config_no =${req.config_no} and config_filename_no='${req.config_filename_no}'`)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata
    }

    async addlistconfig(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`insert INTO civr.tbl_civr_global_config ([Page],item,value,valiablename,config_filename_no,create_by,create_date) VALUES ('${req.Page}','${req.item}','${req.value}','${req.valiablename}','${req.config_filename_no}','${req.user_login}',current_timestamp)`)
        })
        let responsedata = {
            "code": 200
        }
		console.log(responsedata)
        return responsedata
    }

    async deletelistconfig(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_civr_global_config where  config_no =${req.config_no} and config_filename_no='${req.config_filename_no}'`)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata

    }

    async listnameflie(req) {

        let stringsql = `where 1=1`
        if (req.text_search !== '' && req.text_search !== null) {
            stringsql += ` and configfilename like '%${req.text_search}%' or dumppath like '%${req.text_search}%'`
        }
        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(config_filename_no) page  from civr.tbl_civr_filename_config ${stringsql}`)
        })

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
        let sql_query = `select
    config_filename_no,
    configfilename,
    dumppath
from civr.tbl_civr_filename_config ${stringsql} ORDER BY config_filename_no OFFSET ${RowStart}  ROWS 
FETCH NEXT ${req.page_size} ROWS ONLY `
        console.log(sql_query)

        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })

        let header = [
            {
                "column_field": "configfilename",
                "column_name": "configfilename",
                "className": "text-left",

            }, {

                "column_field": "dumppath",
                "column_name": "dumppath",
                "className": "text-left",

            }
        ]
        let responsedata = {
            "code": 200,
            "recnums": page.recordset[0].page,
            "totalpage": totalpage,
            "result": header,
            "data": result.recordset
        }
        return responsedata

    }

    async insertnamefile(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`insert INTO civr.tbl_civr_filename_config (configfilename,dumppath) VALUES ('${req.configfilename}','${req.dumppath}')`)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata
    }

    async updatenamefile(req) {
		let sql=`UPDATE civr.tbl_civr_filename_config
        SET     [configfilename]='${req.configfilename}'
                ,dumppath='${req.dumppath}'	
          where config_filename_no =${req.config_filename_no}`
		  
		  console.log(sql)
        await connectmssql.then((pool) => {
            return pool.request().query(sql)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata
    }

    async deletenamefile(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_civr_filename_config where  config_filename_no =${req.config_filename_no} `)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata

    }

}
const configService = new ConfigService;
module.exports = configService;