
class PerformanceLogService {

    async InsertPerformance(req) {
        try{
            const a= await this.DBRepository.executeQuery("call sp_insert_log_performance(?,@test,@msg);SELECT @test as result;select @msg as msg", [req]);
            console.log(a)
        }catch(err){
            console.log(err)
        }
      
    }
}
const performancelog = new PerformanceLogService;
module.exports = performancelog;