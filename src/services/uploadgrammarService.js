const {exec} = require("child_process");
let SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const process = require('process');
const axios = require('axios');
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const connectmssql=require('../MssqlDatabase')

class UploadgrammarService {
    async UploadgrammarService(req) {
        if (req.menu_action == "addgrammar" || req.menu_action == "deletegrammar") {
            const adddata = await this.adddeletegrammar(req);
            return adddata
        } else if (req.menu_action == "getdatagrammar") {
            const uploadgrammar = await this.getdatagrammar(req);
            return uploadgrammar
        }
    }

    async deploy(req){
        if(req.menu_action == "getdatadeploy"){
           const getdata =await this.getgrammardeploy(req)
           return getdata;
        }else if(req.menu_action == "adddatadeploy"){
            const getdata =await this.adddatadeploy(req)
           return getdata;
        }else if(req.menu_action == "submitdatadeploy"){
            const getdata =await this.sumbitatadeploy(req)
           return getdata;
        }else if(req.menu_action == "deployactive"){
            const getdata =await this.deployactive(req)
           return getdata;
        }

    }
	async downloadresult(req){
		try{
		const result=await this.DBRepository.executeQuery("select url_patch,result_name  from tbl_upload_grammar  where result_name='"+req.filename+"'");
		console.log(result)
			return result;
		}catch(err){
			console.log(err)
		}
	}
	 async updategrammarresult(req){
		try{
        const result=await this.DBRepository.executeQuery("update tbl_upload_grammar set url_patch='"+req.path+"',message_error='build success',status=6,result_name='"+req.filename+"' where build_version ='"+req.build_id+"'");
            console.log(result)
            let resultJson
            if(result.affectedRows){
                resultJson = {
                    "code": "200",
                    "msg": "success result",
                }
                return resultJson
            }
		}catch(err){
			console.log(err)
		}
	}
	
