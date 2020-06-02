const VoiceLogService = require('../services/VoiceLogService');
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
  logFilePath:'Logfile.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
},
log = SimpleNodeLogger.createSimpleLogger( opts );

class VoiceLogController{
    async voicelog(req,res){
        log.info("request Data:",req.body)
        const voicelog =await VoiceLogService.VoiceLog(req.body);
        res.json(voicelog)
        res.end
    }
}
const voiceLogController = new VoiceLogController();
module.exports = voiceLogController;