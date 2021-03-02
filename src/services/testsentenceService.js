const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({ path: './config/dev.env' });
const axios = require('axios');
class TestsentenceService {

    async getdatadropdown(req) {
        let sqlquery = `where 1=1`

        if (req.grammar_id !== '' && req.grammar_id !== null) {
            sqlquery += ` and grammar_id = '${req.grammar_id}'`
        }
		if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and project_id = '${req.project_id}'`
        }
		
        let sql_query = `select intent_id,intent_tag from civr.tbl_intent ${sqlquery}`

        let sql_query1 = `select  grammar_id,grammar_name FROM CIVR.tbl_grammar where project_id='${req.project_id}'`

        let sql_query2 = `select max(a.concept_name) concept_name,max(b.concept_result) concept_result from civrdb.civr.tbl_concept a left join civrdb.civr.tbl_concept_variation b
       on a.concept_id2 = b.concept_id2 where a.active=1 and a.project_id = '${req.project_id}' group by a.concept_name,b.concept_result order by a.concept_name asc`

		let sql_query3=`select build_version from civr.tbl_upload_grammar where status =3 and full_patch <> '' and project_id='${req.project_id}' order by date_time desc`


        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query1)
        })

        const result1 = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })

        const result2 = await connectmssql.then((pool) => {
            return pool.request().query(sql_query2)
        })

		const result3 = await connectmssql.then((pool) => {
        return pool.request().query(sql_query3)
    })

        let responsedata = {
            "code": 200,
            "dropdowngrammar": result.recordset,
            "dropdownintent": result1.recordset,
            "dropdownconcept": result2.recordset,
			"dropdownnameversion":result3.recordset

        }
        return responsedata
    }

    async listTestsentence(req) {


        let sqlquery = `where 1=1 `
        let RowStart
        let RowEnd

        if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and a.project_id = '${req.project_id}'`
        }

        if (req.grammar_id !== '' && req.grammar_id !== null) {
            sqlquery += ` and a.grammar_id = '${req.grammar_id}'`
        }

        if (req.intent_id !== '' && req.intent_id !== null) {
            sqlquery += ` and a.intent_id = '${req.intent_id}'`
        }
		
		
        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(test_sentence_id) page from civr.tbl_test_sentence a  inner join civr.tbl_grammar b  on a.grammar_id=b.grammar_id inner join civr.tbl_intent c  on a.intent_id=c.intent_id ${sqlquery}`)
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
        let sql_query = `select test_sentence_id,
        a.grammar_id,
        b.grammar_name,
        a.intent_id,
        c.intent_tag,
        sentence_name,
        concept_name,
		d.generate_file
         from civr.tbl_test_sentence a  inner join civr.tbl_grammar b  on a.grammar_id=b.grammar_id inner join civr.tbl_intent c  on a.intent_id=c.intent_id inner join civr.tbl_service d on c.service_id=d.service_id ${sqlquery}`
        //ORDER BY config_no OFFSET ${RowStart}  ROWS FETCH NEXT ${req.page_size} ROWS ONLY 
        console.log(sql_query)

        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })

        let header = [
            {

                "column_field": "grammar_name",
                "column_name": "grammar_name",
                "className": "text-left",

            },
            {
                "column_field": "intent_tag",
                "column_name": "intent_tag",
                "className": "text-left",

            },
            {
                "column_field": "sentence_name",
                "column_name": "sentence_name",
                "className": "text-left",

            },
            {
                "column_field": "concept_name",
                "column_name": "concept_name",
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

    async addlistTestsentence(req) {
        let responsedata

        let sql = `select sentence_name from civr.tbl_test_sentence where sentence_name ='${req.sentence_name}' and grammar_id='${req.grammar_id}' and intent_id=${req.intent_id}`
        let checkdata = await connectmssql.then((pool) => {
            return pool.request().query(sql)
        })
        if(checkdata.recordset.length == 0){
            
        let sql = `insert INTO civr.tbl_test_sentence (project_id,
            grammar_id,
            intent_id,
            sentence_name,
            concept_name,
            create_date,
            create_by) VALUES ('${req.project_id}','${req.grammar_id}','${req.intent_id}','${req.sentence_name}','${req.concept_name}',current_timestamp,'${req.user_login}')`
        await connectmssql.then((pool) => {
            return pool.request().query(sql)
        })

        responsedata = {
            "code": 200,
            "mess": "success"
        }
        return responsedata
        }else{
            responsedata = {
                "code": 501,
                "mess":"data have already been",
                "sentence_name":req.sentence_name
            }
        }




    }

    async deletelistTestsentence(req) {
        const fs = require('fs')

        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_test_sentence  where  test_sentence_id ='${req.test_sentence_id}'`)
        })
        let responsedata = {
            "code": 200,
            "mess": "success"
        }
        return responsedata


    }

    async editlistTestsentence(req) {
        console.log(req)
        await connectmssql.then((pool) => {
            return pool.request().query(`update civr.tbl_test_sentence set 
            grammar_id='${req.grammar_id}',
            intent_id='${req.intent_id}',
            sentence_name='${req.sentence_name}',
            concept_name='${req.concept_name}',
            update_date=current_timestamp,
            update_by='${req.user_login}'
             where test_sentence_id='${req.test_sentence_id}' `)
        })
        let responsedata = {
            "code": 200,
            "mess": "success"
        }
        return responsedata


    }
	
	

    async getgrammar(req) {
        let datajson = []
        

        for (let i = 0; i < req.datajson.length; i++) {
		
     //   const intent = await connectmssql.then((pool) => {
      //      return pool.request().query(`select intent_tag,generate_file from civr.tbl_intent a  inner join civr.tbl_service b on a.service_id=b.service_id where a.intent_id=${req.datajson[i].intent_id}`)
      //  })
            let data = {
                "No": i,
                "sentence": req.datajson[i].sentence_name,
                "intent": req.datajson[i].intent_tag,
                "grammar": req.datajson[i].grammar_name,
                "concept": req.datajson[i].concept_name
            }
            datajson.push(data)
        }

        return datajson
    }
	
	    async listTestsentencefile(req) {

        let sqlquery = `where 1=1 `
        let RowStart
        let RowEnd
        if (req.start_date !== '' && req.start_date !== null) {
            sqlquery += ` and create_date >= '${req.start_date}'`
        }

        if (req.end_date !== '' && req.end_date !== null) {
            sqlquery += ` and create_date <= '${req.end_date}'`
        }
		
		if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and project_id = '${req.project_id}'`
        }

        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(test_sentence_file_id) page from civr.tbl_test_sentence_file ${sqlquery}`)
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
        let sql_query = `select test_sentence_file_id,
        excel_file,
        result_path,
        excel_path,
		status_result,
        substring(convert(varchar,create_date,  120),1,30)  create_date
         from civr.tbl_test_sentence_file ${sqlquery}`
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
                "column_field": "status_result",
                "column_name": "status_result",
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
	
	   async addTestsentencefile(req,file) {
       var FormData = require('form-data');
	   var fs = require('fs')
        let binary = fs.createReadStream(file);
  const form_data = new FormData();
  form_data.append("file", binary);
  const request_config = {
	  maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
        "Content-Type": 'multipart/form-data; boundary=' + form_data._boundary 

    }
  }
