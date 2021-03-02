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
class upsellhistoryService {
	
		async generatexml(req){
        await sql.connect(config)
        let responsedata = []
        const result1 = await sql.query(`select upsell_id,
        substring(convert(varchar,START_DATE,  120),1,30) START_DATE,
        substring(convert(varchar,END_DATE,  120),1,30)  END_DATE,
		substring(convert(varchar,LAST_UPDATE,  120),1,30)  LAST_UPDATE,
        Mobile_Type,
        Type_Group_Day,
        History_Package_Name,
        History_Package_Code,
        Upsell_Package_Group,
        Upsell_Package_Name,
        Upsell_Package_Code,
        Upsell_Group_Code,
        Upsell_Package_Sub_Code,
        Upsell_File_Name,
        Upsell_file_info,
        Owner,
        Enable,productId,productSequenceId,Upsell_Package_Day,Upsell_price,Upsell_Package_Type
		 from civr.tbl_civr_package_upsell_history where Enable=1`)
        responsedata.push(result1.recordset)
            return responsedata
    }
	
    async Listupsellhistory(req) {
        await sql.connect(config)
        let columns = []
        let columnname = "START_DATE,END_DATE,Mobile_Type,Type_Group_Day,History_Package_Name,History_Package_Code,Upsell_Package_Group,Upsell_Package_Name,Upsell_Package_Code,Upsell_Group_Code,Upsell_Package_Sub_Code,Upsell_File_Name,Upsell_file_info,Enable,productId,productSequenceId,Upsell_Package_Day,Upsell_price,Upsell_Package_Type"

        let columndata = "START_DATE,END_DATE,Mobile_Type,Type_Group_Day,History_Package_Name,History_Package_Code,Upsell_Package_Group,Upsell_Package_Name,Upsell_Package_Code,Upsell_Group Code,Upsell_Package_Sub_Code,Upsell_File_Name,Upsell_file_info,Enable,productId,productSequenceId,Upsell_Package_Day,Upsell_price,Upsell_Package_Type"

        let columnclassname = "text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left,text-left"

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
        //    if(req.packid !== '') {
        //     stringsql +=` and Data_pack = '${req.packid}'`
        //    }else if(req.packid != null) {
        //     stringsql +=` and Data_pack = '${req.packid}'`
        // }

        // if (req.Package_group !== '' && req.Package_group !== null) {
        //     stringsql += ` and [Package_Group] = '${req.Package_group}'`
        // }

         if (req.enable !== '' && req.enable !== null) {
             stringsql += ` and Enable = '${req.enable}'`
         }


        if (req.text_search !== '' && req.text_search !== null) {
            stringsql += ` and ([Mobile_Type] like '%${req.text_search}%' or [Type_Group_Day] like '%${req.text_search}%' 
            or [History_Package_Name] like '%${req.text_search}%' or [History_Package_Code] like '%${req.text_search}%' 
            or [Upsell_Package_Group] like '%${req.text_search}%' or [Upsell_Package_Name] like '%${req.text_search}%' 
            or [Upsell_Package_Code] like '%${req.text_search}%' or [Upsell_Group_Code] like '%${req.text_search}%' 
            or [Upsell_Package_Sub_Code] like '%${req.text_search}%' or [Upsell_File_Name] like '%${req.text_search}%'
            or [Upsell_file_info] like '%${req.text_search}%' or [Owner] like '%${req.text_search}%' or [Enable] like '%${req.text_search}%')`

        }
        console.log(stringsql)
        const page = await sql.query(`select count(upsell_id) page from civr.tbl_civr_package_upsell_history ${stringsql}`)
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
        let sql_query = `select upsell_id,
        substring(convert(varchar,START_DATE,  120),1,30) START_DATE,
        substring(convert(varchar,END_DATE,  120),1,30)  END_DATE,
		substring(convert(varchar,LAST_UPDATE,  120),1,30)  LAST_UPDATE,
        Mobile_Type,
        Type_Group_Day,
        History_Package_Name,
        History_Package_Code,
        Upsell_Package_Group,
        Upsell_Package_Name,
        Upsell_Package_Code,
        Upsell_Group_Code,
        Upsell_Package_Sub_Code,
        Upsell_File_Name,
        Upsell_file_info,
        Owner,
        Enable,productId,productSequenceId,Upsell_Package_Day,Upsell_price,Upsell_Package_Type
		 from civr.tbl_civr_package_upsell_history ${stringsql} ORDER BY upsell_id OFFSET ${RowStart}  ROWS 
        FETCH NEXT ${req.page_size} ROWS ONLY `
        console.log(sql_query)
        const result = await sql.query(sql_query)
		 for(let i=0; i<result.recordset.length; i++){
            if( result.recordset[i].Upsell_File_Name !== '' &&  result.recordset[i].Upsell_File_Name !== null){
            let data = result.recordset[i].Upsell_File_Name.indexOf('.wav')
            if(data>0){
                    result.recordset[i].Upsell_File_Name=result.recordset[i].Upsell_File_Name.replace('.wav','')
            }
        }
        if( result.recordset[i].Upsell_file_info !== '' &&  result.recordset[i].Upsell_file_info !== null){
            let data1 = result.recordset[i].Upsell_file_info.indexOf('.wav')
            if(data1>0){
                    result.recordset[i].Upsell_file_info=result.recordset[i].Upsell_file_info.replace('.wav','')
            }
        }
    }
        let responsedata = {
            "code": 200,
            "recnums": page.recordset[0].page,
            "totalpage": totalpage,
            "result": columns,
            "data": result.recordset
        }
        return responsedata
    }

