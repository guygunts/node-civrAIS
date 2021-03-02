const sql = require('mssql')
const pathdev=require('dotenv').config({ path: './config/dev.env' });
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
class ListontopportpaidService {
	
	    async generatexml(req){
        await sql.connect(config)
        let responsedata = []
        const result = await sql.query(`select ontop_id,
        substring(convert(varchar,CREATE_DATE,120),1,30) CREATE_DATE,
        substring(convert(varchar,LAST_UPDATE,120),1,30) LAST_UPDATE,
        substring(convert(varchar,START_DATE,120),1,30) START_DATE,
        substring(convert(varchar,END_DATE,120),1,30) END_DATE,
        Package_Type,
        Type_Group,
        Package_Group,
        Mobile_Type,
        Price,
        Group_Code,
        package_code,
        Speed,
        Data_pack,
        Data_pack_type,
        Data_pack_kb,
        Voice_pack,
        Package_Name,
        Pack_File_Name,
        Pack_file_info,
        remark,
        link_kb,
        Owner,
        Enable,
        Offer_Ontop_Pack,
        Flag_Pack,
        UPDATE_BY,
        CREATE_BY,
        Package_Sub_Code,package_day from civrdb.civr.tbl_civr_ontop_postpaid where Price is not NULL and Type_group is not null and Data_pack is not null order by Type_Group`)
        responsedata.push(result.recordset)
            return responsedata
    }
	