console.log(form_data)

  let responsedata	
            axios.post(`http://192.168.38.46:9030/testtext/upload`,form_data,request_config).then( async(response)=>{
                if(response.status == 200){
                    let sql=`insert INTO civr.tbl_test_sentence_file (project_id,excel_file,excel_path,create_date,create_by) VALUES ('${req.project_id}','${req.excel_file_name}','${req.excelFile}',current_timestamp,'${req.user_login}')`
    await connectmssql.then((pool) => {
    return pool.request().query(sql)
})

 responsedata = {  
    "code": 200,
    "mess":"success"
}
return responsedata

                }
            }).catch(function (error) {
                console.log(error)
                responsedata = {  
                      "code": 400,
                      "mess":error
                  }
                  return responsedata
            });									
    }
	
	    async deleTestsentencefile(req) {

        const fs = require('fs')
        
            let checkpath =  await connectmssql.then((pool) => {
                return pool.request().query(`select result_path,excel_path from civr.tbl_test_sentence_file  where  test_sentence_file_id ='${req.test_sentence_file_id}' `)
           })

            try {
            fs.unlinkSync(checkpath.recordset[0].result_path)
			fs.unlinkSync(checkpath.recordset[0].excel_path)
            } catch(err) {
                console.error(err)
              }
		  
        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_test_sentence_file  where  test_sentence_file_id ='${req.test_sentence_file_id}'`)
        })
        let responsedata = {
            "code": 200,
            "mess":"success"
        }
        return responsedata
    

    }
	
	  async editTestsentencefile(req) {
        console.log(req)
        await connectmssql.then((pool) => {
            return pool.request().query(`update civr.tbl_test_sentence_file set result_path='${req.result_path}',status_result='${req.desc}' where excel_file='${req.excel_file}' `)
        })
        let responsedata = {
            "code": 200,
            "mess":"success"
        }
        return responsedata
    

    }
	
	    async downloadTestsentencefile(req) {

        const data = await connectmssql.then((pool) => {
            return pool.request().query(`select excel_file,result_path from civr.tbl_test_sentence_file where test_sentence_file_id='${req}'`)
        })
        return data.recordset


    }

}
const testsentenceService = new TestsentenceService;
module.exports = testsentenceService;