    async editlistupsellhistory(req) {
        await sql.connect(config)
        const result = await sql.query(`UPDATE civr.tbl_civr_package_upsell_history
        SET     START_DATE=convert(datetime,'${req.startdate}',120)
                ,END_DATE=convert(datetime,'${req.enddate}',120)
                ,LAST_UPDATE=current_timestamp
                ,UPDATE_BY='${req.user_login}'
                ,Mobile_Type='${req.Mobile_Type}'
                ,Type_Group_Day='${req.Type_Group_Day}'
                ,History_Package_Name='${req.History_Package_Name}'
                ,History_Package_Code='${req.History_Package_Code}'
                ,Upsell_Package_Group='${req.Upsell_Package_Group}'
                ,Upsell_Package_Name='${req.Upsell_Package_Name}'
                ,Upsell_Package_Code='${req.Upsell_Package_Code}'
                ,Upsell_Group_Code='${req.Upsell_Group_Code}'
                ,Upsell_Package_Sub_Code='${req.Upsell_Package_Sub_Code}'
                ,Upsell_File_Name='${req.Upsell_File_Name}'
                ,Upsell_file_info='${req.Upsell_file_info}'
                ,Owner='cIVR'
                ,Enable='${req.Enable}'
				,productId='${req.productId}'
				,productSequenceId='${req.productSequenceId}'
				,Upsell_Package_Day='${req.Upsell_Package_Day}'
				,Upsell_price='${req.Upsell_price}'
				,Upsell_Package_Type='${req.Upsell_Package_Type}'
	      where upsell_id =${req.upsell_id}`)
        let responsedata = {
            "code": 200,
            "data": result.recordset,
        }
        return responsedata
    }

    async deletelistupsellhistory(req) {
        await sql.connect(config)
        const result = await sql.query(`delete from  civr.tbl_civr_package_upsell_history  WHERE upsell_id=${req.upsell_id}`)
        let responsedata = {
            "code": 200,
            "data": result.recordset,
        }
        return responsedata
    }


    async addlistupsellhistory(req) {
        await sql.connect(config)

        let sqlquery = `INSERT INTO civr.tbl_civr_package_upsell_history  (
            [CREATE_DATE],
            [CREATE_BY],
            [START_DATE],
            [END_DATE],
            [Mobile_Type],
            [Type_Group_Day],
            [History_Package_Name ],
            [History_Package_Code],
            [Upsell_Package_Group ],
            [Upsell_Package_Name ],
            [Upsell_Package_Code],
            [Upsell_Group_Code],
            [Upsell_Package_Sub_Code],
            [Upsell_File_Name],
            [Upsell_file_info],
            [Owner],
            [Enable],
			[productId],
			[productSequenceId],
			[Upsell_Package_Day],
			[Upsell_price],
			[Upsell_Package_Type])
                  VALUES (
                    current_timestamp
                        ,'${req.user_login}'
                        ,convert(datetime,'${req.startdate}',120)
                        ,convert(datetime,'${req.enddate}',120)
                        ,'${req.Mobile_Type}'
                        ,'${req.Type_Group_Day}'
                        ,'${req.History_Package_Name}'
                        ,'${req.History_Package_Code}'
                        ,'${req.Upsell_Package_Group}'
                        ,'${req.Upsell_Package_Name}'
                        ,'${req.Upsell_Package_Code}'
                        ,'${req.Upsell_Group_Code}'
                        ,'${req.Upsell_Package_Sub_Code}'
                        ,'${req.Upsell_File_Name}'
                        ,'${req.Upsell_file_info}'
                        ,'cIVR'
                        ,'${req.Enable}'
						,'${req.productId}'
						,'${req.productSequenceId}'
						,'${req.Upsell_Package_Day}'
						,'${req.Upsell_price}'
						,'${req.Upsell_Package_Type}'			
                  )`
        console.log(sqlquery)
        const result = await sql.query(sqlquery)
        let responsedata = {
            "code": 200,
            "data": result.recordset,
        }
        return responsedata
    }

}
const UpsellhistoryService = new upsellhistoryService;
module.exports = UpsellhistoryService;