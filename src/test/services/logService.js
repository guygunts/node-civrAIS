let SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
const sql = require('mssql')
const config = {
    user: 'sa',
    password: 'P@ssw0rd',
    server: '127.0.0.1',
    database: 'civrtst',
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    encrypt: false,
    options:{ enableArithAbort :true,
        trustedConnection: true,
        useUTC:true}
}
const pool2 = new sql.ConnectionPool(config)
const pool2Connect = pool2.connect()
class LogService {

    async InsertLog(req) {
        try {
            console.log(req)
            
            var parseString = require('xml2js').parseString;
            var Log = req
            var st_date = ""
            var end_date = ""
            var logName = ""
            var rstt = ""
            var spoke = ""
            var conf = ""
            var xmlResult = ""
            var actgramm = ""
            var vname = ""
            var intenName = ""
            var intent = []
            var grammar = []
            var total_trans = 0
            var recog = 0
            var nonrecog = 0
            var chnn = ""
            var date_rec = ""
            var lang = ''
            var SWI_meaning = ''
            var SWI_ssmMeanings = ''
            var SWI_ssmConfidences = ''
            var grammar_ver = ''
            var inputConf = ''
            var intentConf = ''
            // var arr = Log.split('\r\n');
            var arr = Log.split('\n');
            // console.log(arr.length)
            for (var i = 0; i < arr.length; i++) {

                if (i > 0) {
                    var Line = arr[i]
                    var rec = Line.split("|");

                    if (rec[2] === 'EVNT=SWIrcnd') {
                        total_trans = total_trans + 1
                        if (rec[3] === 'RSTT=ok' || rec[3] === 'RSTT=Lowconf') {
                            recog = recog + 1
                            chnn = rec[1]
                            date_rec = rec[0].substring(5)
                            if (rec.length > 20) {
                                if (rec[20].substring(0, 4) === 'WVNM') {
                                    vname = rec[20].substring(5)
                                } else {
                                    vname = rec[21].substring(5)
                                }
                                /*
                                RSLT={action:INFORM object:PROBLEM_WITHDRAWAL entity:NULL intent:INFORM-PROBLEM_WITHDRAWAL
                                RSLT={R_CONFIRM:YES answer:YES}    
                                RSLT={ENTITY_A:GOVCARD ENTITY_B:NULL INTENTION:ENQUIRE_CARD-GOVCARD}
                                RSLT={CARD_TYPES:DEBIT_MASTER}
                                */
                                var rslt = rec[7].substring(6, 12)
                                if (rslt === 'ENTITY') {
                                    var rec3 = rec[7].split(" ")
                                    intenName = rec3[2].substring(10)
                                    intenName = intenName.replace("}", "")
                                } else if (rslt === 'action') {
                                    var rec3 = rec[7].split(" ")
                                    intenName = rec3[3].substring(7)
                                    intenName = intenName.replace("}", "")
                                } else {
                                    intenName = rec[7].substring(5)
                                    intenName = intenName.replace("{", "")
                                    intenName = intenName.replace("}", "")
                                }
                                if (intenName.substring(0, 9) === 'R_CONFIRM') {
                                    intenName = intenName.substring(0, 13).trim()
                                }
                                if (actgramm === 'digits.gram' || actgramm === 'date.gram') {
                                    intenName = actgramm
                                }
                                spoke = rec[8].substring(5)
                                rstt = rec[3].substring(5)
                                conf = rec[12].substring(5)
                            } else {
                                if (rec.length > 8) {
                                    spoke = rec[8].substring(5)
                                    rstt = rec[3]
                                }
                            }
                        }
                        /*else {
                            nonrecog = nonrecog + 1
                            const item = {
                                "act_grammar": actgramm,
                                "spok": "",
                                "rstt": rec[3],
                                "intent": "",
                                "voice_name": "",
                                "recog": 0
                            }
                            intent.push(item)
                        }
                        */
                    } else if (rec[2] === 'EVNT=SWIgrld') {
                        if (rec[3] === 'API=SWIrecGrammarActivate') {
                            var arr_gram = rec[5].split('/')
                            actgramm = arr_gram[arr_gram.length - 1]
                            grammar_ver = arr_gram[arr_gram.length - 2]
                            /*
                            const item = {
                                "grammar": arr_gram[5],
                                "grammar_ver" : arr_gram[4]
                            }
                            grammar.push(item)
                            */
                        } else {}
                    } else if (rec[2] === 'EVNT=SWIfrmt') {
                        if (st_date === "") {
                            st_date = rec[0].substring(5)
                        }
                    } else if (rec[2] === 'EVNT=SWIclnd') {
                        end_date = rec[0].substring(5)
                    } else if (rec[2] === 'EVNT=SWIrslt') {
                        xmlResult = rec[4].substring(6)
                        parseString(xmlResult, function (err, result1) {
                            //  console.dir(result1);
                            try {
                                inputConf = parseFloat(result1.result.interpretation[0].$.confidence) * 100
                            } catch (err) {}
                            try {
                                intentConf = parseFloat(result1.result.interpretation[0].instance[0].INTENTION[0].$.confidence) * 100
                            } catch (err) {}
                            try {
                                SWI_meaning = result1.result.interpretation[0].instance[0].SWI_meaning[0]
                            } catch (err) {}
                            try {
                                SWI_ssmMeanings = result1.result.interpretation[0].instance[0].SWI_ssmMeanings[0].INTENTION[0]
                            } catch (err) {}
                            try {
                                SWI_ssmConfidences = result1.result.interpretation[0].instance[0].SWI_ssmConfidences[0].INTENTION[0]
                            } catch (err) {}
                        });

                        const item = {
                            "date_time": date_rec,
                            "chnn": chnn.substring(5),
                            "act_grammar": actgramm,
                            "ver_grammar": grammar_ver,
                            "lang": lang,
                            "spok": spoke,
                            "rstt": rstt,
                            "intent": intenName,
                            "voice_name": vname,
                            "conf": conf,
                            "xml": xmlResult,
                            "recog": 1,
                            "n1": SWI_meaning,
                            "n2": SWI_ssmMeanings,
                            "n3": SWI_ssmConfidences,
                            "cf1": inputConf,
                            "cf2": intentConf
                        }
                        intent.push(item)
                        rstt = ""
                        spoke = ""
                        conf = ""
                        xmlResult = ""
                        actgramm = ""
                        vname = ""
                        intenName = ""
                        lang = ""
                        SWI_meaning = ''
                        SWI_ssmMeanings = ''
                        SWI_ssmConfidences = ''
                        grammar_ver = ''
                        inputConf = ''
                        intentConf = ''
                        // grammar =[]
                    } else if (rec[2] === 'EVNT=SWIrcst') {
                        lang = rec[7].substring(5)
                    }
                } else {
                    logName = arr[0]
                }
            }

            //console.log(logName)

            var result = {
                "log_file": logName,
                "start_date": st_date,
                "end_date": end_date,
                "report": intent,
                "total_trans": total_trans,
                "recog": recog,
                "nonrecog": nonrecog
            }
            //  console.log(result.report)
            //   return
            if (recog > 0) {
                const insert = await this.DBRepository.executeQuery("call sp_insert_log_report2(?,@result);", [JSON.stringify(result)])
                return insert;
            } else {
                var result2 = {
                    "code": 200,
                    "msg": 'success'
                }
                return result2
            }

        } catch (err) {
            console.log(err)
            return err
        }

    }

