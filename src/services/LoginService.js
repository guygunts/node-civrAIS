const connectmssql=require('../MssqlDatabase')
const jwt = require('jsonwebtoken');
const pathdev=require('dotenv').config({ path: './config/dev.env' });
let SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
class LoginService {
  
    
    async loginUser(req) {
            const result = await this.loginUsers(req)
            log.info("response Data:",result)
            return result
    }
    async adminMenu(req) {
        try {
            if (req.body.menu_action == 'getmenus') {
                const result = await this.getMenu(req)
                log.info("response Data:",result)
                return result
            }
            if (req.body.menu_action == 'addmenu' || req.body.menu_action == 'updatemenu' || req.body.menu_action == 'deletemenu') {
                console.log(req.body)
                const result = await this.addupdatedeleteMenu(req)
                log.info("response Data:",result)
                return result 
        }
            if (req.body.menu_action == 'getfunctions') {
                const result = await this.getFunction(req)
                log.info("response Data:",result)
                return result
            }
            if (req.body.menu_action == 'addfunction' || req.body.menu_action == 'updatefunction' || req.body.menu_action == 'deletefunction') {
                const result = await this.addupdatedeleteFunction(req)
                log.info("response Data:",result)
                return result
                
        }
            // User Management
            if (req.body.menu_action == 'getusers') {
                const result = await this.getUser(req)
                log.info("response Data:",result)
                return result  
            }
            if (req.body.menu_action == 'adduser' || req.body.menu_action == 'updateuser' || req.body.menu_action == 'deleteuser') {
                const result = await this.addupdatedeleteUser(req)
                log.info("response Data:",result)
                return result
                
        }
            // Role Management 
            if (req.body.menu_action == 'getroles') {
                const result = await this.getRole(req)
                log.info("response Data:",result)
                return result
            }
            if (req.body.menu_action == 'addrole' || req.body.menu_action == 'updaterole' || req.body.menu_action == 'deleterole') {
                const result = await this.addupdatedeleteRole(req)
                log.info("response Data:",result)
                return result
             
        }
            if (req.body.menu_action == 'getprojects') {
                const result = await this.getProjects(req)
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'addproject' || req.body.menu_action == 'updateproject' || req.body.menu_action == 'deleteproject') {
                console.log(req.body)
                const result = await this.addupdatedeleteProjects(req)
                log.info("response Data:",result)
                return result
                
            }

            if (req.body.menu_action == 'getconcepts') {
                const result = await this.getConcepts(req)
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'addconcept' || req.body.menu_action == 'updateconcept' || req.body.menu_action == 'deleteconcept' ||req.body.menu_action == 'addvariation'||req.body.menu_action == 'updatevariation'||req.body.menu_action == 'deletevariation') {
                console.log(req.body)
                const result = await this.addupdatedeleteconcepts(req)
                log.info("response Data:",result)
                return result
                
            }

            if (req.body.menu_action == 'addconceptsvariation' || req.body.menu_action == 'updateconceptsvariation' || req.body.menu_action == 'deleteconceptsvariation') {
                console.log(req.body)
                const result = await this.addupdatedeleteconceptsvariation(req)//wait store
                log.info("response Data:",result)
                return result
                
            }

            if (req.body.menu_action == 'getprefixs') {
                const result = await this.getprefixs(req)//wait store
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'getcategory') {
                const result = await this.getcategory(req)
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'addcategory' || req.body.menu_action == 'updatecategory' || req.body.menu_action == 'deletecategory') {
                console.log(req.body)
                const result = await this.addupdatedeletecategory(req)
                log.info("response Data:",result)
                return result
                
            }
            if (req.body.menu_action == 'getsubcategory') {
                const result = await this.getsubcategory(req)
                log.info("response Data:",result)
                return result
            }
            if (req.body.menu_action == 'getintentbycateid') {
                const result = await this.getintentbycateid(req)
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'getsubintentbyintent') {
                const result = await this.getsubintentbyintent(req)
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'addintent' || req.body.menu_action == 'updateintent' || req.body.menu_action == 'deleteintent') {
                console.log(req.body)
                const result = await this.addupdatedeleteintent(req)
                log.info("response Data:",result)
                return result
                
            }

            if (req.body.menu_action == 'updateallcontent') {
                const result = await this.updateallcontent(req)//wait store
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'updateintentsentence') {
                const result = await this.updateintentsentence(req)//wait store
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'getsentencebyintent') {
                const result = await this.getsentencebyintent(req)
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'getsentencebysubintent') {
                const result = await this.getsentencebysubintent(req)//wait store
                log.info("response Data:",result)
                return result
            }
            
            if (req.body.menu_action == 'searchsentence') {
                const result = await this.searchsentence(req)//wait store
                log.info("response Data:",result)
                return result
            }

            if (req.body.menu_action == 'processsentence') {
                const result = await this.processsentence(req)//wait store
                log.info("response Data:",result)
                return result
            }


            if (req.body.menu_action == 'addsentence' || req.body.menu_action == 'updatesentence' || req.body.menu_action == 'deletesentence') {
                console.log(req.body)
                const result = await this.addupdatedeleteSentence(req)
                log.info("response Data:",result)
                return result
                
            }

            if (req.body.menu_action == 'uploadsentence') {
                const result = await this.uploadsentence(req)// wait store
                log.info("response Data:",result)
                return result
               
            }

            if (req.body.menu_action == 'movesentence') {
                const result = await this.moveSentence(req)
                log.info("response Data:",result)
                return result
               
            }

            if (req.body.menu_action == 'testgrammar') {
                const result = await this.testgrammar(req)//  wait store
                log.info("response Data:",result)
                return result
               
            }

            if (req.body.menu_action == 'getprefixconcepts') {
                const result = await this.getprefixconcepts(req)//  wait store
                log.info("response Data:",result)
                return result
               
            }

            if (req.body.menu_action == 'getsuffixconcepts') {
                const result = await this.getsuffixconcepts(req)//  wait store
                log.info("response Data:",result)
                return result
               
            }

            if (req.body.menu_action == 'updatepermission') {
                console.log(req.body.menus)
                const result = await this.updatepermission(req)
                log.info("response Data:",result)
                return result
               
            }
            if (req.body.menu_action == 'updateIntentActiveStatus') {
                console.log(req.body.menus)
                const result = await this.updateIntentActiveStatus(req)
                log.info("response Data:",result)
                return result
               
            }

            if (req.body.menu_action == 'updateSentenceActiveStatus') {
                console.log(req.body.menus)
                const result = await this.updateSentenceActiveStatus(req)
                log.info("response Data:",result)
                return result
               
            }
			
			if(req.body.menu_action == 'getvariation'){
				console.log(req.body.menus)
                const result = await this.getvariation(req)
                log.info("response Data:",result)
                return result
				
			}
        } catch (err) {
            console.log(err);
            log.error("response Data:",err)
        }

    }

