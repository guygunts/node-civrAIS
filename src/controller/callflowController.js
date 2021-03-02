const callflowService = require('../services/callflowService');
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'Logfile.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);
const pathdev = require('dotenv').config({
    path: './config/dev.env'
});
const process = require('process');
class CallflowController {

    async callflowgetdata(req, res) {
        log.info("request Data:", req.body)
        const ret = await callflowService.Getdatacallflow(req.body);
        res.json(ret);
        res.end();
    }

    async callflowlistgetdata(req, res) {
        log.info("request Data:", req.body)
        const ret = await callflowService.Getdatalistcallflow(req.body);
        res.json(ret);
        res.end();
    }

    async addcallflow(req, res) {
        if (req.body.menu_action == 'active_callflow') {
            // Case active callflow
            try {
                // Step 1: Get information callflow (filepath,destination path)
                var obj = {
                    "menu_action": 'get_info_callflow', // req.body.menu_action,
                    "project_id": req.body.project_id,
                    "user_login": req.body.user_login,
                    "callflow_id": req.body.callflow_id,
                    "file_id": req.body.file_id
                }
                const rest = await callflowService.addCallflow(obj)
                // Step 2: Starting active callflow to destination path
                const path = require('path');
                const fs = require('fs');
                var filessystem = require('fs');
                let pathFile = rest.file_path
                let destFile = rest.dest_path
                let orgFile = rest.org_file
                let baseName = path.basename(pathFile);
                process.chdir(`${pathdev.parsed.baseHome}`);
                var dir = `${pathdev.parsed.baseHomeuploadcallflow}`;
                var filePath = path.resolve(pathdev.parsed.baseHomeuploadcallflow + baseName);

                if (!filessystem.existsSync( destFile)) {
                    filessystem.mkdirSync(destFile);
                 }
                 
                fs.copyFile(dir + baseName, destFile + '//' + orgFile, function (err) {
                    if (err) {
                        console.log(err.message)
                        // Step 4:  Case active callflow error
                        async function updateActiveError() {
                            var obj = {
                                "menu_action": req.body.menu_action,
                                "project_id": req.body.project_id,
                                "user_login": req.body.user_login,
                                "callflow_id": req.body.callflow_id,
                                "file_id": req.body.file_id,
                                "active_result": err.message,
                                "active_status": 0
                            }
                            const rest = await callflowService.addCallflow(obj)
                            res.json(err);
                            res.end();
                        }
                        updateActiveError()
                    } else {
                        // Step 3:  Case active callflow success
                        async function updateActiveSuccess() {
                            let obj = {
                                "menu_action": req.body.menu_action,
                                "project_id": req.body.project_id,
                                "user_login": req.body.user_login,
                                "callflow_id": req.body.callflow_id,
                                "file_id": req.body.file_id,
                                "active_result": "Active success",
                                "active_status": 1
                            }
                            let rest = await callflowService.addCallflow(obj)
                            console.log(rest)
                            res.json(rest);
                            res.end();
                        }
                        updateActiveSuccess()
                    }
                })

            } catch (err) {
                console.log(err)
            }
        } else if (req.body.menu_action == 'delete_file_callflow') {
            log.info("request Data:", req.body)
            const ret = await callflowService.addCallflow(req.body);
            let filePath = ret.file_path
            const fs = require('fs');
            if (filePath != null) {
                fs.unlink(filePath, function (err) {
                    if (err && err.code == 'ENOENT') {
                        // file doens't exist
                        console.info("File doesn't exist, won't delete it.");
                        res.json(ret);
                        res.end();
                    } else if (err) {
                        // other errors, e.g. maybe we don't have enough permission
                        console.error("Error occurred while trying to delete file");
                        res.json(ret);
                        res.end();
                    } else {
                        console.log(ret)
                        res.json(ret);
                        res.end();
                    }
                });
            } else {
                console.log(ret)
                res.json(ret);
                res.end();
            }
        } else if (req.body.menu_action == 'deletecallflow') {
            log.info("request Data:", req.body)
            const ret = await callflowService.addCallflow(req.body);
            const fs = require('fs');
            for (let i = 0; i < ret.file_callflow.length; i++) {
                try {
                    let filePath = ret.file_callflow[i].file_path
                    if (filePath != null) {
                        fs.unlinkSync(filePath, function (err) {
                            if (err && err.code == 'ENOENT') {
                                // file doens't exist
                                console.info("File doesn't exist, won't delete it.");

                            } else if (err) {
                                // other errors, e.g. maybe we don't have enough permission
                                console.error("Error occurred while trying to delete file");

                            } else {
                                console.log(filePath)

                            }
                        });
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            res.json(ret);
            res.end();
        }
        else {
            log.info("request Data:", req.body)
            const ret = await callflowService.addCallflow(req.body);
            res.json(ret);
            res.end();
        }
    }


    async uploadcallflow(req, res) {
        try {
            log.info("request Data:", req.body)
            var multer = require('multer')
            var namefile
            var storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'uploadcallflow/');
                },
                filename: (req, file, cb) => {
                    namefile = file.originalname + '-' + Date.now()
                    cb(null, file.originalname + '-' + Date.now()) // Rename original filenam + time stamp
                }
            });
            var upload = multer({
                storage
            }).any()

            var filessystem = require('fs');
            process.chdir(`${pathdev.parsed.baseHome}`);
            var dir = `${pathdev.parsed.baseHomeuploadcallflow}`;
            console.log(`Current directory: ${process.cwd()}`);
            if (!filessystem.existsSync(dir)) {
                filessystem.mkdirSync(dir);
            }
            upload(req, res, function (err) {
                log.info("request Callflow upload:", req)
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return
                } else if (err) {
                    console.log(err)
                    return err
                }
                if (err) {
                    return res.end(err);
                }
                // if (req.files[0].mimetype == 'application/xml') {
                var path = require('path');
                var filePath = path.resolve(pathdev.parsed.baseHomeuploadcallflow + namefile);
                var buildDate
                const xml2js = require('xml2js');
                const fs = require('fs');
                const parser = new xml2js.Parser({
                    attrkey: "ATTR"
                });
                let xml_string = fs.readFileSync(filePath, "utf8");
                parser.parseString(xml_string, function (error, result) {
                    if (error === null) {
                        // console.log(result);
                        // buildVer  = result.callflow.ATTR.name
                        buildDate = result.callflow.ATTR.build_date
                    } else {
                        console.log(error);
                    }
                })
                async function updateUploadDB() {
                    try {
                        var obj = {
                            "project_id": req.body.project_id,
                            "user_login": req.body.user_login,
                            "file_name": req.files[0].filename,
                            "file_desc": req.body.file_desc,
                            "file_size": req.files[0].size,
                            "file_type": req.files[0].mimetype,
                            "file_path": filePath,
                            "build_date": buildDate
                        }
                        console.log(obj)
                        const uploadcallflow = await callflowService.uploadFileCallflow(obj)
                        console.log(uploadcallflow)
                        res.json(uploadcallflow);
                        res.end();
                    } catch (error) {
                        console.log(error)
                    }
                }

                updateUploadDB()

                // } else {
                //     var result = {
                //         "code": 401,
                //         "file_name": 'Please Upload  XML  File...'
                //     }
                //     console.log(result)
                //    res.json(result);
                //    res.end();
                // }


            })


        } catch (error) {
            console.log(error)
        }


    }
}




const callflowController = new CallflowController();
module.exports = callflowController;