    async updatevoice(req) {
        try {
            const status = await this.DBRepository.executeQuery("call sp_update_voice_qc(?,@dt1);SELECT @dt1 as result", [JSON.stringify(req.body)])
            let item = []
            for (let i = 0; i < status[0].length; i++) {
                item = {
                    "code": status[0][i].result,
                    "msg": status[0][i].msg

                }
            }
            return item


        } catch (err) {
            return err;
        }

    }

    async getconversation(req) {
        try {
            let conver= await   pool2Connect.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute('civrtst.civr.sp_getconversation')
            })
            console.log(conver)
            let length = conver.recordsets[0].length;
            var sub_menu = []
            let result = []
            let column = []
            let columns = []
            let columnsName = ''
            let arrcolumnName
            if (length !== 0) {
                for (let j = 0; j < conver.recordsets[1].length; j++) {
                    const item = {
                        "msg": conver.recordsets[1][j].msg,
                        "pagenum": conver.recordsets[1][j].page_num,
                        "recnum": conver.recordsets[1][j].rec_num,
                        "code": conver.recordsets[1][j].result
                    }
                    columnsName = conver.recordsets[1][j].columname
                    result.push(item)
                }
                arrcolumnName = columnsName.split(',')
                for (let i = 0; i < conver.recordsets[0].length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }

                    for (let j = 0; j < conver.recordsets[0].length; j++) {

                        if(sub_menu.length == conver.recordsets[0].lengt){
                            break
                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(conver.recordsets[i][j])) {
                                column.push(key)

                            }
                        }

                        sub_menu.push(conver.recordsets[0]);
                    }
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': column[e]
                        }
                        columns.push(items)
                    }
                }
            } else {
                sub_menu = [{}]
            }

            let resultJson = {
                "report_name": "conversation Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
            console.log(resultJson)
            return resultJson;
        } catch (err) {
            console.log(err);
        }


    }

    async logdetail(req) {
        try {
            let logdetail= await   pool2Connect.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute('civrtst.civr.sp_getlog_detail')
            })
            let sub_menu = []
            let length = logdetail.recordsets[0].length;
            let result = []
            let column = []
            let columns = []
            let columnsName = ''
            let arrcolumnName
            if (length !== 0) {
                for (let j = 0; j < logdetail.recordsets[1].length; j++) {
                    const item = {
                        "msg": logdetail.recordsets[1][j].msg,
                        "pagenum": logdetail.recordsets[1][j].page_num,
                        "recnum": logdetail.recordsets[1][j].rec_num,
                        "code": logdetail.recordsets[1][j].result
                    }
                    columnsName = logdetail.recordsets[1][j].columname
                    result.push(item)
                }
                arrcolumnName = columnsName.split(',')

                    for (let j = 0; j < logdetail.recordsets[0].length; j++) {
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(logdetail.recordsets[j])) {
                                column.push(key)

                            }
                        }

                        sub_menu.push(logdetail.recordsets[0]);
                    }
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': column[e]
                        }
                        columns.push(items)
                    }
                
            } else {
                sub_menu = [{}]
            }

            let resultJson = {
                "report_name": "LogDetail Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result

            };
            return resultJson;
        } catch (err) {

        }
    }

    async logvoice(req) {
        try {
            let logvoice= await   pool2Connect.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req.body))
                .output('resultOUT')
                .execute('civrtst.civr.sp_getlog_voice')
            })
            console.log(logvoice)
            var sub_menu = []
            let length = logvoice.recordsets[0].length;
            let result = []
            let column = []
            let columns = []
            let columnsName = ''
            let arrcolumnName
            if (length !== 0) {
                for (let j = 0; j < logvoice.recordsets[1].length; j++) {
                    const item = {
                        "msg": logvoice.recordsets[1][j].msg,
                        "pagenum": logvoice.recordsets[1][j].page_num,
                        "recnum": logvoice.recordsets[1][j].rec_num,
                        "code": logvoice.recordsets[1][j].result
                    }
                    columnsName = logvoice.recordsets[1][j].columname
                    result.push(item)
                }
                arrcolumnName = columnsName.split(',')
                
                    for (let j = 0; j < logvoice.recordsets[0].length; j++) {
                        // const item = {
                        //     "date_time": logvoice[i][j].date_time,
                        //     "log_file": logvoice[i][j].log_file,
                        //     "chnn": logvoice[i][j].chnn,
                        //     "voice_name": logvoice[i][j].voice_name,
                        //     "grammar": logvoice[i][j].grammar,
                        //     "spok": logvoice[i][j].spok,
                        //     "rstt_status": logvoice[i][j].rstt_status,
                        //     "intent": logvoice[i][j].intent,

                        // }
                        if(sub_menu.length == logvoice.recordsets[0].length){
                            break
                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(logvoice.recordsets[0][j])) {
                                column.push(key)

                            }
                        }

                        sub_menu.push(logvoice.recordsets[0]);
                    }
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': column[e]
                        }
                        columns.push(items)
                    }
                
            } else {
                sub_menu = [{}]
            }

            let resultJson = {
                "report_name": "LogVoice Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }

    async summaryqc(req) {
        let data =[]
        try{
            const summaryqc =await this.DBRepository.executeQuery("call sp_summary_qc_report(?,@result);SELECT @result as result",[JSON.stringify(req)]);

            console.log(summaryqc)
            for(let [key, value] of summaryqc[0].entries()){

                data.push(value)
        }
        return data;
        }catch (err) {
            console.log(err)
        }

    }


}
const logservice = new LogService();
module.exports = logservice;