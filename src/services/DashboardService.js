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
			  let box1=[]
            let box2=[]
            let box3=[]
            let box4=[]
            let box5=[]
            let box6=[]
			  for(let i=0; i<Dashboard.recordsets[0].length; i++){
                    const item={
                        
                        "datetime":Dashboard.recordsets[0][i].date_time,
                        "nonrecog":Dashboard.recordsets[0][i].non_recog,
                        "peraccuracy":Dashboard.recordsets[0][i].per_accuracy,
                        "recog":Dashboard.recordsets[0][i].recog,
                        "totalcall":Dashboard.recordsets[0][i].total_call
                    }
                    box1.push(item)
                }
				
				  for(let i=0; i<Dashboard.recordsets[1].length; i++){
                    const item={
                        "datetime":Dashboard.recordsets[1][i].date_time,
                        "peraccuracy":Dashboard.recordsets[1][i].per_accuracy
                    }
                    box2.push(item)
                }
                
					
                for(let [key, value] of Dashboard.recordsets[2].entries()){

                    box3.push(value)
            }
			
			  for(let i=0; i<Dashboard.recordsets[3].length; i++){
                    const item={
                        "serviceid":Dashboard.recordsets[3][i].service_id,
                        "servicename":Dashboard.recordsets[3][i].service_name,
                        "totalcall":Dashboard.recordsets[3][i].total_call
                    }
                    box4.push(item)
                }
           
		   for(let i=0; i<Dashboard.recordsets[4].length; i++){
                    const item={
                        "nonrecog":Dashboard.recordsets[4][i].non_recog,
                        "recog":Dashboard.recordsets[4][i].recog,
                        "serviceid":Dashboard.recordsets[4][i].service_id,
                        "servicename":Dashboard.recordsets[4][i].service_name
                    }
                    box5.push(item)
                }
				
                    const item={
                        "msg":Dashboard.recordsets[5][0].msg,
                        "code":Dashboard.recordsets[5][0].result
                    }
                    box6.push(item)
					
            let resultJson={
                "name":["dashboard","Weekly Accuracy Trend","Top 5 Event statistic","Top 5 Event","Service Overview"],
                 "box1":box1,
                "box2":box2,
                "box3":box3,
                "box4":box4,
                "box5":box5,
                "result":box6
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