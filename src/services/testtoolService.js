const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({ path: './config/dev.env' });
const axios = require('axios');
class TesttoolService {

    async getdatadropdown(req){
        let sqlquery=`where 1=1`
        
        if(req.grammar_id !== '' && req.grammar_id !== null){
            sqlquery +=` and grammar_id = '${req.grammar_id}'`
        }
		if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and project_id = '${req.project_id}'`
        }
		
       let sql_query = `select intent_id,intent_tag from civr.tbl_intent ${sqlquery}`

       let sql_query1 = `select  grammar_id,grammar_name FROM CIVR.tbl_grammar  where project_id='${req.project_id}'`

	   let sql_query2=`select build_version from civr.tbl_upload_grammar where status =3 and full_patch <> '' and project_id='${req.project_id}' order by date_time desc`
	   
	
	   
       const result = await connectmssql.then((pool) => {
        return pool.request().query(sql_query1)
    })

    const result1 = await connectmssql.then((pool) => {
        return pool.request().query(sql_query)
    })
	
	const result2 = await connectmssql.then((pool) => {
        return pool.request().query(sql_query2)
    })
	

	
     let responsedata = {
        "code": 200,
        "dropdowngrammar": result.recordset,
        "dropdownintent": result1.recordset,
		"dropdownnameversion":result2.recordset
		
    }
    return responsedata
    }

    async listTesttool(req) {

        
        let sqlquery=`where 1=1 `
        let RowStart
        let RowEnd

        if(req.project_id !== '' && req.project_id !== null){
            sqlquery +=` and project_id = '${req.project_id}'`
        }

        if(req.grammar_id !== '' && req.grammar_id !== null){
            sqlquery +=` and grammar_id = '${req.grammar_id}'`
        }

        if(req.intent_id !== '' && req.intent_id !== null){
            sqlquery +=` and intent_id = '${req.intent_id}'`
        }
		
		if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and project_id = '${req.project_id}'`
        }
		
        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(grammar_test_id) page from civr.tbl_grammar_testing ${sqlquery}`)
        })
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
        let sql_query = `select grammar_test_id,
        excel_file,
        result_path,
        substring(convert(varchar,create_date,  120),1,30)  create_date
         from civr.tbl_grammar_testing ${sqlquery}`
	 //ORDER BY config_no OFFSET ${RowStart}  ROWS FETCH NEXT ${req.page_size} ROWS ONLY 
        console.log(sql_query)

        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })

        let header = [
             {

                "column_field": "excel_file",
                "column_name": "excel_file",
                "className": "text-left",

            },
            {
                "column_field": "create_date",
                "column_name": "create_date",
                "className": "text-left",

            },
            {
                "column_field": "download",
                "column_name": "Action",
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

    async addlistTesttool(req) {
        let responsedata
        
        let params = { 
            "excel_file": req.excelFile
                                }
								
								
					await axios.post(`${pathdev.parsed.urlscript}`, params).then(async function (response) {
						if(response.status == 200){
							let sql=`insert INTO civr.tbl_grammar_testing (project_id,grammar_id,intent_id,excel_file,excel_path,create_date,create_by) VALUES ('${req.project_id}','${req.grammar_id}','${req.intent_id}','${req.excel_file_name}','${req.excelFile}',current_timestamp,'${req.user_login}')`
			await connectmssql.then((pool) => {
            return pool.request().query(sql)
        })

         responsedata = {  
            "code": 200,
            "mess":"success"
        }
        return responsedata
		
						}
  })
  .catch(function (error) {
	  console.log(error)
	  responsedata = {  
            "code": 400,
            "mess":error
        }
        return responsedata
  });							
    }

    async deletelistTesttool(req) {
        const fs = require('fs')
        
            let checkpath =  await connectmssql.then((pool) => {
                return pool.request().query(`select result_path,excel_path from civr.tbl_grammar_testing  where  grammar_test_id ='${req.grammar_test_id}' `)
            })
            try {
            fs.unlinkSync(checkpath.recordset[0].result_path)
			fs.unlinkSync(checkpath.recordset[0].excel_path)
            } catch(err) {
                console.error(err)
              }
        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_grammar_testing  where  grammar_test_id ='${req.grammar_test_id}'`)
        })
        let responsedata = {
            "code": 200,
            "mess":"success"
        }
        return responsedata
    

    }

    async editlistTesttool(req) {
        console.log(req)
        await connectmssql.then((pool) => {
            return pool.request().query(`update civr.tbl_grammar_testing set result_path='${req.result_path}' where excel_file='${req.excel_file}' `)
        })
        let responsedata = {
            "code": 200,
            "mess":"success"
        }
        return responsedata
    

    }
	
	async downloadlistTesttool(req) {
        
       const data= await connectmssql.then((pool) => {
            return pool.request().query(`select excel_file,result_path from civr.tbl_grammar_testing where grammar_test_id='${req}'`)
        })
        return data.recordset
    

    }
	
	
	async getversionfrombuild(req) {
        
        const data=await connectmssql.then((pool) => {
            return pool.request().query(`select  full_patch from civr.tbl_upload_grammar where build_version='${req.grammar_version}'`)
        })
        return data.recordset
    

    }


}
const testtoolService = new TesttoolService;
module.exports = testtoolService;