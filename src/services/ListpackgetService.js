const sql = require('mssql')
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
class ListpackgetService  {
	
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
        Package_Sub_Code from civrdb.civr.tbl_civr_ontop_postpaid where Price is not NULL and Type_group is not null and Data_pack is not null and Enable <>0 order by Type_Group`)
        responsedata.push(result.recordset)
        const result1 = await sql.query(`select ontop_id,
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
        Package_Sub_Code,
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
        CREATE_BY from civrdb.civr.tbl_civr_ontop_prepaid where Price is not NULL and Type_group is not null and Data_pack is not null and Enable <>0  order by Type_Group`)
        responsedata.push(result1.recordset)
            return responsedata
    }
	
    async ListpackgetService(req) {
        await sql.connect(config)
		 const drowdowngroup =await sql.query `select [Type_Group] as name from civr.tbl_civr_main_pack where  [Type_Group] !='' group by  [Type_Group] order by  [Type_Group] desc`
	const drowdownpdatapacktype =await sql.query `select [Package_Type] as name from civr.tbl_civr_main_pack where [Package_Type] !=''   group by [Package_Type]`
	const drowdownspeed=await sql.query `select [Speed] as name from civr.tbl_civr_main_pack where [Speed] !='-' and [Speed] !='' group by SPEED `
	const drowdowntypegrop=await sql.query `select [Package_Group] as name from civr.tbl_civr_main_pack  group by [Package_Group]`
        let columns = []
        let columnname = "PACK_ID,PACKAGE_TYPE,GROUP,PACKAGE_GROUP,MOBILE_TYPE,PRICE,PACKAGE_NAME,PACKAGE_CODE,SPEED,DATA_GB,VOICE_MIN,FILE_NAME,FILE_INFO,NAME_SCRIPT,INFO_SCRIPT,OWNER,ENABLE,START_DATE,END_DATE,LAST_UPDATE,btn"

        let columndata = "main pack Id,Package Type,Group,Package Group,Mobile Type,Price,Package Name,Package Code,Speed,Data (GB),Voice(Min),File Name,File Info,Name Script,Info Script,Owner,Enable,Start Date,End date,Last Update,Action"

        let columnclassname = "text-left,text-left,text-left,text-left,text-left,text-center,text-center,text-left,text-left,text-center,text-center,text-left,text-left,text-left,text-left,text-left,text-center,text-left,text-left,text-left,text-center"

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

        if(req.Package_group !== '' && req.Package_group !== null){
            stringsql +=` and [Package_Group] = '${req.Package_group}'`
        }
		
		if(req.enable !== '' && req.enable !== null){
            stringsql +=` and Enable = '${req.enable}'`
        }

		if(req.column !== '' && req.column !== null){
			if(req.column == 'no'){
				stringsqlorder +=` ORDER BY main_pack_id`
			}else{
            stringsqlorder +=` ORDER BY ${req.column}`
			}
        }else{
			stringsqlorder +=` ORDER BY main_pack_id`
		}
		
		if(req.dir !== '' && req.dir !== null){
            stringsqlorder +=` ${req.dir}`
        }else{
			stringsqlorder +=` asc`
		}
		
        if (req.text_search !== '' && req.text_search !== null) {
            stringsql += `and [Package_Type] like '%${req.text_search}%' or [Type_Group] like '%${req.text_search}%' 
            or [Package_Group] like '%${req.text_search}%' or [Mobile_Type] like '%${req.text_search}%' 
            or [Price] like '%${req.text_search}%' or [package_id] like '%${req.text_search}%' 
            or [Speed] like '%${req.text_search}%' or [Data_pack] like '%${req.text_search}%' 

            or [Data_pack_type] like '%${req.text_search}%' or [Voice_pack] like '%${req.text_search}%'

            or [Package_Name] like '%${req.text_search}%' or [Pack_File_Name] like '%${req.text_search}%' or [Pack_file_info] like '%${req.text_search}%'