	 async uploadvoicelog(req) {
        try {
            let result= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute(`${pathdev.parsed.database}.civr.sp_update_voice_analytic`)
            })
            console.log(result.recordsets[0][0])
             return result.recordsets[0][0]          
        } catch (err) {
            console.log(err)
        }
    }


    async adddeletegrammar(req) {
        try {
            const adddeletegrammar = await this.DBRepository.executeQuery("call sp_grammar(?,@result,@msg);SELECT @result as result;SELECT @msg as msg", [JSON.stringify(req)]);
            let resultJson
            console.log(adddeletegrammar)
            resultJson = {
                "code": adddeletegrammar[1][0].result,
                "msg": adddeletegrammar[2][0].msg,
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }
    }


    async deploygrammar(req) {
        try {
            const deploygrammar = await this.DBRepository.executeQuery("call sp_grammar(?,@result,@msg);SELECT @result as result;SELECT @msg as msg", [JSON.stringify(req)]);
            let resultJson
            resultJson = {
                "code": deploygrammar[1][0].result,
                "msg": deploygrammar[2][0].msg,
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }
    }


    async getdatagrammar(req) {
        try {
            let data = []
            const getdatagrammar = await this.DBRepository.executeQuery("call sp_getdata_grammar(?,@result,@msg);SELECT @result as result;SELECT @msg as msg", [JSON.stringify(req)]);
            console.log(getdatagrammar)
            let resultJson
            for (let i = 0; i < getdatagrammar[0].length; i++) {
                const item = {
                    "project_id": getdatagrammar[0][i].project_id,
					"project_name":getdatagrammar[0][i].project_name,
                    "date_time": getdatagrammar[0][i].date_time,
                    "file_name": getdatagrammar[0][i].file_name,
                    "file_desc": getdatagrammar[0][i].file_desc,
                    "status": getdatagrammar[0][i].status,
                    "update_by": getdatagrammar[0][i].upload_by,
                    "process_by": getdatagrammar[0][i].process_by,
                    "process_date": getdatagrammar[0][i].process_date,
                    "build_by": getdatagrammar[0][i].build_by,
                    "build_date": getdatagrammar[0][i].build_date,
                    "build_version": getdatagrammar[0][i].build_version,
                    "build_desc": getdatagrammar[0][i].build_desc,
                    "message_error": getdatagrammar[0][i].message_error,
					"result_name":getdatagrammar[0][i].result_name
                }
                data.push(item)
            }


            resultJson = {
                "code": getdatagrammar[2][0].result,
                "msg": getdatagrammar[3][0].result,
                "recnums": "1",
                "pagenum": "25",
                "result": {
                    "header": [{
                            "column_name": "PROJECT",
                            "column_field": "project_id",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "DATE_TIME",
                            "column_field": "date_time",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "FILENAME",
                            "column_field": "file_name",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "FILE DESC",
                            "column_field": "file_desc",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "STATUS",
                            "column_field": "status",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "UPDATE_BY",
                            "column_field": "update_by",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "PROCESS_BY",
                            "column_field": "process_by",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "PROCESS_DATE",
                            "column_field": "process_date",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "BUILD_BY",
                            "column_field": "build_by",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "BUILD_DATE_TIME",
                            "column_field": "build_date",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "BUILD VERSION",
                            "column_field": "build_version",
                            "column_type": "text",
                            "column_align": "left"
                        },
                        {
                            "column_name": "BUILD DESC",
                            "column_field": "build_desc",
                            "column_type": "text",
                            "column_align": "left"
                        }
                    ]
                },
                "data": data
            }
            return resultJson
        } catch (err) {
        console.log(err)
        }
    }

    async uploadGrammar(body_upload) {
        try {
            try {
                const insert = await this.DBRepository.executeQuery("call sp_upload_gramma(?,@result);SELECT @result as result", [body_upload])
                console.log(insert)

                return insert;

            } catch (err) {
                return err
            }


        } catch (err) {
            return
        }

    }

    async processFile(req) {

        try {
            var x
            var mysheet
            const excelToJson = require('convert-excel-to-json');
            var path = require('path');
            var filePath = path.resolve('./uploadgrammar/' + req.body.file_name);
            const result = excelToJson({
                sourceFile: filePath
            });
            for (x in result) {
                mysheet = x
                break
            }
            var colA
            var colB
            var colC
            var colD
            var intentID
            intentID = 0
            var ids
            ids = 0
            let intentTAG = [];
            let intentTAG2 = [];
            let sentence = [];
            

            for (let i = 1; i <= result[mysheet].length; i++) {
                if (result[mysheet][i] !== undefined) {
                    // Itent
                    colA = result[mysheet][i].D
                    colA = colA.replace(/(\r\n|\n|\r)/gm, "");

                    colB = result[mysheet][i].A
                    colB = colB.replace(/(\r\n|\n|\r)/gm, "");

                    colC = result[mysheet][i].B
                    colC = colC.replace(/(\r\n|\n|\r)/gm, "");

                    colD = result[mysheet][i].C
                    colD = colD.replace(/(\r\n|\n|\r)/gm, "");

                    // Array Intent
                    if (intentTAG.length < 1) { // First Intent
                        intentID = intentID + 1;

                       

                        const item = [req.body.project_id, intentID, 0, colD, req.body.user_login]
                        intentTAG.push(item)




                        const entity = [];
                        const itemEntity = {
                            "entity_a": colB,
                            "entity_b": colC,
                            "entity_c": colB + colC
                        }
                        entity.push(itemEntity)
                        const item2 = {
                            "id": intentID,
                            "intent": colD,
                            "entity": entity,
                            "entity_c": colB + colC
                        }
                        intentTAG2.push(item2)
                    } else {
                        // Get duplicate intent in Excel file
                        let found
                        let getIntentID1 
                        for (let i2 = 0; i2 < intentTAG.length; i2++) {
                            found = intentTAG[i2].find(element => element === colD);
                            getIntentID1 = i2
                            if (found) {
                                break;
                            }
                        }
                        // Add new intent to array

                        if (!found) {
                            intentID = intentID + 1;
                            const item = [req.body.project_id, intentID, 0, colD, req.body.user_login]
                            intentTAG.push(item)
                            const entity = [];
                            const itemEntity = {
                                "entity_a": colB,
                                "entity_b": colC,
                                "entity_c": colB + colC
                            }
                            entity.push(itemEntity)
                            const item2 = {
                                "id": intentID,
                                "intent": colD,
                                "entity": entity,
                                "entity_c": colB + colC
                            }
                            intentTAG2.push(item2)
                        } else { // Same in Itent in Excel file 
                            // var foundA = intentTAG2[(intentID - 1)].entity.filter(intent => intent.entity_a === colB);
                            //  var foundB = intentTAG2[(intentID - 1)].entity.filter(intent => intent.entity_b === colC);
                          
                            var foundC = intentTAG2[getIntentID1].entity.filter(intent => intent.entity_c === (colB + colC));
                            //    if (foundA.length == 0 || foundB.length == 0) {
                            if (foundC.length == 0) {
                                var itemEntity = {
                                    "entity_a": colB,
                                    "entity_b": colC,
                                    "entity_c": colB + colC
                                }
                                intentTAG2[getIntentID1].entity.push(itemEntity)
                               // intentTAG2[(intentID - 1)].entity.push(itemEntity)

                            }

                        }
                    }
                    // Sentence get initen from Array first
                    ids = ids + 1
                    let found4
                    let getIntentID 
                    for (let i4 = 0; i4 < intentTAG.length; i4++) {
                        found4 = intentTAG[i4].find(element => element === colD);
                        if (found4) {
                            getIntentID = intentTAG[i4][1]
                            break;
                        }
                    } 
                    const item = [req.body.project_id, ids, getIntentID, colA, colA, colB, colC, req.body.user_login]
                    sentence.push(item)
                }
            }

            let rows
            var SQL = " Delete from  tbl_intent where project_id =  " + req.body.project_id
            rows = await this.DBRepository.executeQuery(SQL);
            rows = await this.DBRepository.executeQuery("insert into tbl_intent (project_id,intent_id,category_id,intent_tag,create_by)  VALUES ? ", [intentTAG]);
            //  console.log(rows)
            var SQL = " Delete from  tbl_sentence where project_id =  " + req.body.project_id
            rows = await this.DBRepository.executeQuery(SQL);

            rows = await this.DBRepository.executeQuery("insert into tbl_sentence (project_id,sentence_id,intent_id,sentence_text_origin,sentence_text_process,entity_a,entity_b,create_by)  VALUES ? ", [sentence]);
            //  console.log(rows)
            this.DBRepository.executeQuery("update  tbl_upload_grammar set process_by='" + req.body.user_login + "',process_date=current_timestamp(),message_error='process success' where project_id=" + req.body.project_id + " and file_name = '"+req.body.file_name+ "'");

            var jsonResult = {
                "project_id": req.body.project_id,
                "user_login": req.body.user_login,
                "file_name": req.body.file_name,
                "status": req.body.status,
                "intent": intentTAG2
            }

            rows = await this.DBRepository.executeQuery("call sp_process_file2(?,@result)", [JSON.stringify(jsonResult)])

            var result1 = {
                "code": rows[0][0].code,
                "msg": rows[0][0].msg,
                "Intent": rows[0][0].Intent,
                "Entity": rows[0][0].Entity,
                "Sentence": rows[0][0].Sentence
            }
            //  console.log(result1)
            return result1;

        } catch (err) {
            console.log(err);
        }

    }

    async buildGrammar(req) {
        try {
            try {


                var d = new Date();
                var date_format_str = d.getFullYear() +
                    ("0" + (d.getMonth() + 1)).slice(-2) +
                    ("0" + d.getDate()).slice(-2) +
                    ("0" + d.getHours()).slice(-2) +
                    ("0" + d.getMinutes()).slice(-2) +
                    ("0" + d.getSeconds()).slice(-2)

                console.log(date_format_str);
                // return 

                // Process word from sentence 
                const rows = await this.DBRepository.executeQuery("call sp_load_sentence(?)", [req.body.project_id])
                console.log(rows[0].length)
                var prjName = rows[1][0].project_name
                var vocab = []
                var xmlItem = ""
                var xmlWord = ""
                var xmlSentence = ""
                var xmlSentenceSSM = ""
                var xmlEntity = ""

                // for wordlist
                var vocab2 = []
                var wordSentence = []
                var word
                var mytag = {}
                var myword = {}
                var j
                if (rows[0][0]) {
                   var  sIntent = rows[0][0].intent_tag
                }   
               // ---------------


                for (var i = 0; i < rows[0].length; i++) {
                    var line = rows[0][i].sentence_text_process
                    var arr = line.split(" ");
                    for (var i2 = 0; i2 < arr.length; i2++) {
                        var word = arr[i2]
                        if (word !== "") {
                            var foundWord = vocab.filter(vocab => vocab.item === word);
                            if (foundWord.length == 0) {
                                const item = {
                                    "item": word
                                }
                                vocab.push(item)
                                if (xmlItem === "") {
                                    xmlItem = '<item>' + word + '</item>'
                                    xmlWord = '<word>' + word + '</word>'

                                } else {
                                    xmlItem = xmlItem + '\r\n' + '<item>' + word + '</item>'
                                    xmlWord = xmlWord + '\r\n' + '<word>' + word + '</word>'
                                }
                            }
                            // for wordlist
                            var foundWord2 = vocab2.filter(vocab2 => vocab2.item === word);
                            if (foundWord2.length == 0) {
                                myword[word] = 1
                                const item = {
                                    "item": word
                                }
                                vocab2.push(item)
                            } else {
                                j = myword[word]
                                myword[word] = j + 1
                            }
                            //--------------
                        }
                    }
                    // For wordlist
                    if (sIntent != rows[0][i].intent_tag) {
                        wordSentence.push(myword)
                        mytag[sIntent] = wordSentence
                        sIntent = rows[0][i].intent_tag
                        wordSentence = []
                        myword = {}
                        vocab2 = []
                    }
                    if (i == (rows[0].length - 1)) {
                        wordSentence.push(myword)
                        mytag[sIntent] = wordSentence
                    }
                 
                    // -----------------------
                    if (xmlItem === "") {
                        xmlSentence = '<sentence count="1">' + rows[0][i].sentence_text_process + '</sentence>'
                    } else {
                        xmlSentence = xmlSentence + '\r\n' + '<sentence count="1">' + rows[0][i].sentence_text_process + '</sentence>'
                    }

                    if (xmlSentenceSSM === "") {
                        xmlSentenceSSM = '<sentence count="1"><semantics><slot name="ENTITY_A">' + rows[0][i].entity_a +
                            '</slot><slot name="ENTITY_B">' + rows[0][i].entity_b + '</slot><slot name="INTENTION">' + rows[0][i].intent_tag + '</slot></semantics>' +
                            rows[0][i].sentence_text_process + '</sentence>'

                    } else {
                        xmlSentenceSSM = xmlSentenceSSM + '\r\n' + '<sentence count="1"><semantics><slot name="ENTITY_A">' + rows[0][i].entity_a +
                            '</slot><slot name="ENTITY_B">' + rows[0][i].entity_b + '</slot><slot name="INTENTION">' + rows[0][i].intent_tag + '</slot></semantics>' +
                            rows[0][i].sentence_text_process + '</sentence>'
                    }
                }
              //  console.log(mytag)

                const rows2 = await this.DBRepository.executeQuery("call sp_load_entity(?)", [req.body.project_id])

                for (var i = 0; i < rows2[0].length; i++) {
                    if (xmlEntity === "") {
                        xmlEntity = '<meaning><slot name="ENTITY_A">' + rows2[0][i].entity_a + '</slot><slot name="ENTITY_B">' + rows2[0][i].entity_b + '</slot><slot name="INTENTION">' +
                            rows2[0][i].intent_tag + '</slot></meaning>'
                    } else {
                        xmlEntity = xmlEntity + '\r\n' + '<meaning><slot name="ENTITY_A">' + rows2[0][i].entity_a + '</slot><slot name="ENTITY_B">' + rows2[0][i].entity_b + '</slot><slot name="INTENTION">' +
                            rows2[0][i].intent_tag + '</slot></meaning>'
                    }
                }

                // Begin write SLM File ->
                // Path: /Project_Name/Build_ID/GRAMMAR/PREPROD 
                // Get build ID 
				 var build_result = {
                    "project_id": req.body.project_id,
                    "build_desc": req.body.build_desc,
                    "build_by": req.body.user_login,
                    "file_name": req.body.file_name,
                    "build_date": date_format_str,
                    "message_error": "build process"
                }
            
             const data =  await this.DBRepository.executeQuery("call sp_update_build_grammar(?,@result)", [JSON.stringify(build_result)])
            
             console.log(data[1][0].version);
                var filessystem = require('fs');
                var fs = require("fs")
                var buildVersion   = ''
                var fsm_out = prjName + '-slm.fsm'
                var wordlist_out = prjName + '-slm.wordlist'
                var slmName = prjName + '-slm.xml'
                var ssmName = prjName + '-ssm.xml'
                var ssmName2 = prjName + '-ssm'
                var mainMenu = prjName + '-'+pathdev.parsed.namegram+'.xml'
                var wordlist = prjName +pathdev.parsed.namejson+'.json'

                var builddir = './buildgrammar/';
                buildVersion = data[1][0].version

                if (!filessystem.existsSync(builddir)) {
                    filessystem.mkdirSync(builddir);
                }

                var dir = './buildgrammar/' + prjName + '/';
                // var dir = './buildgrammar/'
                if (!filessystem.existsSync(dir)) {
                    filessystem.mkdirSync(dir);
                }
                var dirpre = './buildgrammar/' + prjName + '/pre/';
                if (!filessystem.existsSync(dirpre)) {
                    filessystem.mkdirSync(dirpre);
                }


                let dirvernamepre = `${dirpre}${data[1][0].version}/`;
                if (!filessystem.existsSync(dirvernamepre)) {
                    filessystem.mkdirSync(dirvernamepre);
                }

				exec(`cp ./master/SpeakFreelyConfig.dtd  ${dirvernamepre}`)
				process.chdir(`${dirvernamepre}`);
				
                var xmlSLM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
				    '<!DOCTYPE SpeakFreelyConfig SYSTEM "SpeakFreelyConfig.dtd">'+ '\r\n' +
                    '<SLMTraining version="1.0.0" xml:lang="th-th">' + '\r\n' +
                    '<param name="ngram_order"> <value> 3 </value></param>' + '\r\n' +
                    '<param name="cutoffs"><value> 0 1 </value></param>' + '\r\n' +
                    '<param name="smooth_weights"><value>0.1 0.9 0.9 0.4</value></param>' + '\r\n' +
                    '<param name="smooth_alg"><value>GT-discw-int</value></param>' + '\r\n' +
                    '<param name="fsm_out"><value>' + fsm_out + '</value></param>' + '\r\n' +
                    '<param name="wordlist_out"><value>' + wordlist_out + '</value></param>' + '\r\n' +
                    '<vocab>' + '\r\n' +
                    xmlItem + '\r\n' +
                    '</vocab>' + '\r\n' +
                    '<training>' + '\r\n' +
                    xmlSentence + '\r\n' +
                    '</training>' + '\r\n' +
                    '</SLMTraining>'



                // Begin wrie SMM file ->
                var xmlSMM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
				    '<!DOCTYPE SpeakFreelyConfig SYSTEM "SpeakFreelyConfig.dtd">'+ '\r\n' +
                    '<SSMTraining version="1.0.0" xml:lang="th-th" tag-format="swi-semantics/1.0"> ' + '\r\n' +
                    '<features>' + '\r\n' +
                    xmlWord + '\r\n' +
                    '</features>' + '\r\n' +
                    '<semantic_models>' + '\r\n' +
                    '<SSM>' + '\r\n' +
                    '<param name="num_iterations">' + '\r\n' +
                    '   <value>0</value>' + '\r\n' +
                    '</param>' + '\r\n' +
                    '<param name="ssm_output_filename">' + '\r\n' +
                    '   <value>' + ssmName2 + '</value>' + '\r\n' +
                    '</param>' + '\r\n' +
                    xmlEntity + '\r\n' +
                    '</SSM>' + '\r\n' +
                    '</semantic_models>' + '\r\n' +
                    '<training>' + '\r\n' +
                    xmlSentenceSSM + '\r\n' +
                    '</training>' + '\r\n' +
                    '</SSMTraining>'



                var xmlMainmenu = '<?xml version="1.0" encoding="UTF-8"?> ' + '\r\n' +
                    '<grammar xml:lang="th-TH" version="1.0" ' + '\r\n' +
                    'xmlns="http://www.w3.org/2001/06/grammar"' + '\r\n' +
                    'mode="voice" root="commands">' + '\r\n' +
                    '<!-- <meta name="swirec_fsm_parser" content="NULL"/> -->' + '\r\n' +
                    '<meta name="swirec_fsm_grammar" content="' + fsm_out + '"/>' + '\r\n' +
                    '<meta name="swirec_fsm_wordlist" content="' + wordlist_out + '"/>' + '\r\n' +
                    '<semantic_interpretation xmlns="http://www.nuance.com/semantics" priority="1">' + '\r\n' +
                    '<component confidence_threshold="0.00">' + '\r\n' +
                    '<interpreter uri="' + ssmName2 + '.ssm' + '" type="application/x-vnd.nuance.ssm"/>' + '\r\n' +
                    '</component>' + '\r\n' +
                    '<tag>BUILD=' + "'" + buildVersion  + "';" +'</tag>' + '\r\n' +
                    '</semantic_interpretation>' + '\r\n' +
                    '<rule id="commands">' + '\r\n' +
                    '   commands' + '\r\n' +
                    '</rule>' + '\r\n' +
                    '</grammar>' 
                   

               
		
                fs.writeFile(slmName, xmlSLM, 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully slmName xml to file version:pre");
                });
                fs.writeFile(slmName, xmlSLM, 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully slmName xml to file version:pro");
                });
                fs.writeFile(ssmName, xmlSMM, 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully ssmName xml to file version:pre");
                });
                fs.writeFile(ssmName, xmlSMM, 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully ssmName xml to file version:pro");
                });
                fs.writeFile(mainMenu, xmlMainmenu, 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully mainMenu xml to file version:pre");
                });
                fs.writeFile(mainMenu, xmlMainmenu, 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully mainMenu xml to file version:pro");
                });
				// For wordlist
                fs.writeFile(wordlist, JSON.stringify(mytag, null, 2), 'utf8', function (err, data) {
                    if (err) console.log(err);
                    console.log("successfully wordlist file");
                });
                // --------------
                            //pre
                exec("ssm_train " + ssmName + " ", (error, stdout, stderr) => {

                    if (error) {
						process.chdir(`${pathdev.parsed.baseHome}`);
                        console.log(`error compile ssmName: ${error.message}`);
						this.DBRepository.executeQuery("update tbl_upload_grammar set message_error='compile fail ssmName' where build_version ='"+data[1][0].version+"'");
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr compile ssmName: ${stderr}`);
                        return;
                    }

                    console.log(`stdout compile ssmName: ${stdout}`);
                    let found = stdout.indexOf(" SWI_SUCCESS| success|")
                    console.log("found ", found)
                    if (found > 0) {
                        exec("sgc -train " + slmName + "  -no_gram", (error, stdout, stderr) => {
                            if (error) {
								process.chdir(`${pathdev.parsed.baseHome}`);
                                console.log(`error compile slmName: ${error.message}`);
								this.DBRepository.executeQuery("update tbl_upload_grammar set message_error='compile fail slmName' where build_version ='"+data[1][0].version+"'");
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr compile slmName: ${stderr}`);
                                return;
                            }
                            console.log(`stdout compile slmName: ${stdout}`);
                            let found1 = stdout.indexOf("sgc: Total compilation errors: 0")
                            console.log("found1 ", found1)
                            if (found1 > 0) {
                                exec("sgc " + mainMenu + "", (error, stdout, stderr) => {
                                    if (error) {
										process.chdir(`${pathdev.parsed.baseHome}`);
                                        console.log(`error compile mainMenu: ${error.message}`);
										this.DBRepository.executeQuery("update tbl_upload_grammar set message_error='compile fail mainMenu' where build_version ='"+data[1][0].version+"'");
                                        return;
                                    }
                                    if (stderr) {
                                        console.log(`stderr compile mainMenu: ${stderr}`);
                                        return;
                                    }
                                    console.log(`stdout compile mainMenu: ${stdout}`);
									
                                    let found2 = stdout.indexOf("sgc: Total compilation errors: 0")
                                    console.log("found2 ", found2)
                                    if (found2 > 0) {
						console.log("data from database:",data[1][0].version);
                                        let params = {
                                            "build_id": data[1][0].version,
                                            "grammar": pathdev.parsed.baseHome + dirvernamepre.replace('.', '') + prjName + '-'+pathdev.parsed.namegram+'.gram',
                                            "excel_file": pathdev.parsed.baseHome+"/uploadgrammar/" + req.body.file_name,
											"wordlist_file":pathdev.parsed.baseHome + dirvernamepre.replace('.', '') + prjName+pathdev.parsed.namejson+'.json'
                                        }
                                        axios.post('http://10.10.10.104:9010/api/recog', params)
                                            .then(res => {
                                                console.log("success")
												this.DBRepository.executeQuery("update tbl_upload_grammar set message_error='test  Process' where build_version ='"+data[1][0].version+"'");
												process.chdir(`${pathdev.parsed.baseHome}`);
                                            })
                                            .catch(err => {
												process.chdir(`${pathdev.parsed.baseHome}`);
                                                console.error("error port" + err);
                                            })
                this.DBRepository.executeQuery("update tbl_upload_grammar set full_patch='"+dirvernamepre.replace('.', '') + prjName + '-'+pathdev.parsed.namegram+'.gram'+"' where build_version ='"+params.build_id+"'");
                                    }
                                });
                            }

                        });
                    }
                });


                
                var result1 = {
                    "code": 200,
                    "msg": "build success"


                }
                console.log(result1)
                return result1




            } catch (err) {
                console.log(err)
            }


        } catch (err) {
            console.log(err)
        }

    }
	
	async getgrammardeploy(req) {
        try {
            let data =[]
             const rows = await this.DBRepository.executeQuery("call sp_get_grammar_deploy(?,@dt1); ", [JSON.stringify(req)]);
             console.log(rows)
                for(let [key,value] of rows[0].entries()){
                    data.push(value)
                }
            let resultJson
            resultJson = {
                "code": rows[1][0].result,
                "msg": rows[1][0].msg,
                "result": {
                    "header": [{
                        "column_name": "build version",
                        "column_field": "build_version",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "create Date",
                        "column_field": "create_time",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "create by",
                        "column_field": "create_by",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "Description",
                        "column_field": "build_desc",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "Version",
                        "column_field": "deploy_version",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "Description Deploy",
                        "column_field": "deploy_desc",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "Active By",
                        "column_field": "active_by",
                        "column_type": "text",
                        "column_align": "left"
                    }],
                },
                "data": data
            }
            return resultJson
        } catch (err) {
            log.error("response Data getgrammardeploy:", err)
        }
    }


    async adddatadeploy(req){
        try {
            let data = []
            const rows=await this.DBRepository.executeQuery("call sp_get_grammar_build(?,@dt1);",JSON.stringify(req))
            console.log(rows)
            for(let [key,value] of rows[0].entries()){
                data.push(value)
            }
            let resultJson
            resultJson = {
                "code": rows[1][0].result,
                "msg": rows[1][0].msg,
                "recnum": rows[1][0].rec_num,
                "pagenum": rows[1][0].page_num,
                "result": {
                    "header": [{
                        "column_name": "project id",
                        "column_field": "project_id",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "build version",
                        "column_field": "build_version",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "build date",
                        "column_field": "build_date",
                        "column_type": "text",
                        "column_align": "left"
                    },{
                        "column_name": "build description",
                        "column_field": "build_desc",
                        "column_type": "text",
                        "column_align": "left"
                    }],
                    "data":data
                }
            }
            return resultJson
        }catch (err) {
            log.error("response Data adddatadeploy:",err)
        }
    }

    async sumbitatadeploy(req){
            try {
                const rows = await this.DBRepository.executeQuery("call sp_add_grammar_deploy(?,@dt1)",JSON.stringify(req))
                let resultJson
                resultJson = {
                    "result":rows[0][0].result,
                    "msg":rows[0][0].msg,
                }
                return resultJson
            } catch (error) {
                
            }
    }
    async deployactive(req){
        try {
            const rows = await this.DBRepository.executeQuery("call sp_update_grammar_deploy(?,@dt1)",JSON.stringify(req))
            let resultJson
            resultJson = {
                "result":rows[0][0].result,
                "msg":rows[0][0].msg,
            }
            
            let filessystem = require('fs');
            if(req.pro_active ==1|| req.pre_active ==1){
            let json1 = {
                "project_id": req.project_id,
                "build_version": req.build_version
              }
              const rows2 = await this.DBRepository.executeQuery("call sp_update_deploy_schedule (?,@rt)",JSON.stringify(json1))
                  var builddir = './deploygrammar/';
                  if (!filessystem.existsSync(builddir)) {
                    filessystem.mkdirSync(builddir);
                }
                let dirproject = './deploygrammar/'+rows2[0][0].project_name;
                if (!filessystem.existsSync(dirproject)) {
                    filessystem.mkdirSync(dirproject);
                }
                let dirpre = './deploygrammar/'+rows2[0][0].project_name+'/pre/';
            if (!filessystem.existsSync(dirpre)) {
                filessystem.mkdirSync(dirpre);
            }
            let dirpro = './deploygrammar/'+rows2[0][0].project_name+'/pro/';
            if (!filessystem.existsSync(dirpro)) {
                filessystem.mkdirSync(dirpro);
            }
    
            if(req.pre_active ==1){
                filessystem.copyFile('.'+rows2[0][0].full_patch, dirpro+rows2[0][0].project_name+"-"+pathdev.parsed.namegram+".gram", (err) => {  
                    if (err) throw err;  
                    console.log(' copy file pre success');  
        });
            }
            if(req.pro_active ==1){
            filessystem.copyFile('.'+rows2[0][0].full_patch, dirpro+rows2[0][0].project_name+"-"+pathdev.parsed.namegram+".gram", (err) => {  
            if (err) throw err;  
            console.log(' copy file pro success');  
}); 
            }
        }

           
            return resultJson
        
        } catch (error) {
            console.log(error)
        }
}
    
	
}
const uploadgrammarService = new UploadgrammarService;
module.exports = uploadgrammarService;