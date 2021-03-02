const connectmssql=require('../MssqlDatabase')
const pathdev=require('dotenv').config({ path: './config/dev.env' });
class ReportService {
 
    async ServiceReport(req) {
        try {
            let Service= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_service_report`)
            })
            let result = []
            let columnName = ''
            let arrcolumnName
            let columndata = ''
            let arrcolumndata

            let columns = []

                for (let i = 0; i < Service.recordsets[1].length; i++) {
                    const item = {
                        "msg": Service.recordsets[1][i].msg,
                        "pagenum": Service.recordsets[1][i].page_num,
                        "recnum": Service.recordsets[1][i].rec_num,
                        "code": Service.recordsets[1][i].result
                    }
                    columnName = Service.recordsets[1][i].columnData
                    columndata = Service.recordsets[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                arrcolumndata = columndata.split(',')


                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': arrcolumndata[e]
                        }
                        columns.push(items)
                    }

            let resultJson = {
                "report_name:": "Service Report",
                "columns_name": columns,
                "recs": Service.recordsets[0],
                "result": result
            };
			
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }

    async AccuracyReport(req) {
        try {
            let Acuracy= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_accuracy_report`)
            })
            let result = []
            let columns=[]
            let columnName = ''
            let arrcolumnName
            let columndata = ''
            let arrcolumndata
            
                for (let i = 0; i < Acuracy.recordsets[1].length; i++) {
                    const item = {
                        "msg": Acuracy.recordsets[1][i].msg,
                        "pagenum": Acuracy.recordsets[1][i].page_num,
                        "recnum": Acuracy.recordsets[1][i].rec_num,
                        "code": Acuracy.recordsets[1][i].result
                    }
                    columnName = Acuracy.recordsets[1][i].columnName
                    columndata = Acuracy.recordsets[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                arrcolumndata = columndata.split(',')
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': arrcolumndata[e]
                        }
                        columns.push(items)
                    }



            let resultJson = {
                "report_name:": "Accuracy Report",
                "columns_name": columns,
                "recs": Acuracy.recordsets[0],
                "result": result
            };
			
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }
    async EventReport(req) {
        try {
            let Event= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_service_tag_report`)
            })
            let result = []
            let columns=[]
            let columnName = ''
            let arrcolumnName
            let columndata = ''
            let arrcolumndata
            
                for (let i = 0; i < Event.recordsets[1].length; i++) {
                    const item = {
                        "msg": Event.recordsets[1][i].msg,
                        "pagenum": Event.recordsets[1][i].page_num,
                        "recnum": Event.recordsets[1][i].rec_num,
                        "code": Event.recordsets[1][i].result
                    }
                    columnName = Event.recordsets[1][i].columnName
                    columndata = Event.recordsets[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                arrcolumndata = columndata.split(',')
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': arrcolumndata[e]
                        }
                        columns.push(items)
                    }



            let resultJson = {
                "report_name:": "Event Report",
                "columns_name": columns,
                "recs": Event.recordsets[0],
                "result": result
            };
			
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }
    async TopTenReport(req) {
        try {
            let TopTen= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_service_top_report`)
            })
            let result = []
            let columns=[]
            let columnName = ''
            let arrcolumnName
            let columndata = ''
            let arrcolumndata
            
                for (let i = 0; i < TopTen.recordsets[1].length; i++) {
                    const item = {
                        "msg": TopTen.recordsets[1][i].msg,
                        "pagenum": TopTen.recordsets[1][i].page_num,
                        "recnum": TopTen.recordsets[1][i].rec_num,
                        "code": TopTen.recordsets[1][i].result
                    }
                    columnName = TopTen.recordsets[1][i].columnName
                    columndata = TopTen.recordsets[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                arrcolumndata = columndata.split(',')
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': arrcolumndata[e]
                        }
                        columns.push(items)
                    }



            let resultJson = {
                "report_name:": "TopTen Report",
                "columns_name": columns,
                "recs": TopTen.recordsets[0],
                "result": result
            };
			
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }
    async UsageReport(req) {
        try {
            let usage= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_service_usage_report`)
            })
            let result = []
            let columns=[]
            let columnName = ''
            let arrcolumnName
            let columndata = ''
            let arrcolumndata
            
                for (let i = 0; i < usage.recordsets[1].length; i++) {
                    const item = {
                        "msg": usage.recordsets[1][i].msg,
                        "pagenum": usage.recordsets[1][i].page_num,
                        "recnum": usage.recordsets[1][i].rec_num,
                        "code": usage.recordsets[1][i].result
                    }
                    columnName = usage.recordsets[1][i].columnName
                    columndata = usage.recordsets[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                arrcolumndata = columndata.split(',')
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': arrcolumndata[e]
                        }
                        columns.push(items)
                    }



            let resultJson = {
                "report_name:": "Usage Report",
                "columns_name": columns,
                "recs": usage.recordsets[0],
                "result": result
            };
			
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }
    async PerformanceReport(req) {
        try {
            let Performance= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_performance_report`)
            })
            let result = []
            let columns=[]
            let columnName = ''
            let arrcolumnName
            let columndata = ''
            let arrcolumndata
            
                for (let i = 0; i < Performance.recordsets[1].length; i++) {
                    const item = {
                        "msg": Performance.recordsets[1][i].msg,
                        "pagenum": Performance.recordsets[1][i].page_num,
                        "recnum": Performance.recordsets[1][i].rec_num,
                        "code": Performance.recordsets[1][i].result
                    }
                    columnName = Performance.recordsets[1][i].columnName
                    columndata = Performance.recordsets[1][i].columnData
                    result.push(item)
                }
                arrcolumnName = columnName.split(',')
                arrcolumndata = columndata.split(',')
                    for (let e = 0; e < arrcolumnName.length; e++) {
                        const items = {
                            'column_name': arrcolumnName[e],
                            'column_data': arrcolumndata[e]
                        }
                        columns.push(items)
                    }



            let resultJson = {
                "report_name:": "Performance Report",
                "columns_name": columns,
                "recs": Performance.recordsets[0],
                "result": result
            };
			
            return resultJson;
        } catch (err) {
            console.log(err)
        }
    }
    async summaryQReport(req) {
        try {
            let voiceQC= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('resultOut')
                .execute(`${pathdev.parsed.database}.civr.sp_summary_qc_report`)
            })
            // const voiceQC = await this.DBRepository.executeQuery("call sp_summary_qc_report(?,@result);SELECT @result as result", [JSON.stringify(req.body)]);
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
                for (let i = 0; i < voiceQC.recordsets[3].length; i++) {
                    const item = {
                        "msg": voiceQC.recordsets[3][i].msg,
                        "pagenum": voiceQC.recordsets[3][i].page_num,
                        "recnum": voiceQC.recordsets[3][i].rec_num,
                        "code": voiceQC.recordsets[3][i].result

                    }
                    projectName = voiceQC.recordsets[3][i].project_name
                    custName = voiceQC.recordsets[3][i].customerName
                    columnName += voiceQC.recordsets[3][i].columnname
                    result.push(item)
                }
                // Column
                arrcolumnName = columnName.split(',')
                // Data Table 1
                for (let j = 0; j < voiceQC.recordsets[0].length; j++) {
                   var PerPass 
                    if(voiceQC.recordsets[0][j].per_pass === null) {
                        PerPass = 0 
                    }else {
                        PerPass = voiceQC.recordsets[0][j].per_pass
                    }
                    
                    const item = {
                        "Intent": voiceQC.recordsets[0][j].intent,
                        "Pass%": PerPass ,//  voiceQC.recordsets[0][j].per_pass,
                        "Pass": voiceQC.recordsets[0][j].pass,
                        "Fail": voiceQC.recordsets[0][j].fail,
                        "Garbage": voiceQC.recordsets[0][j].garbage,
                        "Other": voiceQC.recordsets[0][j].other,
                        "Valid": voiceQC.recordsets[0][j].valid,
                        "Totalcall": voiceQC.recordsets[0][j].totalcall
                    }
                    sub_menu.push(item);
                    if (voiceQC.recordsets[0][j].per_pass <= 49.99) {
                        p1 += 1
                    }
                    if (voiceQC.recordsets[0][j].per_pass >= 50 && voiceQC.recordsets[0][j].per_pass <= 69.99) {
                        p2 += 1
                    }
                    if (voiceQC.recordsets[0][j].per_pass >= 70 && voiceQC.recordsets[0][j].per_pass <= 84.99) {
                        p3 += 1
                    }
                    if (voiceQC.recordsets[0][j].per_pass >= 85) {
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
            date_start_test =  voiceQC.recordsets[1][0].date_start
            // month_names[d.getMonth()] + '-' + d.getFullYear()
           var date1 = date_start_test.substring(0,10)
           var date2 = date1.substr(8,2)
           var month1 = date1.substr(5,2)
           var year1 = date1.substr(0,4)
           var month2 = month_names[parseInt(month1)-1]
           date_start_test = date2 + '-'+ month2 + '-' +year1
           console.log(date_start_test)



            let grandTotal = [{
                    "Intent": "Total"
                },
                {
                    "Pass%": voiceQC.recordsets[1][0].per_pass
                },
                {
                    "Pass": voiceQC.recordsets[1][0].pass
                },
                {
                    "Fail": voiceQC.recordsets[1][0].fail
                },
                {
                    "Garbage": voiceQC.recordsets[1][0].garbage
                },
                {
                    "Other": voiceQC.recordsets[1][0].other
                },
                {
                    "Valid": voiceQC.recordsets[1][0].valid
                },
                {
                    "Totalcall": voiceQC.recordsets[1][0].totalcall
                }
            ]

            let pipechart = [
                {"caption" :"Call Result"},
                {
                    "Pass": [{
                            "call": voiceQC.recordsets[2][0].pass
                        },
                        {
                            "%": voiceQC.recordsets[2][0].per_pass
                        }
                    ]
                },
                {
                    "Fail": [{
                            "call": voiceQC.recordsets[2][0].fail
                        },
                        {
                            "%": voiceQC.recordsets[2][0].per_fail
                        }
                    ]
                },
                {"Garbage": [{
                            "call": voiceQC.recordsets[2][0].garbage
                        },
                        {
                            "%": voiceQC.recordsets[2][0].per_garbage
                        }
                    ]
                },  {"Other": [{
                    "call": voiceQC.recordsets[2][0].other
                },
                {
                    "%": voiceQC.recordsets[2][0].per_other
                }
            ]
        }
            ]
           
            let summary1 = [{
                    "Total_calls": voiceQC.recordsets[1][0].totalcall
                },
                {
                    "Valid_calls": voiceQC.recordsets[1][0].valid
                },
                {
                    "Passed_calls": voiceQC.recordsets[1][0].pass
                },
                {
                    "Accuary": voiceQC.recordsets[1][0].per_pass + '%'
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
        } catch (err) {
            console.log(err)
        }
    }
}
const report = new ReportService;
module.exports = report;