const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({ path: './config/dev.env' });
class UploadvoiceService {

    async getdatadropdown(req){
        let sqlquery=`where 1=1`
		

        if(req.grammar_id !== '' && req.grammar_id !== null){
            sqlquery +=` and grammar_id = '${req.grammar_id}'`
        }
		
		if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and project_id = '${req.project_id}'`
        }
		
		console.log(req)
	if(typeof req.concept_id2 !== 'undefined' ){
			for(let i=0; i<req.concept_id2.length; i++){
                if(i == 0){
                    sqlquery1 +=` and `
                }else{
                    sqlquery1 +=` or `
                }
            sqlquery1 +=` concept_id2 = '${req.concept_id2[i].concept_id2}'`
			}
        }

       let sql_query = `select intent_id,intent_tag from civr.tbl_intent ${sqlquery}`

       let sql_query1 = `select  grammar_id,grammar_name FROM CIVR.tbl_grammar where project_id = '${req.project_id}'`
	   
	   let sql_query2=`select max(a.concept_name) concept_name,max(b.concept_result) concept_result from civrdb.civr.tbl_concept a left join civrdb.civr.tbl_concept_variation b
     on a.concept_id2 = b.concept_id2 where a.active=1 and a.project_id='${req.project_id}' group by a.concept_name,b.concept_result order by a.concept_name asc`
	  // `select max(a.concept_name) concept_name,max(b.concept_result) concept_result from civrdb.civr.tbl_concept a inner join civrdb.civr.tbl_concept_variation b
     //on a.concept_id2 = b.concept_id2 where a.active=1 group by b.concept_result`


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
		"dropdownconcept":result2.recordset
    }
    return responsedata
    }

    async listUploadvoice(req) {

        
        let sqlquery=`where 1=1 `
        let RowStart
        let RowEnd

        if(req.intent_id !== '' && req.intent_id !== null){
            sqlquery +=` and a.intent_id = '${req.intent_id}'`
        }
		
		if(req.grammar_id !== '' && req.grammar_id !== null){
            sqlquery +=` and a.grammar_id= '${req.grammar_id}'`
        }
		
		if (req.project_id !== '' && req.project_id !== null) {
            sqlquery += ` and a.project_id = '${req.project_id}'`
        }
		
        const page = await connectmssql.then((pool) => {
            return pool.request().query(`select count(voice_id) page from civr.tbl_upload_voice a left join civr.tbl_grammar b on a.grammar_id=b.grammar_id left join civr.tbl_intent c on a.intent_id=c.intent_id ${sqlquery}`)
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
        let sql_query = `select
         voice_id,
        b.grammar_name,
        c.intent_tag,
		sentence,
        voice_name,
		path,
		concept,
        substring(convert(varchar,a.create_date,  120),1,30)  create_date
     from civr.tbl_upload_voice a left join civr.tbl_grammar b on a.grammar_id=b.grammar_id left join civr.tbl_intent c on a.intent_id=c.intent_id  ${sqlquery}`
	 //ORDER BY config_no OFFSET ${RowStart}  ROWS FETCH NEXT ${req.page_size} ROWS ONLY 
        console.log(sql_query)

        const result = await connectmssql.then((pool) => {
            return pool.request().query(sql_query)
        })
        for(let i=0; i<result.recordset.length; i++){
           
            result.recordset[i].path=result.recordset[i].path.replace(pathdev.parsed.baseHomevoice,'')
        }
        let header = [
			{

                "column_field": "sentence",
                "column_name": "sentence",
                "className": "text-left",

            },{
                "column_field": "grammar_name",
                "column_name": "grammar_name",
                "className": "text-left",

            },{
                "column_field": "intent_tag",
                "column_name": "intent_tag",
                "className": "text-left",

            },
            {
                "column_field": "voice_name",
                "column_name": "voice_name",
                "className": "text-left",

            }, {

                "column_field": "path",
                "column_name": "audio",
                "className": "text-left",

            }, {

                "column_field": "concept",
                "column_name": "concept",
                "className": "text-left",

            },{

                "column_field": "create_date",
                "column_name": "create_date",
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

    async addlistConfmap(req) {
		let responsedata
		let checkdata =  await connectmssql.then((pool) => {
            return pool.request().query(`select voice_name from civr.tbl_upload_voice where voice_name ='${req.voice_name}'`)
        })
		
		if(checkdata.recordset.length == 0){
			await connectmssql.then((pool) => {
            return pool.request().query(`insert INTO civr.tbl_upload_voice (grammar_id,intent_id,voice_name,create_date,create_by,path,project_id) VALUES ('${req.grammar_id}','${req.intent_id}','${req.voice_name}',current_timestamp,'${req.user_login}','${req.path}','${req.project_id}')`)
        })
         responsedata = {
            "no":req.no,   
            "code": 200,
            "mess":"success",
            "voice_name":req.voice_name
        }

		}else{					
			responsedata = {
            "no":req.no,   
            "code": 501,
            "mess":"data have already been",
            "voice_name":req.voice_name
        }
		}
		console.log(responsedata)
        return responsedata
    }

    async deletelistConfmap(req) {
        const fs = require('fs')
        
            let checkpath =  await connectmssql.then((pool) => {
                return pool.request().query(`select path from civr.tbl_upload_voice  where  voice_id =${req.voice_id}`)
            })
            try {
            fs.unlinkSync(checkpath.recordset[0].path)
            } catch(err) {
                console.error(err)
              }
        await connectmssql.then((pool) => {
            return pool.request().query(`delete from civr.tbl_upload_voice  where  voice_id =${req.voice_id}`)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata
    

    }

    async editlistConfmap(req) {
        await connectmssql.then((pool) => {
            return pool.request().query(`update  civr.tbl_upload_voice set sentence='${req.sentence}' ,[action]='${req.action}',concept='${req.concept}' where voice_id='${req.voice_id}'`)
        })
        let responsedata = {
            "code": 200
        }
        return responsedata

    }

    async datafromtesttoolcalluploadvoice(req) {

        if(typeof req.datajson !== 'undefined'){
        
		 let datajson=[]
        for(let i=0; i<req.datajson.length; i++){

          let datafromdb=  await connectmssql.then((pool) => {
                 return pool.request().query(`select '0' [index],sentence,b.intent_tag,[path],c.grammar_name grammar, a.concept from civr.tbl_upload_voice a left join civr.tbl_intent b   on a.intent_id=b.intent_id left join civr.tbl_grammar c on c.grammar_id=a.grammar_id where a.voice_id='${req.datajson[i].voice_id}'`)
            })
            datafromdb.recordset[0].index=`${i+1}`
            datajson.push(datafromdb.recordset[0])
        }
        return datajson
		
    }else{
		let sqlquery=`where 1=1 `


        if(req.intent_id !== '' && req.intent_id !== null){
            sqlquery +=` and a.intent_id = '${req.intent_id}'`
        }
		
		if(req.grammar_id !== '' && req.grammar_id !== null){
            sqlquery +=` and a.grammar_id= '${req.grammar_id}'`
        }

        let datafromdb= await connectmssql.then((pool) => {
            return pool.request().query(`select ROW_NUMBER() OVER (ORDER BY voice_id)  [index],sentence,b.intent_tag,[path],c.grammar_name grammar,concept from civr.tbl_upload_voice a left join civr.tbl_intent b   on a.intent_id=b.intent_id left join civr.tbl_grammar c on c.grammar_id=a.grammar_id  ${sqlquery}`)
        })
        return datafromdb.recordset

    }
    }

    async movefilevoice(req){

        for(let i=0; i<req.datajson.length; i++){       
         await connectmssql.then((pool) => {
           return pool.request().query(`UPDATE civr.tbl_upload_voice SET grammar_id = '${req.grammar_id}', intent_id = '${req.intent_id}',path='${req.datajson[i].newpath}' WHERE voice_id='${req.datajson[i].voice_id}'`)
       })
   }
  let  responsedata = {   
    "code": 200,
    "mess":"success"
}
       return responsedata

    }

    async listmovefilevoice(req){
 
        for(let i=0; i<req.datajson.length; i++){       
             let datafromdb= await connectmssql.then((pool) => {
            return pool.request().query(`select [path] from civr.tbl_upload_voice  where voice_name='${req.datajson[i].voice_name}'`)
        })
        req.datajson[i].path=datafromdb.recordset[0].path
    }
        return req.datajson
    }

}
const uploadvoiceService = new UploadvoiceService;
module.exports = uploadvoiceService;