            or [Name_Script] like '%${req.text_search}%'  or [Info_Script] like '%${req.text_search}%' `

        }
        console.log(stringsql)
        const page = await sql.query(`select count(main_pack_id) page from civr.tbl_civr_main_pack ${stringsql}`)
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
        let sql_query = `select main_pack_id PACK_ID,
        substring(convert(varchar,START_DATE,  120),1,30) START_DATE,
        substring(convert(varchar,END_DATE,  120),1,30)  END_DATE,
		substring(convert(varchar,LAST_UPDATE,  120),1,30)  LAST_UPDATE,
		main_pack_id MAIN_PACK_ID,
      Package_Type PACKAGE_TYPE,
      Type_Group [GROUP],
      Package_Group PACKAGE_GROUP,
      Mobile_Type MOBILE_TYPE,
      Price PRICE,
      Package_Name PACKAGE_NAME,
      package_id PACKAGE_CODE,
      Speed SPEED,
      Data_pack DATA_GB,
      Data_pack_type DATA_GB_TYPE,
      Voice_pack VOICE_MIN,
      Pack_File_Name FILE_NAME,
      Pack_file_info FILE_INFO,
      Name_Script NAME_SCRIPT,
      Info_Script INFO_SCRIPT,
      Enable ENABLE,
	  Owner OWNER
		 from civr.tbl_civr_main_pack ${stringsql} ${stringsqlorder}  OFFSET ${RowStart}  ROWS 
        FETCH NEXT ${req.page_size} ROWS ONLY`
        console.log(sql_query)
        const result = await sql.query(sql_query)
		 for(let i=0; i<result.recordset.length; i++){
            if( result.recordset[i].NAME_SCRIPT !== '' &&  result.recordset[i].NAME_SCRIPT !== null){
            let data = result.recordset[i].NAME_SCRIPT.indexOf('.wav')
            if(data>0){
                    result.recordset[i].NAME_SCRIPT=result.recordset[i].NAME_SCRIPT.replace('.wav','')
            }
        }
        if( result.recordset[i].INFO_SCRIPT !== '' &&  result.recordset[i].INFO_SCRIPT !== null){
            let data1 = result.recordset[i].INFO_SCRIPT.indexOf('.wav')
            if(data1>0){
                    result.recordset[i].INFO_SCRIPT=result.recordset[i].INFO_SCRIPT.replace('.wav','')
            }
        }
    }
        let responsedata = {
            "code": 200,
            "recnums": page.recordset[0].page,
            "totalpage": totalpage,
            "result": columns,
			"drowdowngroup":drowdowngroup.recordset,  
			"drowdownpdatapacktype":drowdownpdatapacktype.recordset,
			"drowdownspeed":drowdownspeed.recordset,
			"drowdowntypegrop":drowdowntypegrop.recordset,
            "data": result.recordset
        }
        return responsedata
    }
	
	    async getdatalistpackget(req){
	console.log(req)
        await sql.connect(config)
         const result = await sql.query(`
         select 
		main_pack_id PACK_ID,
        substring(convert(varchar,START_DATE,  120),1,30) START_DATE,
        substring(convert(varchar,END_DATE,  120),1,30) END_DATE,
		main_pack_id MAIN_PACK_ID,
      Package_Type PACKAGE_TYPE,
      Type_Group [GROUP],
      Package_Group PACKAGE_GROUP,
      Mobile_Type MOBILE_TYPE,
      Price PRICE,
      Package_Name PACKAGE_NAME,
      package_id PACKAGE_CODE,
      Speed SPEED,
      Data_pack DATA_GB,
      Data_pack_type DATA_GB_TYPE,
      Voice_pack VOICE_MIN,
      Pack_File_Name FILE_NAME,
      Pack_file_info FILE_INFO,
      Name_Script NAME_SCRIPT,
      Info_Script INFO_SCRIPT,
      Enable ENABLE

  from civr.tbl_civr_main_pack where main_pack_id='${req.PACK_ID}' `)
        let responsedata = {
            "code": 200,
            "data":result.recordset,
        }
        return responsedata

    }
	
    async editlistpackget(req) {
        await sql.connect(config)
        const result = await sql.query(`UPDATE civr.tbl_civr_main_pack
        SET 
                Package_Type ='${req.Package_Type}'
                ,Type_Group='${req.Group}'
                ,Package_Group='${req.Package_Group}'
                ,Mobile_Type='${req.Mobile_Type}'
                ,Price='${req.Price}'
                ,Package_Name='${req.Package_Name}'
                ,package_id='${req.Package_Code}'
                ,Speed='${req.Speed}'
                ,Data_pack='${req.Data_GB}'
                ,Data_pack_type='${req.type_size}'
                ,Data_pack_kb='${req.Data_Pack_Kb}'
                ,Voice_pack='${req.Voice_Min}'
                ,Pack_File_Name='${req.File_Name}'
                ,Pack_file_info='${req.File_Info}'
                ,Name_Script='${req.Name_Script}'
                ,Info_Script='${req.Info_Script}'
                ,OWNER='CIVR'
                ,Enable=${req.Enable}
                ,UPDATE_BY='${req.user_login}'
                ,LAST_UPDATE=current_timestamp
                ,START_DATE=convert(datetime,'${req.startdate}',120)
                ,END_DATE=convert(datetime,'${req.enddate}',120)
	      where main_pack_id =${req.PACK_ID}`)
        let responsedata = {
            "code": 200,
            "data": result.recordset,
        }
        return responsedata
    }

    async deletelistpackget(req) {
        await sql.connect(config)
        const result = await sql.query(`delete from  civr.tbl_civr_main_pack  WHERE main_pack_id=${req.PACK_ID}`)
        let responsedata = {
            "code": 200,
            "data": result.recordset,
        }
        return responsedata
    }


    async addlistpackget(req) {
        await sql.connect(config)

        let sqlquery = `INSERT INTO civr.tbl_civr_main_pack  (Package_Type
                ,Type_Group
                ,Package_Group
                ,Mobile_Type
                ,Price
                ,Package_Name
                ,package_id
                ,Speed
                ,Data_pack
                ,Data_pack_type
                ,Data_pack_kb
                ,Voice_pack
                ,Pack_File_Name
                ,Pack_file_info
                ,Name_Script
                ,Info_Script
                ,OWNER
                ,Enable
                ,CREATE_BY
                ,CREATE_DATE
                ,START_DATE
                ,END_DATE)
                  VALUES (
                  '${req.Package_Type}'
                  ,'${req.Group}'
                  ,'${req.Package_Group}'
                  ,'${req.Mobile_Type}'
                  ,'${req.Price}'
                  ,'${req.Package_Name}'
                  ,'${req.Package_Code}'
                  ,'${req.Speed}'
                  ,'${req.Data_GB}'
                  ,'${req.type_size}'
                  ,'${req.Data_Pack_Kb}'
                  ,'${req.Voice_Min}'
                  ,'${req.File_Name}'
                  ,'${req.File_Info}'
                  ,'${req.Name_Script}'
                  ,'${req.Info_Script}'
                  ,'CIVR'
                  ,${req.Enable}
                  ,'${req.user_login}'
                  ,current_timestamp
                  ,convert(datetime,'${req.startdate}',120)
                  ,convert(datetime,'${req.enddate}',120))`
        console.log(sqlquery)
        const result = await sql.query(sqlquery)
        let responsedata = {
            "code": 200,
            "data": result.recordset,
        }
        return responsedata
    }

}
const listpackgetService  = new ListpackgetService;;
module.exports = listpackgetService ;