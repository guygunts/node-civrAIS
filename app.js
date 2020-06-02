const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const pathdev=require('dotenv').config({ path: './config/dev.env' });
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function( req, res, next) 
{
  // set locals, only providing error in development
   res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods",'POST, GET, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, cache-control, sysuid");
  next();
});

global.appRoot = path.resolve(__dirname);

app.use(indexRouter);
const PORT = pathdev.parsed.app_port;
app.listen(PORT,() => {
  console.log(`server running on port  ${PORT}`);

});
// setInterval(intervalFunc, 60000);
module.exports = app;



// function intervalFunc() {
//   let filessystem = require('fs');
//   try {
//       var SQL = "call sp_getjob_deploy ()"
//       mysqldb.query(SQL,(err, rows) => {
//         if (err) {
//           console.log("err:", err);
//         } else {
//           if (rows[0].length > 0) {
//             let date
//             rows[0].forEach(element  => {
//               date =new Date(element.schedule_deploy);  
//               let datenow = new Date(Date.now()) 
//               if(date.toDateString() >= datenow.toDateString()){
//               let json1 = {
//                 "project_id": element.project_id,
//                 "build_version": element.build_version
//               }
//                   var SQL2 = " call sp_update_deploy_schedule ('" + JSON.stringify(json1) + "',@rt);"
//                   mysqldb.query(SQL2,(err, rows2)=> {
//                     if (err) {
//                       console.log("err:", err);
//                     } else {
//                       var builddir = './deploygrammar/';
//                       if (!filessystem.existsSync(builddir)) {
//                         filessystem.mkdirSync(builddir);
//                     }
//                     let dirproject = './deploygrammar/'+rows2[0].project_name;
//                 if (!filessystem.existsSync(dirproject)) {
//                     filessystem.mkdirSync(dirproject);
//                 }
//                     let dirpre = './deploygrammar/'+rows2[0].project_name+'/pre/';
//                 if (!filessystem.existsSync(dirpre)) {
//                     filessystem.mkdirSync(dirpre);
//                 }
//                 let dirpro = './deploygrammar/'+rows2[0].project_name+'/pro/';
//                 if (!filessystem.existsSync(dirpro)) {
//                     filessystem.mkdirSync(dirpro);
//                 }

//                 if(element.pre_active ==1){
//                   filessystem.copyFile('.'+rows2[0].full_patch, dirpro+rows2[0].project_name+"-"+pathdev.parsed.namegram+".gram", (err) => {  
//                     if (err) throw err;  
//                     console.log(' copy file pre success');  
//                   });
//                 }
//                 if(element.pro_active ==1){
//                   filessystem.copyFile('.'+rows2[0].full_patch, dirpro+rows2[0].project_name+"-"+pathdev.parsed.namegram+".gram", (err) => {  
//                     if (err) throw err;  
//                     console.log(' copy file pro success');  
//         }); 
//                 }
//                     }
//                   })
//                 } else {
//                   console.log(`No schedule job get... at port:${PORT}`)
//                 }
//             });
               
             
//               }else {
//                 console.log(`No data in job get... at port:${PORT}`)
//               }
//         }
//       })
//   } catch (err) {
//     return err;
//   }
// }