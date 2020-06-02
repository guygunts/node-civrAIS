const DBRepository = require('../repositories/DBRepository');
class ReportService {
    constructor() {
        this.DBRepository = new DBRepository();
    }
    async ServiceReport(req) {
        try {
            const Service = await this.DBRepository.executeQuery("call sp_service_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
            console.log(Service)
            let sub_menu = []
            let result = []
            let length = Service.length;
            let columnName = ''
            let arrcolumnName
            let column = []
            let columns = []
            if (length !== 0) {

                for (let i = 0; i < Service[1].length; i++) {
                    const item = {
                        "msg": Service[1][i].msg,
                        "pagenum": Service[1][i].page_num,
                        "recnum": Service[1][i].rec_num,
                        "code": Service[1][i].result
                    }
                    columnName += Service[1][i].columnName
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                for (let i = 0; i < Service.length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }
                    for (let j = 0; j < Service[0].length; j++) {
                        const item = {
                            "date_time": Service[i][j].date_time,
                            "service_name": Service[i][j].service_name,
                            "total_call": Service[i][j].total_call,
                            "recog": Service[i][j].recog,
                            "non_recog": Service[i][j].non_recog,
                            "per_accuracy": Service[i][j].per_accuracy,

                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(Service[i][j])) {
                                column.push(key)

                            }
                        }

                        sub_menu.push(item);
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
                "report_name:": "Service Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
			
            return resultJson;
        } catch (err) {

        }
    }

    async AccuracyReport(req) {
        try {
            const Acuracy = await this.DBRepository.executeQuery("call sp_accuracy_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
            let sub_menu = []
            let result = []
            let length = Acuracy.length;
            let column = []
            let columns = []
            let columnName = ''
            let arrcolumnName
            if (length !== 0) {
                for (let i = 0; i < Acuracy[1].length; i++) {
                    const item = {
                        "msg": Acuracy[1][i].msg,
                        "pagenum": Acuracy[1][i].page_num,
                        "recnum": Acuracy[1][i].rec_num,
                        "code": Acuracy[1][i].result
                    }
                    columnName += Acuracy[1][i].columnName
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                for (let i = 0; i < Acuracy.length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }
                    for (let j = 0; j < Acuracy[0].length; j++) {
                        const item = {
                            "date_time": Acuracy[i][j].date_time,
                            "total_call": Acuracy[i][j].total_call,
                            "recog": Acuracy[i][j].recog,
                            "non_recog": Acuracy[i][j].non_recog,
                            "per_accuracy": Acuracy[i][j].per_accuracy,


                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(Acuracy[i][j])) {
                                column.push(key)

                            }
                        }

                        sub_menu.push(item);
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
                "report_name:": "Accuracy Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
			
            return resultJson;
        } catch (err) {

        }
    }
    async EventReport(req) {
        try {
            const Event = await this.DBRepository.executeQuery("call sp_service_tag_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
            let sub_menu = []
            let result = []
            let length = Event.length;
            let arrcolumnName
            let columnName = ''
            let column = []
            let columns = []
            if (length !== 0) {
                

                    for (let i = 0; i < Event[1].length; i++) {
                        const item = {
                            "msg": Event[1][i].msg,
                            "pagenum": Event[1][i].page_num,
                            "recnum": Event[1][i].rec_num,
                            "code": Event[1][i].result
                        }
                        columnName += Event[1][i].columnName
                        result.push(item)
                    }
                    arrcolumnName = columnName.split(',')
                    for (let i = 0; i < Event.length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }
                
                    for (let j = 0; j < Event[0].length; j++) {
                        const item = {
                            "date_time": Event[i][j].date_time,
                            "tag_name": Event[i][j].tag_name,
                            "total_call": Event[i][j].total_call,
                            "recog": Event[i][j].recog,
                            "non_recog": Event[i][j].non_recog,
                            "per_accuracy": Event[i][j].per_accuracy,

                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(Event[i][j])) {
                                column.push(key)

                            }
                        }

                        sub_menu.push(item);
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
                "report_name:": "Event Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
			
            return resultJson;
        } catch (err) {

        }
    }
    async TopTenReport(req) {
        try {
            const TOP = await this.DBRepository.executeQuery("call sp_service_top_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
            console.log(TOP)
            let sub_menu = []
            let result = []
            let length = TOP.length;
            let arrcolumnName
			let arrcolumnData
            let columnName = ''
			let columnData = ''
            let column = []
            let columns = []
            if (length !== 0) {
                for (let i = 0; i < TOP[1].length; i++) {
                    const item = {
                        "msg": TOP[1][i].msg,
                        "pagenum": TOP[1][i].page_num,
                        "recnum": TOP[1][i].rec_num,
                        "code": TOP[1][i].result
                    }
                    columnName += TOP[1][i].columnName
					columnData +=TOP[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
				arrcolumnData = columnData.split(',')

                for (let i = 0; i < TOP.length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }
                    for (let j = 0; j < TOP[0].length; j++) {
                        const item = {
                            "service_name": TOP[i][j].service_name,
                            "total_call": TOP[i][j].total_call,
                            "recog": TOP[i][j].recog,
                            "non_recog": TOP[i][j].non_recog,
                            "per_accuracy": TOP[i][j].per_accuracy
                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(TOP[i][j])) {
                                column.push(key)

                            }
                        }
                        sub_menu.push(item);
                    }

                }
            } else {
                sub_menu = [{}]
            }

	                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data':  arrcolumnData[e]
                        }
                        columns.push(items)
                    }

            let resultJson = {
                "report_name:": "TopTen Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
			
            return resultJson;
        } catch (err) {

        }
    }
    async UsageReport(req) {
        try {
            const Usage = await this.DBRepository.executeQuery("call sp_service_usage_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
            let sub_menu = []
            let result = []
            let length = Usage.length;
            let arrcolumnName
            let columnName = ''
            let column = []
            let columns = []
            if (length !== 0) {
                for (let i = 0; i < Usage[1].length; i++) {
                    const item = {
                        "msg": Usage[1][i].msg,
                        "pagenum": Usage[1][i].page_num,
                        "recnum": Usage[1][i].rec_num,
                        "code": Usage[1][i].result
                    }
                    columnName += Usage[1][i].columnName
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                for (let i = 0; i < Usage.length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }
                    for (let j = 0; j < Usage[0].length; j++) {
                        const item = {
                            "date_time": Usage[i][j].date_time,
                            "service_name": Usage[i][j].service_name,
                            "total_call": Usage[i][j].total_call,
                            "tt_sec_to_time": Usage[i][j].tt_sec_to_time
                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(Usage[i][j])) {
                                column.push(key)

                            }
                        }
                        sub_menu.push(item);
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
                "report_name:": "Usage Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
			
            return resultJson;
        } catch (err) {

        }
    }
    async PerformanceReport(req) {
        try {
            const Performance = await this.DBRepository.executeQuery("call sp_performance_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
            console.log(Performance)
            let sub_menu = []
            let result = []
            let length = Performance.length;
            let arrcolumnName
            let column = []
            let columns = []
            let columnName = ''
            if (length !== 0) {
                for (let i = 0; i < Performance[1].length; i++) {
                    const item = {
                        "msg": Performance[1][i].msg,
                        "pagenum": Performance[1][i].page_num,
                        "recnum": Performance[1][i].rec_num,
                        "code": Performance[1][i].result
                    }
                    columnName += Performance[1][i].columnName
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                for (let i = 0; i < Performance.length; i++) {
                    if (sub_menu.length !== 0) {
                        break;
                    }
                    for (let j = 0; j < Performance[0].length; j++) {
                        const item = {
                            "date_time": Performance[i][j].date_time,
                            "peak": Performance[i][j].peak,
                            "peak_ep": Performance[i][j].peak_ep,
                            "peak_rec": Performance[i][j].peak_rec,
                            "ports": Performance[i][j].ports,
                            "over_draff": Performance[i][j].over_draff,
                            "minutes": Performance[i][j].minutes,
                            "avg_port": Performance[i][j].avg_port,
                        }
                        if (column.length == 0) {
                            for (const [key, value] of Object.entries(Performance[i][j])) {
                                column.push(key)

                            }
                        }
                        sub_menu.push(item);
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
                "report_name:": "Performance Report",
                "columns_name": columns,
                "recs": sub_menu,
                "result": result
            };
			
            return resultJson;
        } catch (err) {

        }
    }
    async summaryQReport(req) {
        try {
            const voiceQC = await this.DBRepository.executeQuery("call sp_summary_qc_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
          //  console.clear()
          //  console.log(voiceQC[1])
           // return
            let sub_menu = []
            let result = []
            let length = voiceQC.length;
            let arrcolumnName
            let column = []
            let columns = []
            let columnName = ''
            let projectName
            let custName = ''
            var d = new Date();
            let month_names = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            var date_report = ("0" + d.getDate()).slice(-2) + '-' +
                month_names[d.getMonth()] + '-' + d.getFullYear()
            var date_start_test     
            var p1 = 0
            var p2 = 0
            var p3 = 0
            var p4 = 0

            if (length !== 0) {
                // Result
                for (let i = 0; i < voiceQC[3].length; i++) {
                    const item = {
                        "msg": voiceQC[3][i].msg,
                        "pagenum": voiceQC[3][i].page_num,
                        "recnum": voiceQC[3][i].rec_num,
                        "code": voiceQC[3][i].result

                    }
                    projectName = voiceQC[3][i].project_name
                    custName = voiceQC[3][i].customerName
                    columnName += voiceQC[3][i].columnName
                    result.push(item)
                }
                // Column
                arrcolumnName = columnName.split(',')
                // Data Table 1
                for (let j = 0; j < voiceQC[0].length; j++) {
                    const item = {
                        "Intent": voiceQC[0][j].intent,
                        "Pass%": voiceQC[0][j].per_pass,
                        "Pass": voiceQC[0][j].pass,
                        "Fail": voiceQC[0][j].fail,
                        "Garbage": voiceQC[0][j].garbage,
                        "Other": voiceQC[0][j].other,
                        "Valid": voiceQC[0][j].valid,
                        "Totalcall": voiceQC[0][j].totalcall
                    }
                    sub_menu.push(item);
                    if (voiceQC[0][j].per_pass <= 49.99) {
                        p1 += 1
                    }
                    if (voiceQC[0][j].per_pass >= 50 && voiceQC[0][j].per_pass <= 69.99) {
                        p2 += 1
                    }
                    if (voiceQC[0][j].per_pass >= 70 && voiceQC[0][j].per_pass <= 84.99) {
                        p3 += 1
                    }
                    if (voiceQC[0][j].per_pass >= 85) {
                        p4 += 1
                    }
                }

            } else {
                sub_menu = [{}]
            }
           // var tt = (p1+p2+p3+p4)
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': column[e]
                }
                columns.push(items)
            }
            date_start_test =  voiceQC[1][0].date_start.toUpperCase()
            let grandTotal = [{
                    "Intent": "Total"
                },
                {
                    "Pass%": voiceQC[1][0].per_pass
                },
                {
                    "Pass": voiceQC[1][0].pass
                },
                {
                    "Fail": voiceQC[1][0].fail
                },
                {
                    "Garbage": voiceQC[1][0].garbage
                },
                {
                    "Other": voiceQC[1][0].other
                },
                {
                    "Valid": voiceQC[1][0].valid
                },
                {
                    "Totalcall": voiceQC[1][0].totalcall
                }
            ]

            let pipechart = [
                {"caption" :"Call Result"},
                {
                    "Pass": [{
                            "call": voiceQC[2][0].pass
                        },
                        {
                            "%": voiceQC[2][0].per_pass
                        }
                    ]
                },
                {
                    "Fail": [{
                            "call": voiceQC[2][0].fail
                        },
                        {
                            "%": voiceQC[2][0].per_fail
                        }
                    ]
                },
                {"Garbage": [{
                            "call": voiceQC[2][0].garbage
                        },
                        {
                            "%": voiceQC[2][0].per_garbage
                        }
                    ]
                },  {"Other": [{
                    "call": voiceQC[2][0].other
                },
                {
                    "%": voiceQC[2][0].per_other
                }
            ]
        }
            ]
           
            let summary1 = [{
                    "Total_calls": voiceQC[1][0].totalcall
                },
                {
                    "Valid_calls": voiceQC[1][0].valid
                },
                {
                    "Passed_calls": voiceQC[1][0].pass
                },
                {
                    "Accuary": voiceQC[1][0].per_pass + '%'
                }
            ]
            
            let barchart = [
                {"caption" : "Intent Count by Accuracy"},
                {"0-49%" : p1},
                {"50-69%" : p2},
                {"70-84%" : p3},
                {"85-100%" : p4},
            ]
            
            let resultJson = {
                "report_name:": "Accuray Test Report",
                "Customer": custName,//req.body.user_login,
                "Project": projectName,
                "Test_Start_Date":  date_start_test,
                "Report_Date": date_report,
                "Summary": summary1,
                "column_name": columns,
                "recs": sub_menu,
                "grand_total": grandTotal,
                "pipechart": pipechart,
                "barchart" :barchart,
                "result": result
            };
            return resultJson;
        } catch (err) {}
    }
}
const report = new ReportService;
module.exports = report;