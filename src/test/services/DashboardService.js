const DBRepository = require('../repositories/DBRepository');
class DashboardService{
    constructor() {
        this.DBRepository = new DBRepository();
    }
    async GetDashboard(req){
        try{
            const Dashboard = await this.DBRepository.executeQuery("call sp_dashboard_report(?,@result);SELECT @result as result",[JSON.stringify(req)]);
            let length =Dashboard.length;
            console.log(Dashboard)
            let box1=[]
            let box2=[]
            let box3=[]
            let box4=[]
            let box5=[]
            let box6=[]
            if(length !==0){
                for(let i=0; i<Dashboard[0].length; i++){
                    const item={
                        
                        "datetime":Dashboard[0][i].date_time,
                        "nonrecog":Dashboard[0][i].non_recog,
                        "peraccuracy":Dashboard[0][i].per_accuracy,
                        "recog":Dashboard[0][i].recog,
                        "totalcall":Dashboard[0][i].total_call
                    }
                    box1.push(item)
                }
                for(let i=0; i<Dashboard[1].length; i++){
                    const item={
                        "datetime":Dashboard[1][i].date_time,
                        "peraccuracy":Dashboard[1][i].per_accuracy
                    }
                    box2.push(item)
                }
                
				
                for(let [key, value] of Dashboard[2].entries()){

                    box3.push(value)
            }

                for(let i=0; i<Dashboard[3].length; i++){
                    const item={
                        "serviceid":Dashboard[3][i].service_id,
                        "servicename":Dashboard[3][i].service_name,
                        "totalcall":Dashboard[3][i].total_call
                    }
                    box4.push(item)
                }
                for(let i=0; i<Dashboard[4].length; i++){
                    const item={
                        "nonrecog":Dashboard[4][i].non_recog,
                        "recog":Dashboard[4][i].recog,
                        "serviceid":Dashboard[4][i].service_id,
                        "servicename":Dashboard[4][i].service_name
                    }
                    box5.push(item)
                }

           
                    const item={
                        "msg":Dashboard[5][0].msg,
                        "code":Dashboard[5][0].result
                    }
                    box6.push(item)
                
            }
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