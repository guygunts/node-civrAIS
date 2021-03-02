const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({ path: './config/dev.env' });
class ConfmapService {

    async listConfmap(req) {

      //  let stringsql = ` where 1=1`


        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(conf_id) page from civr.tbl_conf_map `)
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
                        conf_id,
                        conf_value,
                        conf_name
     from civr.tbl_conf_map`
	 //ORDER BY config_no OFFSET ${RowStart}  ROWS FETCH NEXT ${req.page_size} ROWS ONLY 
        console.log(sql_query)

        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })

        let header = [
			{

                "column_field": "conf_name",
                "column_name": "Intent Config Name",
                "className": "text-left",

            },
            {
                "column_field": "conf_value",
                "column_name": "Intent Config Value",
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

    async updatelistConfmap(req) {
		console.log(req)
        await connectmssql.then((pool) => {
            return pool.request().query(`UPDATE civr.tbl_conf_map
        SET     [conf_value]='${req.conf_value}'
                ,conf_name='${req.conf_name}'
          where conf_id =${req.conf_id}`)
        })
        let responsedata = {
            "code": 200,
			"msg":'success'
        }
        return responsedata
    }

    async addlistConfmap(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`insert INTO civr.tbl_conf_map (conf_value,conf_name) VALUES ('${req.conf_value}','${req.conf_name}')`)
        })
        let responsedata = {
            "code": 200,
			"msg":'success'
        }
		console.log(responsedata)
        return responsedata
    }

    async deletelistConfmap(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_conf_map where  conf_id =${req.conf_id}`)
        })
        let responsedata = {
            "code": 200,
			"msg":'success'
        }
        return responsedata

    }
	
	    async listConfinputmap(req) {

        //  let stringsql = ` where 1=1`
  
  
          const page = await connectmssql.then((pool) => {
              return pool.request().query(`select count(conf_input_id) page from civr.tbl_conf_input_map `)
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
                        conf_input_id,
                        conf_input_value,
                        conf_input_name
       from civr.tbl_conf_input_map`
       //ORDER BY config_no OFFSET ${RowStart}  ROWS FETCH NEXT ${req.page_size} ROWS ONLY 
          console.log(sql_query)
  
          const result = await connectmssql.then((pool) => {
              return pool.request().query(sql_query)
          })
  
          let header = [
              {
                  "column_field": "conf_input_name",
                  "column_name": "Input Config Name",
                  "className": "text-left",
  
              }, {
  
                  "column_field": "conf_input_value",
                  "column_name": "Input Config value",
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
  
      async updatelistConfinputmap(req) {
          console.log(req)
          await connectmssql.then((pool) => {
              return pool.request().query(`UPDATE civr.tbl_conf_input_map
          SET     [conf_input_value]='${req.conf_input_value}'
                  ,conf_input_name='${req.conf_input_name}'
            where conf_input_id =${req.conf_input_id}`)
          })
          let responsedata = {
              "code": 200
          }
          return responsedata
      }
  
      async addlistConfinputmap(req) {
          await connectmssql.then((pool) => {
              return pool.request().query(`insert INTO civr.tbl_conf_input_map (conf_input_value,conf_input_name) VALUES ('${req.conf_input_value}','${req.conf_input_name}')`)
          })
          let responsedata = {
              "code": 200
          }
          console.log(responsedata)
          return responsedata
      }
  
      async deletelistConfinputmap(req) {
          await connectmssql.then((pool) => {
              return pool.request().query(`delete from civr.tbl_conf_input_map where  conf_input_id =${req.conf_input_id}`)
          })
          let responsedata = {
              "code": 200
          }
          return responsedata
  
      }

}
const confmapService = new ConfmapService;
module.exports = confmapService;