    async Listontopportpaid(req) {
        await sql.connect(config)
        let columns=[]
        let columnname="START_DATE,END_DATE,Package_Type,Type_Group,Package_Group,Mobile_Type,Price,Group_Code,package_code,Speed,Data_pack,Data_pack_type,Data_pack_kb,Voice_pack,Package_Name,Pack_File_Name,Pack_file_info,remark,link_kb,Owner,Enable,Package_Sub_Code"

        let columndata="START_DATE,END_DATE,Package_Type,Type_Group,Package_Group,Mobile_Type,Price,Group_Code,package_code,Speed,Data_pack,Data_pack_type,Data_pack_kb,Voice_pack,Package_Name,Pack_File_Name,Pack_file_info,remark,link_kb,Owner,Enable,Package_Sub_Code"
        
        let columnclassname="text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left"

        let arraycolumnname=columnname.split(',')
        let arraycolumndata=columndata.split(',')
        let arraycolumnclassname=columnclassname.split(',')
        for (let e = 0; e < arraycolumnname.length; e++) {
                let items = {
                    'column_field':arraycolumnname[e],
                    'column_name': arraycolumndata[e],
                    'className':arraycolumnclassname[e]
                }
                columns.push(items)
            }
        const drowdowngroup =await sql.query `select [Type_Group] as name from civr.tbl_civr_ontop_postpaid where  [Type_Group] !='' group by  [Type_Group] order by  [Type_Group] desc`
	const drowdownpdatapacktype =await sql.query `select [Package_Type] as name from civr.tbl_civr_ontop_postpaid where [Package_Type] !=''   group by [Package_Type]`
	const drowdownspeed=await sql.query `select [Speed] as name from civr.tbl_civr_ontop_postpaid where [Speed] !='-' and [Speed] !='' group by SPEED `
	const drowdowntypegrop=await sql.query `select [Package_Group] as name from civr.tbl_civr_ontop_postpaid  group by [Package_Group]`

        let stringsql=` where 1=1`
      //    if(req.packid !== '') {
       //     stringsql +=` and Data_pack = '${req.packid}'`
	//    }else if(req.packid != null) {
       //     stringsql +=` and Data_pack = '${req.packid}'`
       // }

        if(req.Package_group !== '' && req.Package_group !== null){
            stringsql +=` and [Package_Group] = '${req.Package_group}'`
        }
		
		if(req.enable !== '' && req.enable !== null){
            stringsql +=` and Enable = '${req.enable}'`
        }
	

        if(req.text_search !== '' && req.text_search !== null){
            stringsql +=` and [Package_Type] like '%${req.text_search}%' or [Type_Group] like '%${req.text_search}%' 
            or [Package_Group] like '%${req.text_search}%' or [Group_Code] like '%${req.text_search}%' 
            or [package_code] like '%${req.text_search}%' or [Speed] like '%${req.text_search}%' 
            or [Data_pack] like '%${req.text_search}%' or [Data_pack_kb] like '%${req.text_search}%' 

            or [Data_pack_type] like '%${req.text_search}%' or [Voice_pack] like '%${req.text_search}%'

            or [Package_Name] like '%${req.text_search}%' or [Pack_File_Name] like '%${req.text_search}%' or [Pack_file_info] like '%${req.text_search}%'`
            
	}
			console.log(stringsql)
         const page= await sql.query (`select count(ontop_id) page from civr.tbl_civr_ontop_postpaid ${stringsql}`)
         let RowStart
		 let RowEnd 
          let pagenum = (page.recordset[0].page / req.page_size);
            if ((pagenum * req.page_size) < page.recordset[0].page) {
                pagenum  += pagenum  + 1 
            }
            if(req.page_id == 1){
                 RowStart = 0;
                 RowEnd = req.page_size; 
            }else{
                 RowStart = (req.page_size * (req.page_id-1))+1;
				 RowEnd =   (req.page_size * req.page_id)  
            }
         let totalpage= Math.ceil(page.recordset[0].page/req.page_size);
	let sql_query =`select ontop_id,
        substring(convert(varchar,START_DATE,  120),1,30) START_DATE,
        substring(convert(varchar,END_DATE,  120),1,30)  END_DATE,
		substring(convert(varchar,LAST_UPDATE,  120),1,30)  LAST_UPDATE,
                Package_Type,
                Type_Group,
                Package_Group,
                Mobile_Type,
                Price,
                Group_Code,
                package_code,
                Speed,
                Data_pack,
                Data_pack_type,
                Data_pack_kb,
                Voice_pack,
                Package_Name,
                Pack_File_Name,
                Pack_file_info,
                remark,
                link_kb,
                Owner,
                Enable,
                Offer_Ontop_Pack,
                Flag_Pack,
                Package_Sub_Code,
				package_day
		 from civr.tbl_civr_ontop_postpaid ${stringsql} ORDER BY ontop_id OFFSET ${RowStart}  ROWS 
        FETCH NEXT ${req.page_size} ROWS ONLY `
			console.log(sql_query)
        const result = await sql.query(sql_query)
					        for(let i=0; i<result.recordset.length; i++){
            if( result.recordset[i].Pack_file_info !== '' &&  result.recordset[i].Pack_file_info !== null){
            let data = result.recordset[i].Pack_file_info.indexOf('.wav')
            if(data>0){
                    result.recordset[i].Pack_file_info=result.recordset[i].Pack_file_info.replace('.wav','')
            }
        }
        if( result.recordset[i].Pack_File_Name !== '' &&  result.recordset[i].Pack_File_Name !== null){
            let data1 = result.recordset[i].Pack_File_Name.indexOf('.wav')
            if(data1>0){
                    result.recordset[i].Pack_File_Name=result.recordset[i].Pack_File_Name.replace('.wav','')
            }
        }
    }
        let responsedata = {
            "code": 200,
            "recnums": page.recordset[0].page,
            "totalpage":totalpage,
            "result":columns,
            "drowdowngroup":drowdowngroup.recordset,  
	    "drowdownpdatapacktype":drowdownpdatapacktype.recordset,
	    "drowdownspeed":drowdownspeed.recordset,
	    "drowdowntypegrop":drowdowntypegrop.recordset,
            "data":result.recordset
        }
        return responsedata
    }

