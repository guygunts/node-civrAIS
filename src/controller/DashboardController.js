const DashboardService = require('../services/DashboardService');

class DashboardController{
    async DashboardController(req,res){
      const dashboard = await  DashboardService.GetDashboard(req.body);
        res.json(dashboard);
        res.end();
    }
}
const dashboardController = new DashboardController;
module.exports =dashboardController;