    async loginUsers(req){
        
        try {
        let row= await   connectmssql.then((pool) => {
            return pool.request() 
            .input('jsonIN', JSON.stringify(req))
            .output('resultOUT')
            .execute(`${pathdev.parsed.database}.civr.sp_login`)
        })
            var menus = []
            var sub_menu = []

            for (var i = 0; i < row.recordset.length; i++) {

                // ------------------------------------>
                if (row.recordsets[0][i].sub_menu_nums > 0) {

                    sub_menu = []
                    let data_sub={
                        "user_name":row.recordsets[1][0].user_name,
                        "menu_active":row.recordsets[0][i].menu_id,
                        "role_id":row.recordsets[1][0].role_id

                    }
                    let sub_data= await  connectmssql.then((pool) => {
                        return pool.request() 
                        .input('jsonIN', JSON.stringify(data_sub))
                        .output('resultOUT')
                        .execute(`${pathdev.parsed.database}.civr.sp_sub_menu`)
                    })
                        if(sub_data.recordsets.length !== 0){
                            if(sub_data.recordsets[0].length  !== 0 ){
                        for (var i2 = 0; i2 < sub_data.recordsets[0].length; i2++) {
                                    const item2 = {
                                        "sub_menu_id": sub_data.recordsets[0][i2].sub_menu_id,
                                        "sub_menu_name": sub_data.recordsets[0][i2].sub_menu_name,
                                        "sub_menu_path": sub_data.recordsets[0][i2].sub_menu_url,
                                        "sub_menu_icon": sub_data.recordsets[0][i2].sub_menu_icon,
                                        "sub_menu_active": sub_data.recordsets[0][i2].sub_menu_active
                                    }
                                    sub_menu.push(item2)
                        }
                    }else{
                        sub_menu = []
                    }
                    }else{
                
                        sub_menu = []
                    }
                    const item = {
                        "menu_id": row.recordsets[0][i].menu_id,
                        "menu_name": row.recordsets[0][i].menu_name,
                        "menu_path": row.recordsets[0][i].menu_url,
                        "menu_icon": row.recordsets[0][i].menu_icon,
                        "menu_active": row.recordsets[0][i].menu_active,
                        sub_menu
                    }
                    menus.push(item);
                } else {
                    const item = {
                        "menu_id": row.recordsets[0][i].menu_id,
                        "menu_name": row.recordsets[0][i].menu_name,
                        "menu_path": row.recordsets[0][i].menu_url,
                        "menu_icon": row.recordsets[0][i].menu_icon,
                        "menu_active": row.recordsets[0][i].menu_active,
                        "sub_menu": []
                    }
                    menus.push(item);
                }

            }
            var result
            var status = row.recordsets[3][0].msg;
            if (row.recordsets[3][0].result == 401) {
                result = 0;
            } else if (row.recordsets[3][0].result == 200) {
                const token = jwt.sign({ status }, 'secretkey', { expiresIn: '1d' });
                result = token
            }

            var resultJson
            var roleID
            var roleName
            if (row.recordsets[1][0].user_name == 'superadmin') {
                roleID = 0
                roleName = "Super Admin"
            } else {
                roleID = row.recordsets[1][0].role_id
                roleName = row.recordsets[1][0].role_name
            }
            resultJson = {
                "code": row.recordsets[3][0].result,
                "msg": row.recordsets[3][0].msg,
                "token": result,
                "result": {
                    "profile": {
                        "first_name": row.recordsets[1][0].first_name,
                        "last_name": row.recordsets[1][0].last_name,
                        "prefix_name": row.recordsets[1][0].prefix_name,
                        "email": row.recordsets[1][0].email,
                        "user_type": row.recordsets[1][0].user_type
                    },
                    "roles": [
                        {
                            "role_id": roleID,
                            "role_name": roleName,
                            menus,
                            "function": row.recordsets[2]
                        }
                    ],

                }
            }
			
            return resultJson

        } catch (err) {
            log.error("response Data LoginUser:",err)
        }
    }


