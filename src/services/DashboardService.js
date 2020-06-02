const connectmssql=require('../MssqlDatabase')
const pathdev=require('dotenv').config({ path: './config/dev.env' });
class DashboardService{

    async GetDashboard(req){
        try{
            let Dashboard= await   connectmssql.then((pool) => {
                return pool.request() 
                .input('jsonIN', JSON.stringify(req))
                .output('result')
                .execute(`${pathdev.parsed.database}.civr.sp_dashboard_report`)
            })

           
            let resultJson={
                "name":["dashboard","Weekly Accuracy Trend","Top 5 Event statistic","Top 5 Event","Service Overview"],
                "box1":Dashboard.recordsets[0],
                "box2":Dashboard.recordsets[1],
                "box3":Dashboard.recordsets[2],
                "box4":Dashboard.recordsets[3],
                "box5":Dashboard.recordsets[4],
                "result":Dashboard.recordsets[5]
            };
            console.log(resultJson);
            return resultJson;
            
        }catch(err){
            console.log(err)
        }
    }
}
const dashboardService = new DashboardService;
module.exports =dashboardService;