const loginController =require('../src/controller/LoginController') ;
const logController = require('../src/controller/logController');
const prtgotmance =require('../src/controller/PerformanceLogController');
const report =require('../src/controller/ReportController');
const dashbaord =require('../src/controller/DashboardController');
const uploadgrammar =require('../src/controller/uploadgrammarController');
const voicelog =require('../src/controller/VoiceLogController');
const Listpackget =require('../src/controller/ListpackgetController')
const grammarmanagement =require('../src/controller/grammarController')
const servicemanagement =require('../src/controller/ServiceController')
const intentmanagement =require('../src/controller/IntentController')
const config=require('../src/controller/configController')
const ontopprepaid =require('../src/controller/ontopprepaidController')
const ontoppostpaid =require('../src/controller/ontoppostpaidController')
const upsellhistory =require('../src/controller/upsellhistoryController')
const callflow=require('../src/controller/callflowController')
const Loginsert=require('../src/controller/logininsertController')
const confmap=require('../src/controller/confmapController')
const uploadvoice=require('../src/controller/uploadvoicecontroller')
const testtool=require('../src/controller/testtoolController')
const testsentence=require('../src/controller/testsentenceController')

var express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.post('/geniespeech/login', loginController.loginUser);
router.post('/geniespeech/adminmenu', loginController.adminMenu);
router.post('/geniespeech/insertlog',logController.logContrller);
router.post('/geniespeech/insertlogperformance',prtgotmance.performanceController);
router.post('/geniespeech/downloadgrammar',logController.downloadgrammar)
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
router.post('/geniespeech/getdatalistpackget',Listpackget.getdatalistpackget)
router.post('/geniespeech/editlistpackget',Listpackget.editlistpackget)
router.post('/geniespeech/deletelistpackget',Listpackget.deletelistpackget)
router.post('/geniespeech/addlistpackget',Listpackget.addlistpackget)
router.post('/geniespeech/generatexml',Listpackget.generatexml)

router.post('/geniespeech/grammarlist',grammarmanagement.Grammarlist)
router.post('/geniespeech/adddeleteupdategrammar',grammarmanagement.grammaraddupdatedelete)

//Bigmon 05-Nov-2020
router.post('/geniespeech/grammardeploylist',grammarmanagement.grammardeploylist)
router.post('/geniespeech/grammarfilelist',grammarmanagement.getfilegrammar)
router.post('/geniespeech/addgrammar',grammarmanagement.addgrammar)
router.post('/geniespeech/addgrammarfile',grammarmanagement.addgrammarfile)
router.post('/geniespeech/serverlist',grammarmanagement.serverlist)
router.post('/geniespeech/grammarintentlist',grammarmanagement.grammarIntentlist)
router.post('/geniespeech/uploadgrammarfile',grammarmanagement.uploadgrammarfile)
//----------------------------------------------------------------





router.post('/geniespeech/servicelist',servicemanagement.servicerlist)
router.post('/geniespeech/adddeleteupdateservice',servicemanagement.serviceaddupdatedelete)

router.post('/geniespeech/intentlist',intentmanagement.intentlist)
router.post('/geniespeech/adddeleteupdateintent',intentmanagement.intentaddupdatedelete)

router.post('/geniespeech/config',config.generateIni)
router.post('/geniespeech/addconfig',config.addlistconfig)
router.post('/geniespeech/deleteconfig',config.deletelistconfig)
router.post('/geniespeech/listconfig',config.listconfig)
router.post('/geniespeech/updateconfig',config.updatelistconfig)

router.post('/geniespeech/listfilename',config.listfilename)
router.post('/geniespeech/insertnamefile',config.insertnamefile)
router.post('/geniespeech/deletenamefile',config.deletenamefile)
router.post('/geniespeech/updatenamefile',config.updatenamefile)

router.post('/geniespeech/Listontopprepaid',ontopprepaid.Listontopprepaid)
router.post('/geniespeech/insertontopprepaid',ontopprepaid.addlistontopprepaid)
router.post('/geniespeech/deleteontopprepaid',ontopprepaid.deletelistontopprepaid)
router.post('/geniespeech/updateontopprepaid',ontopprepaid.editlistontopprepaid)
router.post('/geniespeech/generatexmlprepaid',ontopprepaid.generatexml)

