let SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'Logfile.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);
const process = require('process');
const axios = require('axios');
const pathdev = require('dotenv').config({ path: './config/dev.env' });
const connectmssql = require('../MssqlDatabase')
const sql = require('mssql')
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

    async deploy(req) {
        if (req.menu_action == "getdatadeploy") {
            const getdata = await this.getgrammardeploy(req)
            return getdata;
        } else if (req.menu_action == "adddatadeploy") {
            const getdata = await this.adddatadeploy(req)
            return getdata;
        } else if (req.menu_action == "submitdatadeploy") {
            const getdata = await this.sumbitatadeploy(req)
            return getdata;
        } else if (req.menu_action == "deployactive") {
            const getdata = await this.deployactive(req)
            return getdata;
        }

    }
    async downloadresult(req) {
        try {
            let result = await connectmssql.then((pool) => {
                return pool.request().query(`select url_patch,result_name from  civr.tbl_upload_grammar  where result_name='${req.filename}'`)
            })

            console.log(result)
            return result;
        } catch (err) {
            console.log(err)
        }
    }
    async updategrammarresult(req) {
        try {

            let updategrammar = await connectmssql.then((pool) => {
                return pool.request().query(`update civr.tbl_upload_grammar set  message_error='build success',status=6,result_name='${req.filename}',url_patch='${req.path}' where build_version ='${req.build_id}'`)
            })
            let resultJson
            resultJson = {
                "code": "200",
                "msg": "success result",
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }
    }

    async uploadvoicelog(req) {
        try {
            let result = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
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
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        try {
            let getdatagrammar = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getdata_grammar`)
            })
            columnsName = getdatagrammar.recordsets[1][0].columnName
            columnsdataName = getdatagrammar.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_field': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "data grammar",
                "columnsname": columns,
                "recs": getdatagrammar.recordsets[0],
                "result": getdatagrammar.recordsets[1]
            };
            return resultJson
        } catch (err) {
            console.log(err)
        }
    }

    async uploadGrammar(body_upload) {
        try {

            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(body_upload))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_upload_grammar`)
            })

            let resultJson = {
                "code": insert.recordsets[0][0].code,
                "msg": insert.recordsets[0][0].msg,
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }

    }
    async writeSLMxml(sheetResult, prjName) {
        try {
            var colA = ""
            var colB = ""
            var colC = ""
            var senTence = [];
            var dupSentence
            var vocab = []
            var xmlItem = ""
            var xmlSentence = ""
            // for wordlist
            var vocab2 = []
            var wordSentence = []
            var word
            var mytag = {}
            var myword = {}
            var j
            // ----------------------------------------------------------->
            // 1.Sheet 0:"SLM"
            // 10	 จะ ยกเลิก เอสเอ็มเอส
            // load uniq sentence to Array
            for (let i = 1; i <= sheetResult.length; i++) {
                if (sheetResult[i] !== undefined) {
                    colA = sheetResult[i].A // Count
                    //colA = colA.replace(/(\r\n|\n|\r)/gm, "");
                    colB = sheetResult[i].B // Sentence
                    colB = colB.replace(/(\r\n|\n|\r)/gm, "");
                    // Sentence get initen from Array first
                    dupSentence = 0
                    for (let i4 = 0; i4 < senTence.length; i4++) {
                        if (senTence[i4] === colB) {
                            dupSentence = 1
                            break;
                        }
                    }
                    if (dupSentence == 0) {
                        senTence.push(colB)
                    }
                }
            }
            // Loop Array Sentence for gen SML File
            if (senTence[0]) {
                var sIntent = senTence[0]
            }
            for (var i = 0; i < senTence.length; i++) {
                // For wordlist
                if (sIntent != senTence[i]) {
                    wordSentence.push(myword)
                    mytag[sIntent] = wordSentence
                    sIntent = senTence[i].intent_tag
                    wordSentence = []
                    myword = {}
                    vocab2 = []
                }
                var line = senTence[i]
                var arr = line.split(" ");
                for (var i2 = 0; i2 < arr.length; i2++) {
                    var word = arr[i2]
                    if (word !== "") {
                        word = word.trim()
                        var foundWord = vocab.filter(vocab => vocab.item === word);
                        if (foundWord.length == 0) {
                            const item = {
                                "item": word
                            }
                            vocab.push(item)
                            if (xmlItem === "") {
                                xmlItem = '<item>' + word + '</item>'
                                // xmlWord = '<word>' + word + '</word>'

                            } else {
                                xmlItem = xmlItem + '\r\n' + '<item>' + word + '</item>'
                                //xmlWord = xmlWord + '\r\n' + '<word>' + word + '</word>'
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
                if (i == (senTence.length - 1)) {
                    wordSentence.push(myword)
                    mytag[sIntent] = wordSentence
                }
                // <sentence count="10">อยาก สมัคร โปร รายการใหม่</sentence> -----------------------
                if (xmlItem === "") {
                    xmlSentence = '<sentence count="' + colA + '">' + senTence[i] + '</sentence>'
                } else {
                    xmlSentence = xmlSentence + '\r\n' + '<sentence count="' + colA + '">' + senTence[i] + '</sentence>'
                }

            }




            // Start Build grammar file
            var filessystem = require('fs');
            var fs = require("fs")
            var buildVersion = ''
            var fsm_out = prjName + '-slm.fsm'
            var wordlist_out = prjName + '-slm.wordlist'
            var slmName = prjName + '-slm.xml'
            var ssmName = prjName + '-ssm.xml'
            var mainMenu = prjName + '-' + pathdev.parsed.namegram + '.xml'
            var wordlist = prjName + pathdev.parsed.namejson + '.json'
            var smmXML = ""
            // -----------------------------------------------------------------------

            // SML File procss
            var xmlSLM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
                '<!DOCTYPE SLMTraining SYSTEM "SpeakFreelyConfig.dtd">' + '\r\n' +
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

            return xmlSLM
        } catch (err) {
            console.log(err);
        }
    }
    async writeSSMxml(sheetResult, prjName, sheetResult2) {
        try {
            var colA = ""
            var colD = ""
            var colE = ""
            var vocab = []
            var xmlWord = ""
            var xmlSentenceSSM = ""
            var rulerefTag = ""
            var fc = 0
            var conceptArr = ""
            var conceptArr2 = ""
            var ssmSentence = ""
            var smmIntent = ""
            var smmConcept = ""
            var ssmResult = ""
            var ssmVariation = ""
            var conceptList = []
            var dupConcept = 0
            var featureTag = ""
            var intentList = []
            var dupIntent = 0
            var ssmSentenceList = ""

            var ssmName2 = prjName + '-ssm'


            var conceptElse = ''
            var conceptElseList = []
            var elseText = ''


            var sentenceListN = []


            for (let i = 1; i <= sheetResult2.length; i++) {
                if (sheetResult2[i] !== undefined) {
                    if (sheetResult2[i].D !== undefined) {
                        conceptElse = sheetResult2[i].A + '|' + sheetResult2[i].D
                        conceptElseList.push(conceptElse)
                    }
                }
            }

            for (let i = 1; i <= sheetResult.length; i++) {

                if (sheetResult[i] !== undefined) {
                    colA = sheetResult[i].C // Count
                    // colA = colA.replace(/(\r\n|\n|\r)/gm, "");

                    colD = sheetResult[i].D // Intention
                    colD = colD.replace(/(\r\n|\n|\r)/gm, "");
                    colE = sheetResult[i].E // คำถาม
                    colE = colE.replace(/(\r\n|\n|\r)/gm, "");

                    sentenceListN.push(colD + '|' + colE)

                    ssmSentenceList = ""
                    var arr3 = colE.split("]")
                    for (let i3 = 0; i3 < arr3.length; i3++) {
                        fc = arr3[i3].indexOf("[");
                        if (fc > -1) {
                            ssmSentence = arr3[i3].substring(0, fc)
                            conceptArr2 = arr3[i3].substring(fc)
                            conceptArr2 = conceptArr2.replace("[", "")
                            conceptArr2 = conceptArr2.replace("]", "")
                            let arr = conceptArr2.split("|");
                            smmConcept = arr[0]
                            ssmResult = arr[1]
                            ssmVariation = arr[2]
                            rulerefTag = '<ruleref uri="' + smmConcept + '.filter.xml#' + smmConcept + '"  words="' + ssmVariation + '"/>'
                            // Concept
                            dupConcept = 0
                            for (let i4 = 0; i4 < conceptList.length; i4++) {
                                if (conceptList[i4] === smmConcept) {
                                    dupConcept = 1
                                    break;
                                }
                            }
                            if (dupConcept == 0) {
                                conceptList.push(smmConcept)
                                elseText = ''
                                for (let c = 0; c < conceptElseList.length; c++) {
                                    let cArr = conceptElseList[c].split("|");
                                    if (smmConcept === cArr[0]) {
                                        elseText = ' || "' + cArr[1] + '"'
                                        break;
                                    }
                                }


                                if (featureTag === "") {
                                    featureTag = '<ruleref feature_generation="fragment" uri="' + smmConcept + '.filter.xml#' + smmConcept + '"><tag>' + smmConcept + '=' + smmConcept + '.R_' + smmConcept + elseText + ';</tag></ruleref>'
                                } else {
                                    featureTag = featureTag + '\r\n' + '<ruleref feature_generation="fragment" uri="' + smmConcept + '.filter.xml#' + smmConcept + '"><tag>' + smmConcept + '=' + smmConcept + '.R_' + smmConcept + elseText + ';</tag></ruleref>'
                                }
                            }
                        } else {
                            ssmSentence = arr3[i3]
                            rulerefTag = ""
                        }
                        // Word
                        var line = ssmSentence
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
                                    if (xmlWord === "") {
                                        xmlWord = '<word>' + word + '</word>'
                                    } else {
                                        xmlWord = xmlWord + '\r\n' + '<word>' + word + '</word>'
                                    }
                                }

                            }
                        }
                        // Intent
                        dupIntent = 0
                        for (let i4 = 0; i4 < intentList.length; i4++) {
                            if (intentList[i4] === colD) {
                                dupIntent = 1
                                break;
                            }
                        }
                        if (dupIntent == 0) {
                            intentList.push(colD)
                            if (smmIntent === "") {
                                smmIntent = '<meaning prior="0.0"><slot name="app_tag_intent">' + colD + '</slot></meaning>'
                            } else {
                                smmIntent = smmIntent + '\r\n' + '<meaning prior="0.0"><slot name="app_tag_intent">' + colD + '</slot></meaning>'
                            }

                        }
                        if (i3 < arr3.length) {
                            if (ssmSentence.length > 0) {
                                ssmSentenceList = ssmSentenceList + ssmSentence + rulerefTag
                            } else {
                                ssmSentenceList = ssmSentenceList + rulerefTag
                            }
                        }
                    }
                }
                if (ssmSentenceList.length > 0) {
                    if (xmlSentenceSSM === "") {
                        xmlSentenceSSM = '<sentence count="' + colA + '"><semantics><slot name="app_tag_intent">' + colD + '</slot></semantics>' + ssmSentenceList + '</sentence>'
                    } else {
                        xmlSentenceSSM = xmlSentenceSSM + '\r\n' + '<sentence count="' + colA + '"><semantics><slot name="app_tag_intent">' + colD + '</slot></semantics>' + ssmSentenceList + '</sentence>'
                    }
                }


            }
            if (ssmSentenceList.length > 0) {
                if (xmlSentenceSSM === "") {
                    xmlSentenceSSM = '<sentence count="' + colA + '"><semantics><slot name="app_tag_intent">' + colD + '</slot></semantics>' + ssmSentenceList + '</sentence>'
                } else {
                    xmlSentenceSSM = xmlSentenceSSM + '\r\n' + '<sentence count="' + colA + '"><semantics><slot name="app_tag_intent">' + colD + '</slot></semantics>' + ssmSentenceList + '</sentence>'
                }
            }
            // Begin wrie SMM file ->
            var xmlSMM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
                '<!DOCTYPE SLMTraining SYSTEM "SpeakFreelyConfig.dtd">' + '\r\n' +
                '<SSMTraining version="1.0.0" xml:lang="th-th" tag-format="swi-semantics/1.0"> ' + '\r\n' +
                '<features>' + '\r\n' +
                featureTag + '\r\n' +
                xmlWord + '\r\n' +
                '</features>' + '\r\n' +
                '<semantic_models>' + '\r\n' +
                '<SSM>' + '\r\n' +
                '<param name="num_iterations">' + '\r\n' +
                '<value>0</value>' + '\r\n' +
                '</param>' + '\r\n' +
                '<param name="ssm_output_filename">' + '\r\n' +
                '<value>' + ssmName2 + '</value>' + '\r\n' +
                '</param>' + '\r\n' +
                smmIntent + '\r\n' +
                // '<meaning default_meaning="true">NO_MATCH</meaning>' + '\r\n' +
                '<meaning default_meaning="true"><slot name="app_tag_intent">NO_MATCH</slot></meaning>' + '\r\n' +
                '</SSM>' + '\r\n' +
                '</semantic_models>' + '\r\n' +
                '<training>' + '\r\n' +
                xmlSentenceSSM + '\r\n' +
                '</training>' + '\r\n' +
                '</SSMTraining>'
             
             
                // return xmlSMM

                return {
                    first: xmlSMM,
                    second: sentenceListN,
                };

        } catch (err) {
            console.log(err);
        }
    }
    async writeConceptXML(sheetResult, prjName, dirc) {
        //  4:"Concept"
        /*
            <?xml version="1.0" encoding="utf-8" ?>
            <grammar version="1.0" xmlns="http://www.w3.org/2001/06/grammar"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.w3.org/2001/06/grammar
            http://www.w3.org/TR/speech-grammar/grammar.xsd"
            xml:lang="th-TH" mode="voice" root="PRICE">
            <rule id="PRICE" scope="public">
            <item>
            <ruleref uri="#DETAILS"/><tag> R_PRICE=DETAILS.V;SWI_meaning=R_PRICE;</tag>
            </item>
            </rule>
            <rule id="DETAILS">
            <one-of>
            <item>สาม เก้า เก้า<tag>V="399THB";</tag></item>
            <item>สี่ แปด แปด<tag>V="488THB";</tag></item>
    
            </one-of>
            </rule>
            </grammar>
        */
        try {
            var colA
            var colB
            var colC
            var firstConcept = ""
            var xmlItem = ""
            var conceptFileName = ""
            var conceptXML = ""
            var xmlConcept1 = ""
            var ruleref = ""
            var xmlroot = ""
            var xml2 = ""
            var xml3 = ""
            var xml4 = ""
            var conceptElse = ''
            // Write file /buildgrammar

            var filessystem = require('fs');
            var fs = require("fs")
            var dir = dirc;
            // process.chdir(`${dir}`);

            var conceptArr = []

            xmlConcept1 = '<?xml version="1.0" encoding="utf-8" ?>' + '\r\n' +
                '<grammar version="1.0" xmlns="http://www.w3.org/2001/06/grammar"' + '\r\n' +
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + '\r\n' +
                'xsi:schemaLocation="http://www.w3.org/2001/06/grammar' + '\r\n' +
                'http://www.w3.org/TR/speech-grammar/grammar.xsd"'
            xml3 = '</item>' + '\r\n' +
                '</rule>' + '\r\n' +
                '<rule id="DETAILS">' + '\r\n' +
                '<one-of>'
            xml4 = '</one-of>' + '\r\n' +
                '</rule>' + '\r\n' +
                '</grammar>' + '\r\n'

            firstConcept = sheetResult[1].A
            firstConcept = firstConcept.replace(/(\r\n|\n|\r)/gm, "");

            for (let i = 1; i <= sheetResult.length; i++) {

                conceptFileName = firstConcept + '.filter.xml'
                ruleref = '<ruleref uri="#DETAILS"/><tag>R_' + firstConcept + '=DETAILS.V;SWI_meaning=R_' + firstConcept + ';</tag>'
                xmlroot = 'xml:lang="th-TH" mode="voice" root="' + firstConcept + '">'
                xml2 = '<rule id="' + firstConcept + '" scope="public">' + '\r\n' + '<item>'

                if (sheetResult[i] !== undefined) {
                    colA = sheetResult[i].A // Concept
                    if (colA !== undefined) {
                        colA = colA.replace(/(\r\n|\n|\r)/gm, "");
                    }
                    colB = sheetResult[i].B // Concept Result
                    // colB = colB.replace(/(\r\n|\n|\r)/gm, "");
                    colC = sheetResult[i].C // Variation

                 


                    colC = colC.replace(/(\r\n|\n|\r)/gm, "");
                    conceptElse = sheetResult[i].D
                    if (firstConcept === colA || colA === undefined) {
                        if (xmlItem === "") {
                            xmlItem = '<item>' + colC + '<tag>V="' + colB + '";</tag></item>'
                        } else {
                            xmlItem = xmlItem + '\r\n' + '<item>' + colC + '<tag>V="' + colB + '";</tag></item>'
                        }
                        conceptArr.push(firstConcept + '|' + colB + '|' + colC)

                    } else { // Concept name change in excel
                        conceptXML = xmlConcept1 + '\r\n' +
                            xmlroot + '\r\n' +
                            xml2 + '\r\n' +
                            ruleref + '\r\n' +
                            xml3 + '\r\n' +
                            xmlItem + '\r\n' +
                            xml4
                        // ----------------------
                        fs.writeFile(dir + conceptFileName, conceptXML, 'utf8', function (err, data) {
                            if (err) console.log(err);
                            //console.log("successfully " + conceptXML + " to file ");
                        });
                        //-----------------------
                        firstConcept = colA
                        conceptArr.push(firstConcept + '|' + colB + '|' + colC)

                        conceptFileName = firstConcept + '.filter.xml'
                        ruleref = '<ruleref uri="#DETAILS"/><tag>R_' + firstConcept + '=DETAILS.V;SWI_meaning=R_ ' + firstConcept + ';</tag>' + '\r\n' + '</item>'
                        xmlroot = 'xml:lang="th-TH" mode="voice" root="' + firstConcept + '">'
                        xml2 = '<rule id="' + firstConcept + '" scope="public">' + '\r\n' + '<item>'
                        xmlItem = '<item>' + colC + '<tag>V="' + colB + '";</tag></item>'
                    }
                } else { // End of File
                    conceptXML = xmlConcept1 + '\r\n' +
                        xmlroot + '\r\n' +
                        xml2 + '\r\n' +
                        ruleref + '\r\n' +
                        xml3 + '\r\n' +
                        xmlItem + '\r\n' +
                        xml4
                    // ----------------------
                    fs.writeFile(dir + conceptFileName, conceptXML, 'utf8', function (err, data) {
                        if (err) console.log(err);
                      //  console.log("successfully " + conceptXML + " to file ");
                    });
                }
            }
             return conceptArr
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async writesubtag1(sheetResult, prjName, dirc) {
        try {
            var colA = ""
            var colB
            var colC
            var colD = ""
            var colE = ""
            var vocab = []
            var xmlItem = ""
            var xmlSentence = ""
            var headSLM = ""
            var xmlWord = ""
            var xmlSentenceSSM = ""
            var rulerefTag = ""
            var fc = 0
            var conceptArr = ""
            var conceptArr2 = ""
            var ssmSentence = ""
            var smmIntent = ""
            var smmConcept = ""
            var ssmResult = ""
            var ssmVariation = ""
            var conceptList = []
            var dupConcept = 0
            var featureTag = ""
            var intentList = []
            var dupIntent = 0
            var firstsubTAG = ""
            var xml2 = ""
            var xml3 = ""
            var xml4 = ""
            var xml5 = ""
            subtagSMM = ""
            var ssmName2 = prjName + '-ssm'
            var subtagSMM = ""
            var mainsutagFile = ""
            var line3 = ""
            var mainsutagFile = ""
            var slmsubtagFile = ""
            var mainsubtagXML = ""
            var mainsubtagXML2 = ""
            var subtagSLM = ""
            var fsmName = ""
            var wordlistName = ""
            var mainsubtagXML0 = ""
            var mainsubtagXML1 = ""
            var slmSentenList = ""
            firstsubTAG = sheetResult[1].B
            firstsubTAG = firstsubTAG.replace(/(\r\n|\n|\r)/gm, "");
            const fs = require('fs-extra')
            var dir = dirc;
            var fileList1 = ''
            mainsubtagXML = "<?xml version='1.0' encoding='UTF-8'?>" + '\r\n' +
                '<grammar xml:lang="th-th" version="1.0"' + '\r\n' +
                'tag-format="swi-semantics/1.0"' + '\r\n' +
                'xmlns="http://www.w3.org/2001/06/grammar"' + '\r\n' +
                'mode="voice">' + '\r\n' +
                '<meta name="swirec_fsm_grammar" content="'
            //slm-train.fsm
            mainsubtagXML0 = '"/>' + '\r\n' +
                '<meta name="swirec_fsm_wordlist" content="'
            //slm-train.wordlist
            mainsubtagXML1 = '"/>' + '\r\n' +
                "<meta name='swirec_optimization' content='12'/>" + '\r\n' +
                '<semantic_interpretation xmlns="http://www.nuance.com/semantics" priority="1">' + '\r\n' +
                '<component>' + '\r\n' +
                '<interpreter uri="'
            mainsubtagXML2 = '-ssm.ssm" type="application/x-vnd.nuance.ssm"/>' + '\r\n' +
                '</component>' + '\r\n' +
                '</semantic_interpretation>' + '\r\n' +
                '</grammar>'

            headSLM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
                '<!DOCTYPE SLMTraining SYSTEM "SpeakFreelyConfig.dtd">' + '\r\n' +
                '<SLMTraining version="1.0.0" xml:lang="th-th">' + '\r\n' +
                '<param name="ngram_order"> <value> 3 </value></param>' + '\r\n' +
                '<param name="cutoffs"><value> 0 1 </value></param>' + '\r\n' +
                '<param name="smooth_weights"><value>0.1 0.9 0.9 0.4</value></param>' + '\r\n' +
                '<param name="smooth_alg"><value>GT-discw-int</value></param>' + '\r\n' +
                '<param name="fsm_out"><value>' // + firstsubTAG + 
            xml2 = '.fsm</value> </param>' + '\r\n' +
                '<param name="wordlist_out"><value>' //+ firstsubTAG + 
            xml3 = '.wordlist</value></param>' + '\r\n' + '<vocab>'
            xml4 = '</vocab>' + '\r\n' + '<training>'
            xml5 = '</training>' + '\r\n' +
                '</SLMTraining>'


            for (let i = 1; i <= sheetResult.length; i++) {

                if (sheetResult[i] !== undefined) {
                    colA = sheetResult[i].A // Count
                    colB = sheetResult[i].B // subTAG
                    // colB = colB.replace(/(\r\n|\n|\r)/gm, "");
                    colC = sheetResult[i].C // Sentence
                    // colC = colC.replace(/(\r\n|\n|\r)/gm, "");


                    if (colC !== undefined) {
                        colE = colC
                        if (firstsubTAG === colB) {

                            slmSentenList = ""
                            var arr3 = colE.split("]")
                            for (let i3 = 0; i3 < arr3.length; i3++) {
                                fc = arr3[i3].indexOf("[");
                                if (fc > -1) {
                                    ssmSentence = arr3[i3].substring(0, fc)
                                    conceptArr2 = arr3[i3].substring(fc)
                                    conceptArr2 = conceptArr2.replace("[", "")
                                    let arr2 = conceptArr2.split("|");
                                    smmConcept = arr2[0]
                                    ssmResult = arr2[1]
                                    ssmVariation = arr2[2]
                                    rulerefTag = '<ruleref uri="' + smmConcept + '.filter.xml#' + smmConcept + '"  words="' + ssmVariation + '"/>'
                                    // Concept
                                    dupConcept = 0
                                    for (let i4 = 0; i4 < conceptList.length; i4++) {
                                        if (conceptList[i4] === smmConcept) {
                                            dupConcept = 1
                                            break;
                                        }
                                    }
                                    if (dupConcept == 0) {
                                        conceptList.push(smmConcept)
                                        if (featureTag === "") {
                                            //<ruleref uri="VOICE.filter.xml#VOICE"/>
                                            featureTag = '<ruleref uri="' + smmConcept + '.filter.xml#' + smmConcept + '"/>'
                                        } else {
                                            featureTag = featureTag + '\r\n' + '<ruleref  uri="' + smmConcept + '.filter.xml#' + smmConcept + '"/>'
                                        }
                                    }
                                } else {
                                    // No concept in sentence
                                    ssmSentence = arr3[i3]
                                    rulerefTag = ""
                                }
                                // Word
                                if (ssmSentence.length > 0) {
                                    var line = ssmSentence
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
                                                } else {
                                                    xmlItem = xmlItem + '\r\n' + '<item>' + word + '</item>'
                                                }
                                            }

                                        }
                                    }

                                }
                                if (i3 < arr3.length) {
                                    if (ssmSentence.length > 0) {
                                        slmSentenList = slmSentenList + ssmSentence + rulerefTag
                                    } else {
                                        slmSentenList = slmSentenList + rulerefTag
                                    }
                                }
                            }
                            if (slmSentenList.length > 0) {
                                if (xmlSentence === "") {
                                    xmlSentence = '<sentence count="' + colA + '">' + slmSentenList + '</sentence>'
                                } else {
                                    xmlSentence = xmlSentence + '\r\n' + '<sentence count="' + colA + '">' + slmSentenList + '</sentence>'
                                }
                            }
                        } else {
                            // Chnage new sub tag
                            fsmName = firstsubTAG + '.fsm'
                            wordlistName = firstsubTAG + '.wordlist'
                            subtagSLM = headSLM + firstsubTAG + xml2 + firstsubTAG + xml3 + '\r\n' +
                                featureTag + '\r\n' +
                                xmlItem + '\r\n' +
                                xml4 + '\r\n' +
                                xmlSentence + '\r\n' +
                                xml5
                            mainsutagFile = firstsubTAG + '.xml'
                            if (fileList1 === "") {
                                fileList1 = firstsubTAG
                            } else {
                                fileList1 = fileList1 + ',' + firstsubTAG
                            }
                            await fs.writeFileSync(dir + mainsutagFile, mainsubtagXML + fsmName + mainsubtagXML0 + wordlistName + mainsubtagXML1 +
                                firstsubTAG + mainsubtagXML2, 'utf8',
                                function (err, data) {
                                    if (err) console.log(err);
                                    console.log("successfully " + firstsubTAG + " to file ")
                                });
                            slmsubtagFile = firstsubTAG + '-slm.xml'
                            await fs.writeFileSync(dir + slmsubtagFile, subtagSLM, 'utf8', function (err, data) {
                                if (err) console.log(err);
                                console.log("successfully " + firstsubTAG + " to file ");
                            });

                            // return "success'"
                            // conceptFileName = firstsubTAG + '.filter.xml'
                            firstsubTAG = colB
                            xmlItem = ""
                            xmlSentence = ""
                            vocab = []
                            conceptList = []
                            featureTag = ""
                            rulerefTag = ""
                            slmSentenList = ""
                            i = i - 1

                        }
                    }
                    // End of File
                } else {

                    fsmName = firstsubTAG + '.fsm'
                    wordlistName = firstsubTAG + '.wordlist'
                    subtagSLM = headSLM + firstsubTAG + xml2 + firstsubTAG + xml3 + '\r\n' +
                        featureTag + '\r\n' +
                        xmlItem + '\r\n' +
                        xml4 + '\r\n' +
                        xmlSentence + '\r\n' +
                        xml5
                    mainsutagFile = firstsubTAG + '.xml'
                    fileList1 = fileList1 + ',' + firstsubTAG
                    await fs.writeFileSync(dir + mainsutagFile, mainsubtagXML + fsmName + mainsubtagXML0 + wordlistName + mainsubtagXML1 +
                        firstsubTAG + mainsubtagXML2, 'utf8',
                        function (err, data) {
                            if (err) console.log(err);
                            console.log("successfully " + firstsubTAG + " to file ")
                        });
                    slmsubtagFile = firstsubTAG + '-slm.xml'
                    await fs.writeFileSync(dir + slmsubtagFile, subtagSLM, 'utf8', function (err, data) {
                        if (err) console.log(err);
                        console.log("successfully " + firstsubTAG + " to file ");
                    });

                }
            }
            return fileList1 // "success'"
        } catch (err) {
            console.log(err);
        }
    }
    async writesubtag2(sheetResult, prjName, sheetResult2, dirc) {
        try {
            var colA = ""
            var colB
            var colC
            var colD = ""
            var colE = ""
            var vocab = []
            var xmlWord = ""
            var xmlSentenceSSM = ""
            var rulerefTag = ""
            var fc = 0
            var conceptArr = ""
            var conceptArr2 = ""
            var ssmSentence = ""
            var smmIntent = ""
            var smmConcept = ""
            var ssmResult = ""
            var ssmVariation = ""
            var conceptList = []
            var dupConcept = 0
            var featureTag = ""
            var intentList = []
            var dupIntent = 0
            var firstsubTAG = ""
            var xml2 = ""
            var xml3 = ""
            var xml4 = ""
            var xml5 = ""
            subtagSMM = ""
            var ssmName2 = prjName + '-ssm'
            var subtagSMM = ""
            var mainsutagFile = ""
            var line3 = ""
            var ssmSentenceList = ""
            var oldColA = ""
            var oldColD = ""

            firstsubTAG = sheetResult[1].B
            firstsubTAG = firstsubTAG.replace(/(\r\n|\n|\r)/gm, "");
            const fs = require('fs-extra')
            var dir = dirc;

            // Begin wrie SMM file ->
            var xmlSMM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
                '<!DOCTYPE SLMTraining SYSTEM "SpeakFreelyConfig.dtd">' + '\r\n' +
                '<SSMTraining version="1.0.0" xml:lang="th-th" tag-format="swi-semantics/1.0"> ' + '\r\n' +
                '<features>' + '\r\n'

            // featureTag + '\r\n' +

            // xmlWord + '\r\n' 

            xml2 = '</features>' + '\r\n' +
                '<semantic_models>' + '\r\n' +
                '<SSM>' + '\r\n' +
                '<param name="num_iterations">' + '\r\n' +
                '<value>0</value>' + '\r\n' +
                '</param>' + '\r\n' +
                '<param name="ssm_output_filename">' + '\r\n' +
                '<value>'
            // ssmName2 
            xml3 = '</value>' + '\r\n' +
                '</param>' + '\r\n'


            // smmIntent 


            xml4 = '</SSM>' + '\r\n' +
                '</semantic_models>' + '\r\n' +
                '<training>' + '\r\n'
            // xmlSentenceSSM 
            xml5 = '</training>' + '\r\n' +
                '</SSMTraining>'
            var conceptElse = ''
            var conceptElseList = []
            var elseText = ''

            var sentenceListN = []
            var resultTxt = ''
            var resultErr = ''
            var Line = 0


            function convertSentent(mySentence) {
                var ssmSentenceN = ""
                let splitConcept = []
                let conceptArr = []
                let conceptTo = ''
                splitConcept = mySentence.split('[')
                try {
                    if (splitConcept.length > 1) {
                        for (let s = 0; s < splitConcept.length; s++) {
                            let fc = 0
                            fc = splitConcept[s].indexOf("]");
                            // Is array[] = concept
                            if (fc > -1) {
                                let splitWordConcept = []
                                let wordConcept = ''
                                let conceptName
                                splitWordConcept = splitConcept[s].split('|')
                                let split2 = []
                                conceptName = splitWordConcept[0] + ':' + splitWordConcept[1]
                                conceptArr.push(conceptName)
                                split2 = splitWordConcept[2].split(']')
                                for (let s2 = 0; s2 < split2.length; s2++) {
                                    wordConcept = wordConcept + split2[s2]
                                }
                                ssmSentenceN = ssmSentenceN + wordConcept

                            } else {
                                ssmSentenceN = ssmSentenceN + splitConcept[s]
                            }
                        }
                        for (let s2 = 0; s2 < conceptArr.length; s2++) {
                            if (conceptTo === '') {
                                conceptTo = conceptArr[s2]
                            } else {
                                conceptTo = conceptTo + ',' + conceptArr[s2]
                            }
                        }
                       
                        sentenceListN.push(colB + '|' + colC + '|' + ssmSentenceN + '|' + conceptTo)

                    } else {
                       
                        sentenceListN.push(colB + '|' + colC + '|' + mySentence + '|')
                    }
                } catch (err) {
                    resultErr = resultErr + '\r\n' + Line + ' ' + mySentence
                }
            }

            for (let i = 1; i <= sheetResult2.length; i++) {
                if (sheetResult2[i] !== undefined) {
                    if (sheetResult2[i].D !== undefined) {
                        conceptElse = sheetResult2[i].A + '|' + sheetResult2[i].D
                        conceptElseList.push(conceptElse)
                    }
                }
            }

            for (let i = 1; i <= sheetResult.length; i++) {
                if (sheetResult[i] !== undefined) {
                    colA = sheetResult[i].A // Count
                    colB = sheetResult[i].B // Intention
                    colC = sheetResult[i].C
                    colD = sheetResult[i].C // Intention
                    // colD = colD.replace(/(\r\n|\n|\r)/gm, "");

                     // Intention

                    convertSentent(sheetResult[i].D)


                    if (colD !== undefined) {
                        colE = sheetResult[i].D // คำถาม
                        // colE = colE.replace(/(\r\n|\n|\r)/gm, "");
                        


                        if (firstsubTAG === colB) {

                            ssmSentenceList = ""
                            var arr3 = colE.split("]")
                            for (let i3 = 0; i3 < arr3.length; i3++) {
                                fc = arr3[i3].indexOf("[");
                                if (fc > -1) {
                                    ssmSentence = arr3[i3].substring(0, fc)
                                    conceptArr2 = arr3[i3].substring(fc)
                                    conceptArr2 = conceptArr2.replace("[", "")
                                    let arr2 = conceptArr2.split("|");
                                    smmConcept = arr2[0]
                                    ssmResult = arr2[1]
                                    ssmVariation = arr2[2]
                                    rulerefTag = '<ruleref uri="' + smmConcept + '.filter.xml#' + smmConcept + '"  words="' + ssmVariation + '"/>'
                                    // Concept
                                    dupConcept = 0
                                    for (let i4 = 0; i4 < conceptList.length; i4++) {
                                        if (conceptList[i4] === smmConcept) {
                                            dupConcept = 1
                                            break;
                                        }
                                    }
                                    if (dupConcept == 0) {
                                        conceptList.push(smmConcept)
                                        elseText = ''
                                        for (let c = 0; c < conceptElseList.length; c++) {
                                            let cArr = conceptElseList[c].split("|");
                                            if (smmConcept === cArr[0]) {
                                                elseText = ' || "' + cArr[1] + '"'
                                                break;
                                            }
                                        }
                                        if (featureTag === "") {
                                            featureTag = '<ruleref feature_generation="fragment" uri="' + smmConcept + '.filter.xml#' + smmConcept + '"><tag>' + smmConcept + '=' + smmConcept + '.R_' + smmConcept + elseText + ';</tag></ruleref>'
                                        } else {
                                            featureTag = featureTag + '\r\n' + '<ruleref feature_generation="fragment" uri="' + smmConcept + '.filter.xml#' + smmConcept + '"><tag>' + smmConcept + '=' + smmConcept + '.R_' + smmConcept + elseText + ';</tag></ruleref>'
                                        }
                                    }
                                } else {
                                    // No concept in sentence
                                    ssmSentence = arr3[i3]
                                    rulerefTag = ""
                                }
                                // Word
                                if (ssmSentence.length > 0) {
                                    let line2 = ssmSentence
                                    let arr = line2.split(" ");
                                    for (var i2 = 0; i2 < arr.length; i2++) {
                                        var word = arr[i2]
                                        if (word !== "") {
                                            var foundWord = vocab.filter(vocab => vocab.item === word);
                                            if (foundWord.length == 0) {
                                                const item = {
                                                    "item": word
                                                }
                                                vocab.push(item)
                                                if (xmlWord === "") {
                                                    xmlWord = '<word>' + word + '</word>'
                                                } else {
                                                    xmlWord = xmlWord + '\r\n' + '<word>' + word + '</word>'
                                                }
                                            }

                                        }
                                    }
                                    // Intent
                                    dupIntent = 0
                                    for (let i4 = 0; i4 < intentList.length; i4++) {
                                        if (intentList[i4] === colD) {
                                            dupIntent = 1
                                            break;
                                        }
                                    }
                                    if (dupIntent == 0) {
                                        intentList.push(colD)
                                        if (smmIntent === "") {
                                            smmIntent = '<meaning prior="0.0"><slot name="app_tag_intent">' + colD + '</slot></meaning>'
                                        } else {
                                            smmIntent = smmIntent + '\r\n' + '<meaning prior="0.0"><slot name="app_tag_intent">' + colD + '</slot></meaning>'
                                        }

                                    }

                                }
                                if (i3 < arr3.length) {
                                    if (ssmSentence.length > 0) {
                                        ssmSentenceList = ssmSentenceList + ssmSentence + rulerefTag
                                    } else {
                                        ssmSentenceList = ssmSentenceList + rulerefTag
                                    }
                                }
                            }
                            if (ssmSentenceList.length > 0) {
                                if (xmlSentenceSSM === "") {
                                    xmlSentenceSSM = '<sentence count="' + colA + '"><semantics><slot name="app_tag_intent">' + colD + '</slot></semantics>' + ssmSentenceList + '</sentence>'
                                } else {
                                    xmlSentenceSSM = xmlSentenceSSM + '\r\n' + '<sentence count="' + colA + '"><semantics><slot name="app_tag_intent">' + colD + '</slot></semantics>' + ssmSentenceList + '</sentence>'
                                }
                            }
                        } else {
                            // Change new sub Sentence

                            subtagSMM = xmlSMM +
                                featureTag + '\r\n' +
                                xmlWord + '\r\n' +
                                xml2 +
                                firstsubTAG + '-ssm' +
                                xml3 +
                                smmIntent + '\r\n' +
                                //  '<meaning default_meaning="true">NO_MATCH</meaning>' + '\r\n' +
                                '<meaning default_meaning="true"><slot name="app_tag_intent">NO_MATCH</slot></meaning>' + '\r\n' +
                                xml4 + xmlSentenceSSM + '\r\n' +
                                xml5

                            mainsutagFile = firstsubTAG + '-ssm.xml'
                            await fs.writeFileSync(dir + mainsutagFile, subtagSMM, 'utf8', function (err, data) {
                                if (err) console.log(err);
                                console.log("successfully " + firstsubTAG + " to file ")
                            })

                            vocab = []
                            conceptList = []
                            intentList = []
                            xmlWord = ""
                            xmlSentenceSSM = ""
                            smmIntent = ""
                            featureTag = ""
                            rulerefTag = ""
                            firstsubTAG = colB
                            ssmSentenceList = ""
                            i = (i - 1)

                        }
                        // End of File
                     
                    }
                } else {

                    subtagSMM = xmlSMM +
                        featureTag + '\r\n' +
                        xmlWord + '\r\n' +
                        xml2 +
                        firstsubTAG + '-ssm' +
                        xml3 +
                        smmIntent + '\r\n' +
                        //  '<meaning default_meaning="true">NO_MATCH</meaning>' + '\r\n' +
                        '<meaning default_meaning="true"><slot name="app_tag_intent">NO_MATCH</slot></meaning>' + '\r\n' +
                        xml4 + xmlSentenceSSM + '\r\n' +
                        xml5
                    mainsutagFile = firstsubTAG + '-ssm.xml'

                    await fs.writeFileSync(dir + mainsutagFile, subtagSMM, 'utf8', function (err, data) {
                        if (err) console.log(err);
                        console.log("successfully " + firstsubTAG + " to file ")
                    })
                }
            }
            return sentenceListN  //firstsubTAG
        } catch (err) {
            console.log(err);
        }
    }
    async writeSLMxml2(sheetResult, prjName, dirc) {
        try {
            var colA = ""
            var colB
            var colC
            var colD = ""
            var colE = ""
            var vocab = []
            var xmlItem = ""
            var xmlSentence = ""
            var headSLM = ""
            var xmlWord = ""
            var xmlSentenceSSM = ""
            var rulerefTag = ""
            var fc = 0
            var conceptArr = ""
            var conceptArr2 = ""
            var ssmSentence = ""
            var smmIntent = ""
            var smmConcept = ""
            var ssmResult = ""
            var ssmVariation = ""
            var conceptList = []
            var dupConcept = 0
            var featureTag = ""
            var intentList = []
            var dupIntent = 0
            var firstsubTAG = ""
            var xml2 = ""
            var xml3 = ""
            var xml4 = ""
            var xml5 = ""
            subtagSMM = ""
            var ssmName2 = prjName + '-ssm'
            var subtagSMM = ""
            var mainsutagFile = ""
            var line3 = ""
            var mainsutagFile = ""
            var slmsubtagFile = ""
            var mainsubtagXML = ""
            var mainsubtagXML2 = ""
            var subtagSLM = ""
            var fsmName = ""
            var wordlistName = ""
            var mainsubtagXML0 = ""
            var mainsubtagXML1 = ""
            var slmSentenList = ""
            var senTence = [];
            var dupSentence
            var fsm_out = prjName + '-slm'
            var wordlist_out = prjName + '-slm'

            const fs = require('fs-extra')
            var dir = dirc;
            var i5 = 0

            function trim(str) {

                // Use trim() function 
                var trimContent = str.trim();
                return trimContent

            }

            function stringToHex(str) {

                //converting string into buffer
                let bufStr = Buffer.from(str, 'utf8');

                //with buffer, you can convert it into hex with following code
                return bufStr.toString('hex');

            }

            function hexToString(str) {
                const buf = new Buffer(str, 'hex');
                return buf.toString('utf8');
            }
            //   var me1 = stringToHex('อยาก')   

            headSLM = '<?xml version="1.0" encoding="UTF-8"?>' + '\r\n' +
                '<!DOCTYPE SLMTraining SYSTEM "SpeakFreelyConfig.dtd">' + '\r\n' +
                '<SLMTraining version="1.0.0" xml:lang="th-th">' + '\r\n' +
                '<param name="ngram_order"> <value> 3 </value></param>' + '\r\n' +
                '<param name="cutoffs"><value> 0 1 </value></param>' + '\r\n' +
                '<param name="smooth_weights"><value>0.1 0.9 0.9 0.4</value></param>' + '\r\n' +
                '<param name="smooth_alg"><value>GT-discw-int</value></param>' + '\r\n' +
                '<param name="fsm_out"><value>'
            xml2 = '.fsm</value> </param>' + '\r\n' +
                '<param name="wordlist_out"><value>'
            xml3 = '.wordlist</value></param>' + '\r\n' + '<vocab>'
            xml4 = '</vocab>' + '\r\n' + '<training>'
            xml5 = '</training>' + '\r\n' +
                '</SLMTraining>'


            for (let i = 1; i <= sheetResult.length; i++) {
                if (sheetResult[i] !== undefined) {
                    colA = sheetResult[i].A // Count
                    colB = sheetResult[i].B // subTAG
                    colB = colB.replace(/(\r\n|\n|\r)/gm, "");
                    colE = colB
                    if (slmSentenList.length > 0) {
                        if (xmlSentence === "") {
                            xmlSentence = '<sentence count="' + colA + '">' + slmSentenList + '</sentence>'
                        } else {
                            xmlSentence = xmlSentence + '\r\n' + '<sentence count="' + colA + '">' + slmSentenList + '</sentence>'
                        }
                    }
                    slmSentenList = ""
                    var arr3 = colE.split("]")
                    for (let i3 = 0; i3 < arr3.length; i3++) {
                        fc = arr3[i3].indexOf("[");
                        if (fc > -1) {
                            ssmSentence = arr3[i3].substring(0, fc)
                            conceptArr2 = arr3[i3].substring(fc)
                            conceptArr2 = conceptArr2.replace("[", "")
                            let arr2 = conceptArr2.split("|");
                            smmConcept = arr2[0]
                            ssmResult = arr2[1]
                            ssmVariation = arr2[2]
                            rulerefTag = '<ruleref uri="' + smmConcept + '.filter.xml#' + smmConcept + '"  words="' + ssmVariation + '"/>'
                            // Concept
                            dupConcept = 0
                            for (let i4 = 0; i4 < conceptList.length; i4++) {
                                if (conceptList[i4] === smmConcept) {
                                    dupConcept = 1
                                    break;
                                }
                            }
                            if (dupConcept == 0) {
                                conceptList.push(smmConcept)
                                if (featureTag === "") {
                                    //<ruleref uri="VOICE.filter.xml#VOICE"/>
                                    featureTag = '<ruleref uri="' + smmConcept + '.filter.xml#' + smmConcept + '"/>'
                                } else {
                                    featureTag = featureTag + '\r\n' + '<ruleref  uri="' + smmConcept + '.filter.xml#' + smmConcept + '"/>'
                                }
                            }
                        } else {
                            // No concept in sentence
                            ssmSentence = arr3[i3]
                            rulerefTag = ""
                        }
                        // Word
                        if (ssmSentence.length > 0) {
                            var line = ssmSentence
                            var arr = line.split(" ");
                            for (var i2 = 0; i2 < arr.length; i2++) {


                                var word = arr[i2]
                                if (word !== "") {
                                    //  var foundWord = vocab.filter(vocab => vocab.item === word);
                                    //  if (foundWord.length == 0) {
                                    //     const item = {
                                    //        "item": word
                                    //    }
                                    if (vocab.indexOf(word) > -1) {
                                        null
                                    } else {
                                        vocab.push(word)
                                        var me = stringToHex(word)
                                        var im = me.indexOf('c2a0')
                                        if (im > -1) {
                                            me = me.replace('c2a0', "")
                                            me = hexToString(me)
                                            word = me
                                        }

                                        if (xmlItem === "") {
                                            xmlItem = '<item>' + trim(word) + '</item>'
                                        } else {
                                            xmlItem = xmlItem + '\r\n' + '<item>' + word + '</item>'
                                        }
                                    }

                                }
                            }

                        }
                        dupSentence = 0
                        /*
                        for (let i4 = 0; i4 < senTence.length; i4++) {
                            if (senTence[i4] === colB) {
                                dupSentence = 1
                                break;
                            }
                        }
                        if (dupSentence == 0) {
                            senTence.push(colB)
                        }
                        */
                        if (dupSentence == 0) {
                            if (i3 < arr3.length) {
                                if (ssmSentence.length > 0) {
                                    slmSentenList = slmSentenList + ssmSentence + rulerefTag
                                } else {
                                    slmSentenList = slmSentenList + rulerefTag
                                }
                            }
                        }
                    }

                    // End of File
                } else {
                    if (slmSentenList.length > 0) {
                        if (xmlSentence === "") {
                            xmlSentence = '<sentence count="' + colA + '">' + slmSentenList + '</sentence>'
                        } else {
                            xmlSentence = xmlSentence + '\r\n' + '<sentence count="' + colA + '">' + slmSentenList + '</sentence>'
                        }
                    }

                    subtagSLM = headSLM + firstsubTAG + fsm_out + xml2 + wordlist_out + xml3 + '\r\n' +
                        featureTag + '\r\n' +
                        xmlItem + '\r\n' +
                        xml4 + '\r\n' +
                        xmlSentence + '\r\n' +
                        xml5
                    slmsubtagFile = prjName + '-slm.xml'
                    await fs.writeFile(dir + slmsubtagFile, subtagSLM, 'utf8', function (err, data) {
                        if (err) console.log(err);
                        console.log("successfully " + firstsubTAG + " to file ");
                    });
                }
            }
            return "success'"
        } catch (err) {
            console.log(err);
        }
    }
    async processFile(req) {
        try {
            var x
            var mysheet = []
            const excelToJson = require('convert-excel-to-json');
            var path = require('path');
            // process file from req.body
            process.chdir(`${pathdev.parsed.baseHome}`);
            var filePath = path.resolve(`${pathdev.parsed.baseHomeupload}${req.body.file_name}`);
            console.log(filePath)
            // Convert to JSON
            const result = excelToJson({
                sourceFile: filePath
            });
            // get sheet to array
            for (x in result) {
                mysheet.push(x)
            }
            /* Excel Sheet List
                 0:"SLM"
                 1:"Train_NLU"
                 2:"slm_sub_tag"
                 3:"ssm_sub_tag"
                 4:"Concept"
                 5:"Test"
               */
            let dataname = []

           //  var prjName = "ais-civr"
            var resultPrj = {
                "project_id" : req.body.project_id
            }
          
            let getprjName = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(resultPrj))
                    .output('resultOut')
                    .execute(`${pathdev.parsed.database}.civr.sp_get_project_name`)
            })
            console.log(getprjName.recordset[0].project_name)
            var prjName = getprjName.recordset[0].project_gramm
            var prjName1 = getprjName.recordset[0].project_name




            dataname.push(prjName)
            var filessystem = require('fs');
            var fs = require("fs")
            var fsm_out = prjName + '-slm.fsm'
            var wordlist_out = prjName + '-slm.wordlist'
            var slmName = prjName + '-slm.xml'
            var ssmName = prjName + '-ssm.xml'
            var slmXML = ""
            var smmXML = ""
            var subtagSLM = ""
            var subtagSMM = ""
            var conceptXML = []
            var HgramarXML = ""
            var HgrammarName = ""

            // Start process XML File ------->

            
            
            //  Process SMM File -> return smmXML
            if (result[mysheet[1]].length > 0) {
                smmXML = await this.writeSSMxml(result[mysheet[1]], prjName, result[mysheet[4]])
            }



            // Make folder 
            var d = new Date();
            var date_format_str = d.getFullYear() +
                ("0" + (d.getMonth() + 1)).slice(-2) +
                ("0" + d.getDate()).slice(-2) +
                ("0" + d.getHours()).slice(-2) +
                ("0" + d.getMinutes()).slice(-2) +
                ("0" + d.getSeconds()).slice(-2)

            console.log(date_format_str);
            var build_result = {
                "project_id": req.body.project_id,
                "build_by": req.body.user_login,
                "file_name": req.body.file_name,
                "build_date": date_format_str,
                "message_error": "build process"
            }
            let version = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(build_result))
                    .output('resultOut')
                    .execute(`${pathdev.parsed.database}.civr.sp_update_build_grammar`)
            })
            console.log(version.recordset[0].version)

            const dir = `${pathdev.parsed.basebuildgrammar}`;

            if (!filessystem.existsSync(dir)) {
                filessystem.mkdirSync(dir);
            }

            const dirpre = dir + prjName1 + '/';
            if (!filessystem.existsSync(dirpre)) {
                filessystem.mkdirSync(dirpre);
            }


            const dirvernamepre = `${dirpre}${version.recordset[0].version}/`;
            if (!filessystem.existsSync(dirvernamepre)) {
                filessystem.mkdirSync(dirvernamepre);
            }

            require('child_process').exec(`cp ./master/SpeakFreelyConfig.dtd  ${dirvernamepre}`)
            // process.chdir(`${dirvernamepre}`);

            HgramarXML = "<?xml version='1.0' encoding='UTF-8'?>" + '\r\n' +
                '<grammar xml:lang="th-th" version="1.0"' + '\r\n' +
                'tag-format="swi-semantics/1.0"' + '\r\n' +
                'xmlns="http://www.w3.org/2001/06/grammar"' + '\r\n' +
                'mode="voice">' + '\r\n' +
                '<meta name="swirec_fsm_grammar" content="' + prjName + '-slm.fsm"/>' + '\r\n' +
                '<meta name="swirec_fsm_wordlist" content="' + prjName + '-slm.wordlist"/>' + '\r\n' +
                "<meta name='swirec_optimization' content='12'/>" + '\r\n' +
                '<semantic_interpretation xmlns="http://www.nuance.com/semantics" priority="1">' + '\r\n' +
                '<component>' + '\r\n' +
                '<interpreter uri="' + prjName + '-ssm.ssm" type="application/x-vnd.nuance.ssm"/>' + '\r\n' +
                '</component>' + '\r\n' +
                '</semantic_interpretation>' + '\r\n' +
                '</grammar>'
            HgrammarName = prjName + '.xml'

            // 0. Write Headgrammar Name
            fs.writeFile(dirvernamepre + HgrammarName, HgramarXML, 'utf8', function (err, data) {
                if (err) console.log(err);
                console.log("successfully Head Grammar  xml to file ");
            });
            console.log("pass")
            // 1.SLM File
            if (result[mysheet[0]].length > 0) {
                slmXML = await this.writeSLMxml2(result[mysheet[0]], prjName, dirvernamepre)
            }
            // 2. SMM File
            await fs.writeFile(dirvernamepre + ssmName, smmXML.first, 'utf8', function (err, data) {
                if (err) console.log(err);
                console.log("successfully ssmName xml to file ");
            });
            console.log("pass1")
            // 3. Concept File process
            if (result[mysheet[4]].length > 0) {
                conceptXML = await this.writeConceptXML(result[mysheet[4]], prjName, dirvernamepre)

            }
            // 4. Sub TAG File process
            if (result[mysheet[2]].length > 0) {
                subtagSLM = await this.writesubtag1(result[mysheet[2]], prjName, dirvernamepre)
                let arr = subtagSLM.split(",")
                arr.forEach((data) => {
                    dataname.push(data)
                })
            }
            console.log("pass2")
            // 5. Sub TAG File process
            if (result[mysheet[3]].length > 0) {
                subtagSMM = await this.writesubtag2(result[mysheet[3]], prjName, result[mysheet[4]], dirvernamepre)

            }
            console.log("pass3")

            var jsonInsertDB = {
                "project_id": req.body.project_id,
                "project_name" :prjName,
                "user_login": req.body.user_login,
                "nlu": smmXML.second,
                "ssm": subtagSMM,
                "concept": conceptXML
            }
            console.log('File test success')

            fs.writeFile(dirvernamepre + 'filetest.json', JSON.stringify(jsonInsertDB), 'utf8', function (err, data) {
                if (err) console.log(err);
                 
            });

            // Update process file 
            var resultProcess = {
                "project_id": req.body.project_id,
                "user_login": req.body.user_login,
                "file_name": req.body.file_name
            }

            let updateprocess = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(resultProcess))
                    .output('resultOut')
                    .execute(`${pathdev.parsed.database}.civr.sp_update_processfile`)
            })


            var resultProcessfile = {
                "project_id": req.body.project_id,
                "user_login": req.body.user_login,
                "file_name": req.body.file_name,
                "status": 2
            }
            let updateprocess2 = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(resultProcessfile))
                    .output('resultOut')
                    .execute(`${pathdev.parsed.database}.civr.sp_process_file`)
            })

            var result1 = {
                "code": 200,
                "msg": 'Write all XML success',
                "Intent": 0,
                "Entity": 0,
                "Sentence": 0
            }
            const data = await fs.readdirSync(dirvernamepre)
            let dataxml = []
            let dataslmxml = []
            let datassmxml = []
            for (let i = 0; i < dataname.length; i++) {
                for (let [key, value] of Object.entries(data)) {
                    if (value.indexOf(`${dataname[i]}.xml`) !== -1) {
                        dataxml.push(value);
                        continue
                    }
                    if (value.indexOf(`${dataname[i]}-slm.xml`) !== -1) {
                        dataslmxml.push(value);
                        continue
                    }
                    if (value.indexOf(`${dataname[i]}-ssm.xml`) !== -1) {
                        datassmxml.push(value);
                        continue
                    }
                }
            }

            for (let j = 0; j < dataxml.length; j++) {

                process.chdir(`${dirvernamepre}`);
                console.log("pass")
                console.log(j)
                console.log(datassmxml[j])
                require('child_process').exec(`source /app/Nuance/source_nuance ;ssm_train ${dirvernamepre}${datassmxml[j]}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error compile ssmName: ${error.message}`);
                        connectmssql.then((pool) => {
                            return pool.request().query(`update civr.tbl_upload_grammar set  message_error='compile fail ssmName:${datassmxml[j]}' where build_version ='${version.recordset[0].version}'`)
                        })
                        return
                    }
                    if (stderr) {
                        console.log(`stderr compile ssmName: ${stderr}`);

                    }
                    console.log(`stdout compile ssmName: ${stdout}`);
                    let found = stdout.indexOf(" SWI_SUCCESS| success|")
                    console.log("found ", found)
                    if (found > 0) {
                        sleep(10000);
                        require('child_process').exec(`source /app/Nuance/source_nuance ;sgc -train   ${dirvernamepre}${dataslmxml[j]}   -no_gram`, (error, stdout, stderr) => {
                            if (error) {
                                process.chdir(`${pathdev.parsed.baseHome}`);
                                console.log(`error compile slmName: ${error.message}`);
                                connectmssql.then((pool) => {
                                    return pool.request().query(`update civr.tbl_upload_grammar set  message_error='compile fail slmName:${dataslmxml[j]}' where build_version ='${version.recordset[0].version}'`)
                                })
                                return
                            }
                            if (stderr) {
                                console.log(`stderr compile slmName: ${stderr}`);
                            }
                            console.log(`stdout compile slmName: ${stdout}`);
                            let found1 = stdout.indexOf("sgc: Total compilation errors: 0")
                            console.log("found1 ", found1)
                            if (found1 > 0) {
                                require('child_process').exec(`source /app/Nuance/source_nuance ;sgc  ${dirvernamepre}${dataxml[j]} `, (error, stdout, stderr) => {
                                    if (error) {
                                        process.chdir(`${pathdev.parsed.baseHome}`);
                                        console.log(`error compile sgc: ${error.message}`);
                                        connectmssql.then((pool) => {
                                            return pool.request().query(`update civr.tbl_upload_grammar set  message_error='compile fail sgcName:${dataslmxml[j]}' where build_version ='${version.recordset[0].version}'`)
                                        })
                                        return
                                    }
                                    if (stderr) {
                                        console.log(`stderr compile xml: ${stderr}`);
                                    }
                                    console.log(`stdout compile xml: ${stdout}`);

                                    let found2 = stdout.indexOf("sgc: Total compilation errors: 0")
                                    console.log("found2 ", found2)
                                    if (found2 > 0) {
                                        connectmssql.then((pool) => {
                                            return pool.request().query(`update civr.tbl_upload_grammar set  message_error='compile grammar success',status=3 where build_version ='${version.recordset[0].version}'`)
                                        })
                                        //if(j == 0){
                                        //          let params = { 
                                        //	"build_id": `${version.recordset[0].version}`,																																
                                        //     "grammar":dirvernamepre.replace('.', ''),
                                        //    "excel_file": pathdev.parsed.baseHomeupload+ req.body.file_name
                                        //   }
                                        //    axios.post(`${pathdev.parsed.urlscript}`, params)
                                        //   .then(res => {
                                        //        console.log("success")
                                        //         connectmssql.then((pool) => {
                                        //            return pool.request().query(`update civr.tbl_upload_grammar set  message_error='test  Process' where build_version ='${version.recordset[0].version}'`)

                                        //                          })	                                              
                                        //    })
                                        //    .catch(err => {                                               
                                        //       console.error("error port" + err);

                                        //      })

                                        //}
                                    }
                                })


                            }
                        })
                    }

                })
            }
            connectmssql.then((pool) => {
                return pool.request().query(`update civr.tbl_upload_grammar set  status='2',message_error='compile grammar process',full_patch='${dirvernamepre.replace('.', '')}' where build_version ='${version.recordset[0].version}'`)
            })
        
            // Insert tbl_sentent_test Lastupdate 29-Jan-2021  13:00~~~~~~~~~~~~~~~~~~~~~~~~~
            // -- --------------------------------------------------
            async function insertDB(req) {
                try {
                    let insert =  await connectmssql.then((pool) => {
                        return pool.request()
                            .input('jsoninput', JSON.stringify(req))
                            .output('result')
                            .execute(`${pathdev.parsed.database}.civr.sp_insert_file_test`)
                    })
                    console.log(insert.recordsets)
                    var now = new Date();
                    console.log(now.toUTCString());
                    return insert.recordsets

                } catch (err) {
                    console.log(err)
                }
            }
          
            let insert = await insertDB(jsonInsertDB)



           // console.log(insert)
            // -----------------------------------------------------

            var result1 = {
                "code": 200,
                "msg": "build success",
                "insert_status" : "",//insert[0][0].result,
                "NLU" : "",//insert[1][0].NLU,
                "SSM" : ""//insert[2][0].SSM

            }
            console.log(result1)
            return result1


        } catch (err) {
            console.log(err);
        }

    }



    async getgrammardeploy(req) {
        try {
            let data = []
            const rows = await this.DBRepository.executeQuery("call sp_get_grammar_deploy(?,@dt1); ", [JSON.stringify(req)]);
            console.log(rows)
            for (let [key, value] of rows[0].entries()) {
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
                    }, {
                        "column_name": "create Date",
                        "column_field": "create_time",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "create by",
                        "column_field": "create_by",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "Description",
                        "column_field": "build_desc",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "Version",
                        "column_field": "deploy_version",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "Description Deploy",
                        "column_field": "deploy_desc",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
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


    async adddatadeploy(req) {
        try {
            let data = []
            const rows = await this.DBRepository.executeQuery("call sp_get_grammar_build(?,@dt1);", JSON.stringify(req))
            console.log(rows)
            for (let [key, value] of rows[0].entries()) {
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
                    }, {
                        "column_name": "build version",
                        "column_field": "build_version",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "build date",
                        "column_field": "build_date",
                        "column_type": "text",
                        "column_align": "left"
                    }, {
                        "column_name": "build description",
                        "column_field": "build_desc",
                        "column_type": "text",
                        "column_align": "left"
                    }],
                    "data": data
                }
            }
            return resultJson
        } catch (err) {
            log.error("response Data adddatadeploy:", err)
        }
    }

    async sumbitatadeploy(req) {
        try {
            const rows = await this.DBRepository.executeQuery("call sp_add_grammar_deploy(?,@dt1)", JSON.stringify(req))
            let resultJson
            resultJson = {
                "result": rows[0][0].result,
                "msg": rows[0][0].msg,
            }
            return resultJson
        } catch (error) {

        }
    }
    async deployactive(req) {
        try {
            const rows = await this.DBRepository.executeQuery("call sp_update_grammar_deploy(?,@dt1)", JSON.stringify(req))
            let resultJson
            resultJson = {
                "result": rows[0][0].result,
                "msg": rows[0][0].msg,
            }

            let filessystem = require('fs');
            if (req.pro_active == 1 || req.pre_active == 1) {
                let json1 = {
                    "project_id": req.project_id,
                    "build_version": req.build_version
                }
                const rows2 = await this.DBRepository.executeQuery("call sp_update_deploy_schedule (?,@rt)", JSON.stringify(json1))
                var builddir = './deploygrammar/';
                if (!filessystem.existsSync(builddir)) {
                    filessystem.mkdirSync(builddir);
                }
                let dirproject = './deploygrammar/' + rows2[0][0].project_name;
                if (!filessystem.existsSync(dirproject)) {
                    filessystem.mkdirSync(dirproject);
                }
                let dirpre = './deploygrammar/' + rows2[0][0].project_name + '/pre/';
                if (!filessystem.existsSync(dirpre)) {
                    filessystem.mkdirSync(dirpre);
                }
                let dirpro = './deploygrammar/' + rows2[0][0].project_name + '/pro/';
                if (!filessystem.existsSync(dirpro)) {
                    filessystem.mkdirSync(dirpro);
                }

                if (req.pre_active == 1) {
                    filessystem.copyFile('.' + rows2[0][0].full_patch, dirpro + rows2[0][0].project_name + "-" + pathdev.parsed.namegram + ".gram", (err) => {
                        if (err) throw err;
                        console.log(' copy file pre success');
                    });
                }
                if (req.pro_active == 1) {
                    filessystem.copyFile('.' + rows2[0][0].full_patch, dirpro + rows2[0][0].project_name + "-" + pathdev.parsed.namegram + ".gram", (err) => {
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
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const uploadgrammarService = new UploadgrammarService;
module.exports = uploadgrammarService;