     async editlistontopportpaid(req){
        await sql.connect(config)
		let sqlquery=`UPDATE civr.tbl_civr_ontop_postpaid
        SET     START_DATE=convert(datetime,'${req.startdate}',120)
                ,END_DATE=convert(datetime,'${req.enddate}',120)
                ,LAST_UPDATE=current_timestamp
                ,UPDATE_BY='${req.user_login}'
                ,Package_Type='${req.Package_Type}'
                ,Type_Group='${req.Type_Group}'
                ,Package_Group='${req.Package_Group}'
                ,Mobile_Type='${req.Mobile_Type}'
                ,Price='${req.Price}'
                ,Group_Code='${req.Group_Code}'
                ,package_code='${req.package_code}'
                ,Speed='${req.Speed}'
                ,Data_pack='${req.Data_pack}'
                ,Data_pack_type='${req.Data_pack_type}'
                ,Data_pack_kb='${req.Data_Pack_Kb}'
                ,Voice_pack='${req.Voice_pack}'
                ,Package_Name='${req.Package_Name}'
                ,Pack_File_Name='${req.Pack_File_Name}'
                ,Pack_file_info='${req.Pack_file_info}'
                ,remark='${req.remark}'
                ,link_kb='${req.link_kb}'
                ,Owner='cIVR'
                ,Enable='${req.Enable}'
                ,Package_Sub_Code='${req.Package_Sub_Code}'
				,package_day='${req.package_day}'
	      where ontop_id =${req.ontop_id}`
		  console.log(sqlquery)
        const result = await sql.query(sqlquery)
       let responsedata = {
           "code": 200,
           "data":result.recordset,
       }
       return responsedata
    }

    async deletelistontopportpaid(req){
        await sql.connect(config)
        const result = await sql.query(`delete from  civr.tbl_civr_ontop_postpaid  WHERE ontop_id=${req.ontop_id}`)
       let responsedata = {
           "code": 200,
           "data":result.recordset,
       }
       return responsedata
    }


 async addlistontopportpaid(req){
        await sql.connect(config)
       
       let sqlquery=`INSERT INTO civr.tbl_civr_ontop_postpaid  (
                
        CREATE_DATE
        ,CREATE_BY
        ,START_DATE
        ,END_DATE
        ,Package_Type
        ,Type_Group
        ,Package_Group
        ,Mobile_Type
        ,Price
        ,Group_Code
        ,package_code
        ,Speed
        ,Data_pack
        ,Data_pack_type
        ,Data_pack_kb
        ,Voice_pack
        ,Package_Name
        ,Pack_File_Name
        ,Pack_file_info
        ,remark
        ,link_kb
        ,Owner
        ,Enable
        ,Package_Sub_Code
		,package_day)
                  VALUES (
                        current_timestamp
                        ,'${req.user_login}'
                        ,convert(datetime,'${req.startdate}',120)
                        ,convert(datetime,'${req.enddate}',120)
                        ,'${req.Package_Type}'
                        ,'${req.Type_Group}'
                        ,'${req.Package_Group}'
                        ,'${req.Mobile_Type}'
                        ,'${req.Price}'
                        ,'${req.Group_Code}'
                        ,'${req.package_code}'
                        ,'${req.Speed}'
                        ,'${req.Data_pack}'
                        ,'${req.Data_pack_type}'
                        ,'${req.Data_Pack_Kb}'
                        ,'${req.Voice_pack}'
                        ,'${req.Package_Name}'
                        ,'${req.Pack_File_Name}'
                        ,'${req.Pack_file_info}'
                        ,'${req.remark}'
                        ,'${req.link_kb}'
                        ,'cIVR'
                        ,'${req.Enable}'
                        ,'${req.Package_Sub_Code}'
						,'${req.package_day}'
                  )`
                  console.log(sqlquery)
               const result = await sql.query(sqlquery)
       let responsedata = {
           "code": 200,
           "data":result.recordset,
       }
       return responsedata
    }

}
const listontopportpaidService = new ListontopportpaidService;
module.exports = listontopportpaidService;