    async getMenu(req) {
        try {
            let row= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_getmenu`)
            })

            var menus = []
            var sub_menu = []

            for (var i = 0; i < row.recordset.length; i++) {

                // ------------------------------------>
                if (row.recordsets[0][i].sub_menu_nums > 0) {

                    sub_menu = []
                    let data_sub={
                        "user_name":row.recordsets[1][0].user_name,
                        "menu_active":row.recordsets[0][i].menu_id,
                        "role_id":row.recordsets[1].role_id

                    }
                    let sub_data= await  connectmssql.then((pool) => {
                        return pool.request() 
                        .input('jsonIN', JSON.stringify(data_sub))
                        .output('resultOUT')
                        .execute(`${pathdev.parsed.database}.civr.sp_sub_menu`)
                    })
                        if(sub_data.recordsets.length !== 0){
                            if(sub_data.recordsets[0].length  !== 0 ){
                        for (var i2 = 0; i2 < sub_data.recordsets[0].length; i2++) {
                                    const item2 = {
                                        "sub_menu_id": sub_data.recordsets[0][i2].sub_menu_id,
                                        "sub_menu_name": sub_data.recordsets[0][i2].sub_menu_name,
                                        "sub_menu_path": sub_data.recordsets[0][i2].sub_menu_url,
                                        "sub_menu_icon": sub_data.recordsets[0][i2].sub_menu_icon,
                                        "sub_menu_active": sub_data.recordsets[0][i2].sub_menu_active
                                    }
                                    sub_menu.push(item2)
                        }
                    }else{
                        sub_menu = [{}]
                    }
                    }else{
                
                        sub_menu = [{}]
                    }
                    const item = {
                        "menu_id": row.recordsets[0][i].menu_id,
                        "menu_name": row.recordsets[0][i].menu_name,
                        "menu_path": row.recordsets[0][i].menu_url,
                        "menu_icon": row.recordsets[0][i].menu_icon,
                        "menu_active": row.recordsets[0][i].menu_active,
                        sub_menu
                    }
                    menus.push(item);
                } else {
                    const item = {
                        "menu_id": row.recordsets[0][i].menu_id,
                        "menu_name": row.recordsets[0][i].menu_name,
                        "menu_path": row.recordsets[0][i].menu_url,
                        "menu_icon": row.recordsets[0][i].menu_icon,
                        "menu_active": row.recordsets[0][i].menu_active,
                        "sub_menu": [{}]
                    }
                    menus.push(item);
                }

            }
            let result=[]
			let data1={
				"code": row.recordsets[1][0].result,
                "msg": row.recordsets[1][0].msg,
                "recnums": row.recordsets[1][0].recnum,
                "pagenum": row.recordsets[1][0].pagenum,
			}
			result.push(data1)
			 let resultJson = {
                "reportname": "Get Menu",
                "columnsname": [{
                        "column_name": "Menu Name",
                        "column_field": "menu_name"
                    }],
                "recs": menus,
                "result": result
            };
			
            return resultJson

        } catch (err) {
            log.error("response Data getMenu:",err)
        }
    }

    async addupdatedeleteMenu(req){
  
        try {
            let row= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('result')
				.output('login_msg')
                .execute(`${pathdev.parsed.database}.civr.sp_admin_menu`)
            })	
			console.log(row);
            var resultJson
            resultJson = {
                "code": row.output.result,
                "msg": row.output.login_msg,
            }
            return resultJson
            
        } catch (err) {
            log.error("response Data addupdatedeleteMenu:",err)
        }
    }


    async getFunction(req) {

        try {
            let row= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_getfunction`)
            })	
            console.log(row)
            var resultJson
            resultJson = {
                "code": row.recordsets[1][0].msgresult,
                "msg": row.recordsets[1][0].msg,
                "recnums": row.recordsets[1][0].recnum,
                "pagenum": row.recordsets[1][0].pagenum,
                "result": {
                    "header": [{
                        "column_name": "Function Name",
                        "column_field": "function_name",
                        "column_type": "text",
                        "column_align": "left"
                    }],
                    "data": row.recordsets[0]
                }
            }
			
            return resultJson

        } catch (err) {
            log.error("response Data getFunction:",err)
        }

    }

    
    async addupdatedeleteFunction(req){
        try {
            let row= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_admin_menu`)
            })	
            return row.recordsets[1][0]

        } catch (err) {
            log.error("response Data addupdatedeleteFunction:",err)
        }
    }


    async getRole(req) {
        try {
            let row= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_getRole`)
            })
            console.log(row)
            let data = []
            let menus = []
            let sub_menu=[]
            var functions = []
            let data_get_role_menu={
                "role_id_in":row.recordsets[0][0].role_id
            }
            for (var i = 0; i < row.recordsets[0].length; i++) {
                menus = []
                let menudata= await   connectmssql.then((pool) => {
                    return pool.request() 
                    .input('jsonIN', JSON.stringify(data_get_role_menu))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getrole_menu`)
                })
                functions =[]
               const item ={
                   "role_id":row.recordsets[0][i].role_id,
                   "role_name":row.recordsets[0][i].role_name,
                   "role_desc":row.recordsets[0][i].role_desc,
                   "menus":menus,
                   "function":functions
               }
               if(menudata.recordsets[2].length !== 0){
                   for(let i=0; i<menudata.recordsets[2].length; i++){
                    const item={
                        "role_id": menudata.recordsets[2][i].role_id,
                        "function_id": menudata.recordsets[2][i].function_id,
                        "function_name": menudata.recordsets[2][i].function_name
                }
                functions.push(item)
                   }
               
            }else{
                functions.push({})
                functions =[]
                
            }
                let fix=0;
               for( fix=0; fix<menudata.recordsets[0].length; fix++){
                sub_menu =[]
                const item={
                        "menu_id": menudata.recordsets[0][fix].menu_id,
                        "menu_name": menudata.recordsets[0][fix].menu_name,
                        "menu_url": menudata.recordsets[0][fix].menu_url,
                        "menu_icon": menudata.recordsets[0][fix].menu_icon,
                        "menu_active":menudata.recordsets[0][fix].menu_active,
                        "sub_menu_nums":menudata.recordsets[0][fix].sub_menu_nums,
                        "sub_menu":sub_menu
                }
                
                
                    for(let i=0; i<menudata[1].length; i++){
                        if(menudata[0][fix].menu_id == menudata[1][i].menu_id ){
                            if(menudata[1][i].sub_menu_id !== null ){
                    const item={
                        "menu_id": menudata.recordsets[1][i].menu_id,
                        "sub_menu_id": menudata.recordsets[1][i].sub_menu_id,
                        "sub_menu_name": menudata.recordsets[1][i].sub_menu_name,
                        "sub_menu_url": menudata.recordsets[1][i].sub_menu_url,
                        "sub_menu_icon":menudata.recordsets[1][i].sub_menu_icon,
                        "sub_menu_active":menudata.recordsets[1][i].sub_menu_active,              
                }
                sub_menu.push(item) 
                continue;
            }
            sub_menu.push({})
            sub_menu =[]
            }
            }
                menus.push(item)   
               }
               
               data.push(item)

            

            }

           
             let result =[]
            let data1={
                "code": row.recordsets[1][0].result,
                "msg": row.recordsets[1][0].msg,
                "recnums": row.recordsets[1][0].recnum,
                "pagenum": row.recordsets[1][0].pagenum,
             }
             result.push(data1)

            let resultJson = {
                "reportname": "Get Role",
                "columnsname": [{
                    "column_name": "Role Name",
                    "column_field": "role_name"
                }, {
                    "column_name": "Role Description",
                    "column_field": "role_desc"
                }],
                "recs":data, 
                "result": result
            };
			
            return resultJson

        } catch (err) {
            log.error("response Data getRole:",err)
        }
    }

    async addupdatedeleteRole(req){
		console.log(req.body)
        try {
                let role= await   connectmssql.then((pool) => {
                    return pool.request() 
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_role`)
                })
				console.log(role)
            return role.recordset[0]

        } catch (err) {
            log.error("response Data addupdatedeleteRole:",err)
        }
    }


    
    async getUser(req) {
        try { 
                let rows= await   connectmssql.then((pool) => {
                    return pool.request() 
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getuser_role`)
                })
               let data =rows.recordsets[0]
            var resultJson
            resultJson = {
                "code": rows.recordsets[1][0].result,
                "msg": rows.recordsets[1][0].msg,
                "recnums": rows.recordsets[1][0].recnum,
                "pagenum": rows.recordsets[1][0].pagenum,
                "result": {
                    "header": [{
                        "column_name": "First Name",
                        "column_field": "first_name",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "Last Name",
                        "column_field": "last_name",
                        "column_type": "text",
                        "column_align": "left",
                    }, {
                        "column_name": "User Name",
                        "column_field": "user_name",
                        "column_type": "text",
                        "column_align": "left",
                    }, {
                        "column_name": "User Role",
                        "column_field": "role_name",
                        "column_type": "text",
                        "column_align": "left",
                    }, {
                        "column_name": "Active",
                        "column_field": "active",
                        "column_type": "checkbox",
                        "column_align": "center",
                    }],
                    data
                }
            }
			
            return resultJson

        } catch (err) {
            log.error("response Data getUser:",err)
        }
    }

    async addupdatedeleteUser(req){
        var resultJson
        console.log(req.body)
        try {
            let role= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
				.output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_admin_user`)
            })

        return role.recordsets[0]

        } catch (err) {
            log.error("response Data addupdatedeleteUser:",err)
        }
		
		
        return resultJson
    }
    

    async getProjects(req) {
        try {
            let rows= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('msgout')
                .execute(`${pathdev.parsed.database}.civr.sp_getprojects`)
            })
			
			        let resultJson = {
            "reportname": "Get Project",
            "columnsname":   [{
                "column_name": "Project Name",
                "column_field": "project_name",
            }, {
                "column_name": "Project Description",
                "column_field": "project_desc",
            }, {
                "column_name": "Language",
                "column_field": "language",
            }, {
                "column_name": "Channel",
                "column_field": "channel",
            }, {
                "column_name": "Active",
                "column_field": "active",
            }],
            "recs":rows.recordsets[0], 
            "result": rows.recordsets[1]
        };	
            return resultJson
			
			
            return resultJson
        } catch (err) {
            log.error("response Data getProjects:",err)
        }
    }

    async addupdatedeleteProjects(req){
        try {
            let role= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_admin_project`)
            })
		 var resultJson
            resultJson = {
                "code": role.recordset[0].code,
                "msg": role.recordset[0].msg,
            }
			console.log(resultJson)
            return resultJson

        } catch (err) {
            log.error("response Data addupdatedeleteProjects:",err)
        }
    }



    async updatepermission(req){
        try {
            var roleID = req.body.role_id
            var objMenu = req.body.menus
            let menuItem = ""
            var submenuItem = ""
            var objFunc = req.body.functions
            var funcItem = ""
            if(typeof objMenu !== 'undefined'){
            for (var i = 0; i < objMenu.length; i++) {
                if (menuItem == "") {

                    if (objMenu[i].sub_menus.length > 0) {
                        for (var i2 = 0; i2 < objMenu[i].sub_menus.length; i2++) {
                            if (submenuItem == "") {
                                submenuItem = objMenu[i].menu_id + ',' + objMenu[i].sub_menus[i2].sub_menu_id+'|'
                            } else {
                                submenuItem = submenuItem  + objMenu[i].menu_id + ',' + objMenu[i].sub_menus[i2].sub_menu_id+'|'

                            }
                        }
                    } else {
                        menuItem = objMenu[i].menu_id + ',' + objMenu[i].sub_menus.length+'|'
                    }

                } else {

                    if (objMenu[i].sub_menus.length > 0) {
                        for (var i2 = 0; i2 < objMenu[i].sub_menus.length; i2++) {
                            if (submenuItem == "") {
                                submenuItem = objMenu[i].menu_id + ',' + objMenu[i].sub_menus[i2].sub_menu_id+ '|'
                            } else {
                                submenuItem = submenuItem  + objMenu[i].menu_id + ',' + objMenu[i].sub_menus[i2].sub_menu_id+ '|'

                            }
                        }
                    } else {
                        menuItem += objMenu[i].menu_id + ',' + objMenu[i].sub_menus.length+ '|'
                    }

                }
            }
        }
            if(typeof objFunc !== 'undefined'){
                for (var i = 0; i < objFunc.length; i++) {
                    if (funcItem == "") {
                        funcItem = objFunc[i].function_id+ '|'
                    } else {
                        funcItem = funcItem  + objFunc[i].function_id+ '|'
                    }
                }
            }

            const rows= await  connectmssql.then((pool) => {
                return pool.request() 
                .input('role_id_in', roleID)
                .input('menu_map1', menuItem)
                .input('menu_map2', submenuItem)
                .input('func_map', funcItem)
                .input('user_login', req.body.user_login)
                .output('result')
                .output('msg')
                .execute(`${pathdev.parsed.database}.civr.sp_update_permission`)
            })

            var resultJson


                    resultJson = {
                        "code": rows.output.result,
                        "msg": rows.output.msg,
                    }

            return resultJson

        } catch (err) {
            log.error("response Data addupdatedeleteProjects:",err)
        }

    }

	   async getConcepts(req) {
        try {
			  const rows= await  connectmssql.then((pool) => {
                        return pool.request() 
                        .input('jsonIN',JSON.stringify(req.body))
                        .output('msgout')
                        .execute(`${pathdev.parsed.database}.civr.sp_getconcept`)
                    })


            let result = []
            let resultJson
            let columnName = ''
            let arrcolumnName
			let columnData = ''
            let arrcolumnData
            let subcolumnName = ''
            let arrsubcolumnName
            let column = []
            let subresult = []
            let data = []
            columnName = rows.recordsets[1][0].columnName
            arrcolumnName = columnName.split(',')
			columnData = rows.recordsets[1][0].columnData
            arrcolumnData=columnData.split(',')
			
            subcolumnName = rows.recordsets[1][0].subcolumnName
            arrsubcolumnName = subcolumnName.split(',')


            for (let i = 0; i < arrcolumnName.length; i++) {
                let data = {
                    'column_name': arrcolumnName[i],
                    'column_data': arrcolumnData[i]
                }
                result.push(data)
            }

            let variation =[]

            for (let i = 0; i < rows.recordsets[0].length; i++) {
                let body ={
                    "concept_id" : rows.recordsets[0][i].concept_id,
	                "page_id" : req.body.page_id,
	                "page_size":req.body.page_size
                }
				
				const variation= await  connectmssql.then((pool) => {
                        return pool.request() 
                        .input('jsonIN',JSON.stringify(req.body))
                        .output('msgout')
                        .execute(`${pathdev.parsed.database}.civr.sp_getconcept_variation`)
                    })
					

				console.log("data"+variation.recordsets)
                let datasub = {
                    "concept_id": rows.recordsets[0][i].concept_id,
                    "concept_name": rows.recordsets[0][i].concept_name,
                    "lang": rows.recordsets[0][i].lang,
                    "type": rows.recordsets[0][i].type,
                    "active": rows.recordsets[0][i].active,
                    "variation": variation.recordsets[0]
                }
                data.push(datasub);
            }
            resultJson = {
                "code": rows.recordsets[1][0].code,
                "msg": rows.recordsets[1][0].msg,
                "page_num": rows.recordsets[1][0].pagenum,
                "rec_num": rows.recordsets[1][0].recnum,
                "result": result,
                "data": data


            }

            return resultJson
        } catch (err) {
            console.log(err);
        }
    }
	
	async getvariation(req){
		          let columnName = ''
            let arrcolumnName
			let columnData = ''
            let arrcolumnData
		let result = []
			
		 const variation= await  connectmssql.then((pool) => {
                        return pool.request() 
                        .input('jsonIN',JSON.stringify(req.body))
                        .output('msgout')
                        .execute(`${pathdev.parsed.database}.civr.sp_getconcept_variation`)
                    })
					
					columnName = variation.recordsets[1][0].columnName
            arrcolumnName = columnName.split(',')
			columnData = variation.recordsets[1][0].columnData
            arrcolumnData=columnData.split(',')
			
			for (let i = 0; i < arrcolumnName.length; i++) {
                let data = {
                    'column_name': arrcolumnName[i],
                    'column_data': arrcolumnData[i]
                }
                result.push(data)
            }
					let resultJson = {
                "code": variation.recordsets[1][0].result,
                "msg": variation.recordsets[1][0].msg,
				"result":result,
                "page_num": variation.recordsets[1][0].page_num,
                "rec_num": variation.recordsets[1][0].rec_num,
                "data": variation.recordsets[0]

            }
			return resultJson
		
	}

        async addupdatedeleteconcepts(req){
            try{
				const rows= await  connectmssql.then((pool) => {
                        return pool.request() 
                        .input('jsonIN',JSON.stringify(req.body))
                        .output('resultOut')
                        .execute(`${pathdev.parsed.database}.civr.sp_admin_concept`)
                    })
					
                let resultJson
                resultJson = {
                    "code": rows.recordsets[0][0].result,
                    "msg": rows.recordsets[0][0].msg,
                }
                return resultJson
            }catch(err){
                log.error("response Data addupdatedeleteconcepts:",err)
            }
        }

        async addupdatedeleteconceptsvariation(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "Operation Save Successfully",
                }
                return resultJson
            }catch(err){
                log.error("response Data addupdatedeleteconceptsvariation:",err)
            }

        }

        async getprefixs(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{"data":{"prefix_id":"1","prefix_name":"Mr"}}
                }
                return resultJson
            }catch(err){
                log.error("response Data getprefixs:",err)
            }
        }

        async getcategory(req){
            try{
                // let arrcolumnName
                // let columnName = ''
                // let result = []
                // let column = []
                 const rows = await this.dbRepository.executeQuery("call sp_getcategory(?,@dt1)", [JSON.stringify(req.body)]);
                let resultJson
                // columnName = rows[1][0].columnName
                // arrcolumnName = columnName.split(',')
                // for (const [key, value] of Object.entries(rows[0][0])) {
                //     column.push(key)
    
                // }
                // for (let i = 0; i < arrcolumnName.length; i++) {
                //     let data = {
                //         'column_name': arrcolumnName[i],
                //         'column_data': column[i]
                //     }
                //     result.push(data)
                // }
                resultJson = {
                    "data":rows[0]
                }
                return resultJson
            }catch(err){
                log.error("response Data getcategory:",err)
            }
        }

        async addupdatedeletecategory(req){
            try{
                 const rows = await this.dbRepository.executeQuery("call sp_admin_category(?,@dt1)", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": rows[0][0].result,
                    "msg": rows[0][0].msg
                }
                return resultJson
            }catch(err){
                log.error("response Data addupdatedeletecategory:",err)
            }
        }
        async getsubcategory(req){
            try{
                let arrcolumnName
                let columnName = ''
                let result = []
                let column = []
                const rows = await this.dbRepository.executeQuery("call sp_getsubcategory(?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "data": rows[0]
                }
                return resultJson
            }catch(err){
                log.error("response Data getintentbycateid:",err)
            }
        }
        
        async getintentbycateid(req){
            try{
                let arrcolumnName
                let columnName = ''
                let result = []
                let column = []
                const rows = await this.dbRepository.executeQuery("call sp_getintentbycateID(?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                columnName = rows[1][0].columnName
                arrcolumnName = columnName.split(',')
                let subcolumnName=rows[1][0].subcolumnName
                let arrsubcolumnName=subcolumnName.split(',')

                for (let i = 0; i < arrcolumnName.length; i++) {
                    let data = {
                        'column_name': arrcolumnName[i],
                        'column_data': arrsubcolumnName[i]
                    }
                    result.push(data)
                }
                resultJson = {
                    "code": rows[1][0].result,
                    "msg": rows[1][0].msg,
                    "page_num": rows[1][0].page_num,
                    "rec_num": rows[1][0].rec_num,
                    "result": result,
                    "data": rows[0]
                }
                return resultJson
            }catch(err){
                log.error("response Data getintentbycateid:",err)
            }
        }

        async getsubintentbyintent(req){
            try{
                let arrcolumnName
                let columnName = ''
                let result = []
                let column = []
                const rows = await this.dbRepository.executeQuery("call sp_getsubintentbyintent(?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                columnName = rows[1][0].columnName
                let subcolumnName =rows[1][0].subcolumnName
                arrcolumnName = columnName.split(',')
                let arrsubcolumnName=subcolumnName.split(',')
                for (let i = 0; i < arrcolumnName.length; i++) {
                    let data = {
                        'column_name': arrcolumnName[i],
                        'column_data': arrsubcolumnName[i]
                    }
                    result.push(data)
                }
                resultJson = {
                    "code": rows[1][0].result,
                    "msg": rows[1][0].msg,
                    "page_num": rows[1][0].page_num,
                    "rec_num": rows[1][0].rec_num,
                    "result": result,
                    "data": rows[0]
                }
                return resultJson
            }catch(err){
                log.error("response Data getsubintentbyintent:",err)
            }
        }

        async addupdatedeleteintent(req){
            try{
               const rows =await this.dbRepository.executeQuery("call sp_admin_intent(?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": rows[0][0].result,
                    "msg": rows[0][0].msg
                }
                return resultJson
            }catch(err){
                log.error("response Data addupdatedeleteintent:",err)
            }
        }


        async updateallcontent(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "Operation Save Successfully"
                }
                return resultJson
            }catch(err){
                log.error("response Data updateallcontent:",err)
            }
        }

        async updateintentsentence(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "Operation Save Successfully"
                }
                return resultJson
            }catch(err){
                log.error("response Data updateintentsentence:",err)
            }
        }

        async getsentencebyintent(req){
            try{
                 let arrcolumnName
                let columnName = ''
                let result = []
                let column = []
                const rows = await this.dbRepository.executeQuery("call sp_getsentencebyintent (?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                columnName = rows[1][0].columnName
                let subcolumnName =rows[1][0].subcolumnName
                arrcolumnName = columnName.split(',')
                let arrsubcolumnName=subcolumnName.split(',')
                for (let i = 0; i < arrcolumnName.length; i++) {
                    let data = {
                        'column_name': arrcolumnName[i],
                        'column_data': arrsubcolumnName[i]
                    }
                    result.push(data)
                }
                resultJson = {
                    "code": rows[1][0].result,
                    "msg": rows[1][0].msg,
                    "page_num": rows[1][0].page_num,
                    "rec_num": rows[1][0].rec_num,
                    "result": result,
                    "data": rows[0]
                }
                return resultJson
            }catch(err){
                log.error("response Data getsentencebyintent:",err)
            }
        }

        
        async getsentencebysubintent(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{"header":[{

                        "column_name" : "Sentence Origin",
                        "column_field" : "sentence_text_origin",
                        "column_type" : "text",
                        "column_align" : "left"
                      },{
                       "column_name" : "Sentence Process",
                       "column_field" : "sentence_text_process",
                       "column_type" : "text",
                       "column_align" : "left"
                     },{
                       "column_name" : "Type",
                       "column_field" : "sentence_type",
                       "column_type" : "text",
                       "column_align" : "left"
             
                    },{
                       "column_name" : "Active",
                       "column_field" : "active",
                       "column_type" : "checkbox",
                       "column_align" : "center"
                    }]},
             
                    "data":[{
                        "sentence_id" : "1",
                        "sentence_type" : "Voice",
                        "intent_id": "1",
                        "sub_intent_id": "",
                        "sentence_text_origin" : "เช็คยอดบัตรเครดิต",
                        "sentence_text_process" : "เช็ค ยอด บัตรเครดิต",
                        "count" : "1",
                        "active" : "1",
          
                          }]
                }
                return resultJson
            }catch(err){
                log.error("response Data getsentencebysubintent:",err)
            }
        }

        async searchsentence(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{"header":[{

                        "column_name" : "Sentence Origin",
                        "column_field" : "sentence_text_origin",
                        "column_type" : "text",
                        "column_align" : "left"
                      },{
                       "column_name" : "Sentence Process",
                       "column_field" : "sentence_text_process",
                       "column_type" : "text",
                       "column_align" : "left"
                     },{
                       "column_name" : "Type",
                       "column_field" : "sentence_type",
                       "column_type" : "text",
                       "column_align" : "left"
             
                    },{
                       "column_name" : "Active",
                       "column_field" : "active",
                       "column_type" : "checkbox",
                       "column_align" : "center"
                    }]},
             
                    "data":[{
                        "sentence_id" : "1",
                        "sentence_type" : "Voice",
                        "intent_id": "1",
                        "sub_intent_id": "",
                        "sentence_text_origin" : "เช็คยอดบัตรเครดิต",
                        "sentence_text_process" : "เช็ค ยอด บัตรเครดิต",
                        "count" : "1",
                        "active" : "1",
          
                          }]
                }
                return resultJson
            }catch(err){
                log.error("response Data searchsentence:",err)
            }
        }

        async processsentence(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{"data":{"sentence_text1" : "ตรวจ",
                                      "sentence_text2":"สอบ",
                                      "sentence_text3":"บัตรเครดิต"}}
                }
                return resultJson
            }catch(err){
                log.error("response Data processsentence:",err)
            }
        }

        async addupdatedeleteSentence(req){
            try{
                 const rows = await this.dbRepository.executeQuery("call sp_admin_sentence(?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": rows[0][0].result,
                    "msg": rows[0][0].msg
                }
                return resultJson
            }catch(err){
                log.error("response Data addupdatedeleteSentence:",err)
            }
        }

        async uploadsentence(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "Operation Save Successfully"
                }
                return resultJson
            }catch(err){
                log.error("response Data uploadsentence:",err)
            }
        }

        async moveSentence(req){
            try{
                 const rows = await this.dbRepository.executeQuery("call sp_moveintent(?,@dt1);", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": rows[0][0].result,
                    "msg": rows[0][0].msg
                }
                return resultJson
            }catch(err){
                log.error("response Data moveSentence:",err)
            }
        }
        async updateIntentActiveStatus(req){
            try{
                 const rows = await this.dbRepository.executeQuery("call sp_updateintentactive(?,@dt1); ", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": rows[0][0].result,
                    "msg": rows[0][0].msg
                }
                return resultJson
            }catch(err){
                log.error("response Data moveSentence:",err)
            }
        }

        async updateSentenceActiveStatus(req){
            try{
                 const rows = await this.dbRepository.executeQuery("call sp_updatesentenceactive(?,@dt1);  ", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": rows[0][0].result,
                    "msg": rows[0][0].msg
                }
                return resultJson
            }catch(err){
                log.error("response Data moveSentence:",err)
            }
        }
        
        async testgrammar(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{"test_results":[{
                        "test_file_name" : "xxxx.wav",
                        "test_text" : "",
                        "value" : "TAG-CREDIT_CARD_CHECK_BALANCE"
                    },
                    {
                        "test_file_name": "xxxx2.wav",
                        "test_text":"",
                        "value": "TAG-XXXX " 

                    }]}
                }
                return resultJson
            }catch(err){
                log.error("response Data testgrammar:",err)
            }
        }

        async getprefixconcepts(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{
                        "header":[{
                            "column_name" : "Concept Name",
                            "column_field" : "concept_name",
                            "column_type" : "text",
                            "column_align" : "left"
                          },{
                           "column_name": "Type",
                           "column_field": "type",
                           "column_type": "text",
                           "column_align": "left",
                         },{
                           "column_name": "Active",
                           "column_field": "active",
                           "column_type": "checkbox",
                           "column_align": "center",
                         }],
                        "sub_header" : [{
                           "column_name": "Concept Result",
                           "column_field": "concept_result",
                           "column_type": "text",
                           "column_align": "left",
                        },{
                           "column_name": "Variation",
                           "column_field": "variation_text",
                           "column_type": "text",
                           "column_align": "left",
                        },{
                           "column_name": "Active",
                           "column_field": "active",
                           "column_type": "checkbox",
                           "column_align": "center",
                        }],
                    },
                    "data":[{
                        "concept_id" : "1",
                        "concept_name" : "PREMIER_INFO" ,
                        "type": "1",
                        "active": "1",
                        "variation": [{
                              "variation_id" : "1",
                              "concept_result" : "PREMIER_CARD",
                              "variation_text" : "บัตรเครดิตพรีเมี่ยม",
                              "active" : "1"
                       }]
                  }]
                }
                return resultJson
            }catch(err){
                log.error("response Data getprefixconcepts:",err)
            }
        }

        async getsuffixconcepts(req){
            try{
                // const rows = await this.dbRepository.executeQuery("", [JSON.stringify(req.body)]);
                let resultJson
                resultJson = {
                    "code": "200",
                    "msg": "success",
                    "result":{
                        "header":[{
                            "column_name" : "Concept Name",
                            "column_field" : "concept_name",
                            "column_type" : "text",
                            "column_align" : "left"
                          },{
                           "column_name": "Type",
                           "column_field": "type",
                           "column_type": "text",
                           "column_align": "left",
                         },{
                           "column_name": "Active",
                           "column_field": "active",
                           "column_type": "checkbox",
                           "column_align": "center",
                         }],
                        "sub_header" : [{
                           "column_name": "Concept Result",
                           "column_field": "concept_result",
                           "column_type": "text",
                           "column_align": "left",
                        },{
                           "column_name": "Variation",
                           "column_field": "variation_text",
                           "column_type": "text",
                           "column_align": "left",
                        },{
                           "column_name": "Active",
                           "column_field": "active",
                           "column_type": "checkbox",
                           "column_align": "center",
                        }],
                    },
                    "data":[{
                        "concept_id" : "1",
                        "concept_name" : "PREMIER_INFO" ,
                        "type": "1",
                        "active": "1",
                        "variation": [{
                              "variation_id" : "1",
                              "concept_result" : "PREMIER_CARD",
                              "variation_text" : "บัตรเครดิตพรีเมี่ยม",
                              "active" : "1"
                       }]
                  }]
                }
                return resultJson
            }catch(err){
                log.error("response Data getsuffixconcepts:",err)
            }
        }


}

const loginService = new LoginService();
module.exports = loginService;








