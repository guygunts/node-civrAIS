const sql = require('mssql')
const config = {
    user: 'sa',
    password: 'P@ssw0rd',
    server: '192.168.38.203',
    database: 'civrdb',
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    "options": {
        "trustedConnection": true,
        "useUTC": true
    },
    encrypt: false
}
class ListpackgetService {
    async ListpackgetService(req) {
        await sql.connect(config)
        // for (let i = 0; i < req.Main_ontop_mix.length; i++) {
        //     await sql.query` insert  civr.tbl_civr_main_pack(
        //         CREATE_DATE,
        //         LAST_UPDATE,
        //         START_DATE,
        //         END_DATE,
        //         Type_Group,
        //         Package_Group,
        //         Mobile_Type,
        //         Price,
        //         package_id,
        //         Speed,
        //         Data_pack,
        //         Voice_pack,
        //         Voice_file,
        //         File_Name,
        //         file_info,
        //         Name_Script,
        //         Info_Script,
        //         Enable,
        //         Owner,
        //         Offer_Ontop_Pack,Package_Name,Data_pack_kb )
        //      VALUES (CURRENT_TIMESTAMP,${req.Main_ontop_mix[i].LAST_UPDATE},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,
        //         ${req.Main_ontop_mix[i].Type_Group},
        //         ${req.Main_ontop_mix[i].Package_Group},
        //         ${req.Main_ontop_mix[i].Mobile_Type},
        //          ${req.Main_ontop_mix[i].Price},
        //         ${req.Main_ontop_mix[i].package_id},
        //         ${req.Main_ontop_mix[i].Speed},
        //         ${req.Main_ontop_mix[i].Data_pack},
        //         ${req.Main_ontop_mix[i].Voice_pack},
        //         ${req.Main_ontop_mix[i].Voice_file},
        //         ${req.Main_ontop_mix[i].Pack_file_Name},
        //         ${req.Main_ontop_mix[i].Pack_file_info},
        //         ${req.Main_ontop_mix[i].Name_Script},
        //         ${req.Main_ontop_mix[i].Info_Script},
        //         ${req.Main_ontop_mix[i].Enable},
        //         ${req.Main_ontop_mix[i].Owner},
        //         ${req.Main_ontop_mix[i].Offer_Ontop_Pack},
        //         ${req.Main_ontop_mix[i].Package_Name},
        //         ${req.Main_ontop_mix[i].Data_pack_kb});`
        //         console.log(i)
        // }
        const drowdowngroup =await sql.query `select Package_Group as name from civr.tbl_civr_main_pack group by Package_Group order by Package_Group desc`
        const drowdownpack =await sql.query `select Data_pack as name from civr.tbl_civr_main_pack group by Data_pack order by Data_pack asc`
        let stringsql=` where 1=1`
        if(req.packid != '') {
            stringsql +=` and Data_pack = '${req.packid}'`
        }
        
        if(req.group != ''){
            stringsql +=` and Package_Group = '${req.group}'`
        }

        if(req.start_date != ''){
            stringsql +=` and START_DATE >= CONVERT(DATETIME, '${req.start_date}')`
        }
        
        if(req.end_date != ''){
            stringsql +=` and START_DATE <= CONVERT(DATETIME, '${req.end_date}')`
        }

        if(req.text_search != ''){
            stringsql +=` and Type_Group like '%${req.text_search}%' and Package_Group like '%${req.text_search}%' 
            and Mobile_Type like '%${req.text_search}%' and Price like '%${req.text_search}%' 
            and package_id like '%${req.text_search}%' and Speed like '%${req.text_search}%' 
            and Data_pack like '%${req.text_search}%' and Voice_pack like '%${req.text_search}%' 
            and Voice_file like '%${req.text_search}%' and File_Name like '%${req.text_search}%'
            and file_info like '%${req.text_search}%' and Name_Script like '%${req.text_search}%'
            Name_Script like '%${req.text_search}%' and Info_Script like '%${req.text_search}%'
            and Package_Name like '%${req.text_search}%'`
        }

         const page= await sql.query (`select count(main_pack_id) page from civr.tbl_civr_main_pack ${stringsql}`)
         let RowStart
          let pagenum = (page.recordset[0].page / req.page_size);
            if ((pagenum * req.page_size) < page.recordset[0].page) {
                pagenum  += pagenum  + 1 
            }
            if(req.page_id == 1){
                 RowStart = 0;
                let RowEnd = req.page_size; 
            }else{
                 RowStart = (req.page_size * (req.page_id-1))   ;
            }
         let totalpage= Math.ceil(page.recordset[0].page/req.page_size);
        const result = await sql.query(`
         select main_pack_id,
        START_DATE,
        END_DATE,
        Package_Name,
        Type_Group,
        Package_Group,
        Mobile_Type,
        Price,
        package_id,
        Speed,
        Data_pack,
        Voice_pack,
        Voice_file,
        File_Name,
        file_info,
        Name_Script,
        Info_Script,
        Enable,
        Owner,
        Offer_Ontop_Pack from civr.tbl_civr_main_pack ${stringsql} ORDER BY main_pack_id OFFSET ${RowStart}  ROWS 
        FETCH NEXT ${req.page_size} ROWS ONLY `)
        let header=[]
            for(let [key,value] of Object.entries(result.recordset.columns)){
                let data ={
                    "column_name": key,
                    "column_field": key,
                    "column_type": "text",
                    "column_align": "left"
            }
                header.push(data)
            }

        
        let responsedata = {
            "code": 200,
            "recnums": page.recordset[0].page,
            "totalpage":totalpage,
            "result":header,
            "drowdowngroup":drowdowngroup.recordset,
            "drowdownpack":drowdownpack.recordset,
            "data":result.recordset
        }
        return responsedata
    }
}
const listpackgetService = new ListpackgetService;
module.exports = listpackgetService;