router.post('/geniespeech/Listontoppostpaid',ontoppostpaid.Listontoppostpaid)
router.post('/geniespeech/insertontoppostpaid',ontoppostpaid.addlistontoppostpaid)
router.post('/geniespeech/deleteontoppostpaid',ontoppostpaid.deletelistontoppostpaid)
router.post('/geniespeech/updateontoppostpaid',ontoppostpaid.editlistontoppostpaid)
router.post('/geniespeech/generatexmlpostpaid',ontoppostpaid.generatexml)

router.post('/geniespeech/Listupsellhistory',upsellhistory.Listupsellhistory)
router.post('/geniespeech/insertupsellhistory',upsellhistory.addlistupsellhistory)
router.post('/geniespeech/deleteupsellhistory',upsellhistory.deletelistupsellhistory)
router.post('/geniespeech/updateupsellhistory',upsellhistory.editlistupsellhistory)
router.post('/geniespeech/generatexmlupsellhistory',upsellhistory.generatexml)

router.post('/geniespeech/Listcallflow',callflow.callflowgetdata)
router.post('/geniespeech/listdatacallflow',callflow.callflowlistgetdata)
router.post('/geniespeech/editcallflow',callflow.addcallflow)
router.post('/geniespeech/addcallflow',callflow.addcallflow)
router.post('/geniespeech/deletecallflow',callflow.addcallflow)
router.post('/geniespeech/uploadcallflow',callflow.uploadcallflow)

router.post('/geniespeech/loginsert',Loginsert.logininsert)
router.post('/geniespeech/logview',Loginsert.loginview)


router.post('/geniespeech/Listconf',confmap.listconfmap)
router.post('/geniespeech/insertconf',confmap.addlistConfmap)
router.post('/geniespeech/deleteconf',confmap.deletelistConfmap)
router.post('/geniespeech/updateconf',confmap.updatelistConfmap)

router.post('/geniespeech/Listconfinput',confmap.listConfinputmap)
router.post('/geniespeech/insertconfinput',confmap.addlistConfinputmap)
router.post('/geniespeech/deleteconfinput',confmap.deletelistConfinputmap)
router.post('/geniespeech/updateconfinput',confmap.updatelistConfinputmap)

router.post('/geniespeech/listdropdown',uploadvoice.listgetdatadropdown)
router.post('/geniespeech/listvoice',uploadvoice.listuploadvoice)
router.post('/geniespeech/insertvoice',uploadvoice.addlistuploadvoice)
router.post('/geniespeech/deletevoice',uploadvoice.deletelistuploadvoice)
router.post('/geniespeech/editvoice',uploadvoice.editlistuploadvoice)
router.post('/geniespeech/movevoice',uploadvoice.movefileuploadvoice)

router.post('/geniespeech/listdropdowntesttool',testtool.listgetdatadropdown)
router.post('/geniespeech/listtesttool',testtool.listtesttool)
router.post('/geniespeech/inserttesttool',testtool.addlisttesttool)
router.post('/geniespeech/deletetesttool',testtool.deletelisttesttool)
router.post('/geniespeech/edittesttool',testtool.editlisttesttool)
router.get('/geniespeech/downloadtesttool',testtool.downloadtesttool)

router.post('/geniespeech/listdropdowntestsentence',testsentence.listgetdatadropdown)
router.post('/geniespeech/listtestsentence',testsentence.listtestsentence)
router.post('/geniespeech/inserttestsentence',testsentence.addlisttestsentence)
router.post('/geniespeech/deletetestsentence',testsentence.deletelisttestsentence)
router.post('/geniespeech/edittestsentence',testsentence.editlisttestsentence)

router.post('/geniespeech/listtestsentencefile',testsentence.listtestsentencefile)
router.post('/geniespeech/inserttestsentencefile',testsentence.addtestsentencefile)
router.post('/geniespeech/deletetestsentencefile',testsentence.deletelisttestsentencefile)
router.post('/geniespeech/edittestsentencefile',testsentence.editlisttestsentencefile)
router.get('/geniespeech/downloadtestsentencefile',testsentence.downloadtestsentencefile)

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
