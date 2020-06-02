const loginController =require('../src/controller/LoginController') ;
const logController = require('../src/controller/logController');
const prtgotmance =require('../src/controller/PerformanceLogController');
const report =require('../src/controller/ReportController');
const dashbaord =require('../src/controller/DashboardController');
const uploadgrammar =require('../src/controller/uploadgrammarController');
const voicelog =require('../src/controller/VoiceLogController');
const Listpackget =require('../src/controller/ListpackgetController')
var express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.post('/geniespeech/login', loginController.loginUser);
router.post('/geniespeech/adminmenu', loginController.adminMenu);

router.post('/geniespeech/insertlog',logController.logContrller);
router.post('/geniespeech/insertlogperformance',prtgotmance.performanceController);
router.post('/geniespeech/conver',logController.converController);
router.post('/geniespeech/logcept',logController.logcept);
router.post('/geniespeech/logdetail',logController.logdetail);
router.post('/geniespeech/logvoice',logController.logvoice);
router.post('/geniespeech/updatevoice',logController.updatevoiceController);
router.post('/geniespeech/report',report.report);
router.post('/geniespeech/dashbaord',dashbaord.DashboardController);
router.post('/geniespeech/grammar',uploadgrammar.uploadgrammarController);
router.post('/geniespeech/grammarupload',uploadgrammar.uploadgrammar);
router.post('/geniespeech/grammarprocessfile',uploadgrammar.processFile);
router.post('/geniespeech/grammarbuildgrammar',uploadgrammar.buildGrammar);
router.post('/geniespeech/voicelog',voicelog.voicelog);
router.post('/geniespeech/grammarupdateresult',uploadgrammar.updategrammarresult);
router.get('/geniespeech/downloadgrammar/:filename',uploadgrammar.downloadGrammar);
router.post('/geniespeech/grammardeploy',uploadgrammar.deploy);
router.post('/geniespeech/uploadvoicelog',uploadgrammar.uploadvoicelog);
router.post('/geniespeech/summaryqc',logController.summaryqc);



router.post('/geniespeech/listpackget',Listpackget.Listpackget)

function verifyToken ( req,res,next){
  const bearerHeader =req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
      req.token = bearerHeader;
      jwt.verify(req.token, 'secretkey', (err , authData) => {
             console.log("authData:"+authData)
              if(req.token!=''){
				  console.log("pass token")
              if(typeof authData !== 'undefined'){
				  console.log("pass authData")
                  next();
      }else{
          return res.status(401).send({
              message: 'User not authenticated because not found  server.'
          });
      }
  }else{
      return res.status(401).send({
          message: 'User not authenticated.'
      });
  }
      });
      
 }else{
  return res.status(401).send({
      message: 'User not authenticated.'
  });
 }
  }

module.exports = router;
