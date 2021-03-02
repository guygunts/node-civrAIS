let SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'Logfile.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);
const connectmssql = require('../MssqlDatabase')
const pathdev = require('dotenv').config({
    path: './config/dev.env'
});
class GrammarService {

    async grammarlist(req) {
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        try {
            let grammarlist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getgrammar`)
            })
            columnsName = grammarlist.recordsets[1][0].columnName
            columnsdataName = grammarlist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "Grammar Management",
                "columnsname": columns,
                "recs": grammarlist.recordsets[0],
                "result": grammarlist.recordsets[1]
            };



            return resultJson

        } catch (err) {
            console.log(err)
        }
    }

    async grammaraddupdatedelete(req) {
        try {
            let grammaradd = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_grammar`)
            })
            let resultJson
            resultJson = {
                "code": grammaradd.recordsets[0][0].code,
                "msg": grammaradd.recordsets[0][0].msg,
            }
            return resultJson
        } catch (err) {
            console.log(err)
        }
    }

    async grammardeploylist(req) {
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        try {
            let grammarlist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getdata_grammar_deploy`)
            })
            columnsName = grammarlist.recordsets[1][0].columnName
            columnsdataName = grammarlist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "Grammar Management",
                "columnsname": columns,
                "recs": grammarlist.recordsets[0],
                "result": grammarlist.recordsets[1]
            };



            return resultJson

        } catch (err) {
            console.log(err)
        }
    }
    async getfilegrammar(req) {
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        try {
            let grammarlist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_getfile_grammar`)
            })
            columnsName = grammarlist.recordsets[1][0].columnName
            columnsdataName = grammarlist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            let resultJson = {
                "reportname": "Grammar Management",
                "columnsname": columns,
                "recs": grammarlist.recordsets[0],
                "result": grammarlist.recordsets[1]
            };



            return resultJson

        } catch (err) {
            console.log(err)
        }
    }

    async addgrammar(req) {
        try {
            const fs = require('fs');
            const filessystem = require('fs');
            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_grammar_deploy`)
            })
            console.log(insert)

            if (req.menu_action === 'activegrammar') {
                var path = require('path');
                var AdmZip = require('adm-zip');

                var grammarPath
                var grammarFile
                var fileExt
               // console.log(insert.recordsets[0].length)

                grammarPath = insert.recordsets[1][0].grammarPath
                if (!filessystem.existsSync(grammarPath)) {
                    filessystem.mkdirSync(grammarPath);
                 }

                for (let i = 0; i < insert.recordsets[0].length; i++) {

                    let filePath = insert.recordsets[0][i].file_path
                    let fileName = insert.recordsets[0][i].file_name
                    console.log(fileName, filePath)

                    fileExt = path.extname(fileName).substr(1);
                    if (fileExt === 'zip') {
                        var zip = new AdmZip(filePath);
                                            
                        zip.extractAllTo(/*target path*/ grammarPath, /*overwrite*/true);
                        
                    } else {
                        fs.copyFile(filePath, grammarPath + '//' + fileName, function (err) {
                            if (err) {
                                console.log(err.message)
                            } else {
                                console.log(filePath)
                            }
                        })
                    }
                }
                let resultJson = {
                    "code": insert.recordsets[1][0].code,
                    "msg": insert.recordsets[1][0].msg,
                }
                return resultJson
            } else if (req.menu_action === 'deletegrammar') {
                console.log(insert.recordsets[0])
                for (let i = 0; i < insert.recordsets[0].length; i++) {
                    try {
                        let filePath = insert.recordsets[0][i].file_path
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
                let resultJson = {
                    "code": insert.recordsets[1][0].code,
                    "msg": insert.recordsets[1][0].msg,
                }
                return resultJson

            } else if (req.menu_action === 'deletegrammarfile') {
                console.log(insert.recordsets[0][0].file_path)
                try {
                    let filePath = insert.recordsets[0][0].file_path
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
                let resultJson = {
                    "code": insert.recordsets[1][0].code,
                    "msg": insert.recordsets[1][0].msg,
                }
                return resultJson
            } else if (req.menu_action === 'deletegrammarbuild') {
                console.log(insert)
                try {
                    //baseHomeupload 
                    //  let filePatch = insert.recordsets[0][0].full_patch
                    var filePatch = `${pathdev.parsed.baseHomeupload}`;
                    let fileName = insert.recordsets[0][0].file_name
                    let filePath = filePatch + fileName
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
                let resultJson = {
                    "code": insert.recordsets[1][0].code,
                    "msg": insert.recordsets[1][0].msg,
                }
                return resultJson
            } else {
                let resultJson = {
                    "code": insert.recordsets[0][0].code,
                    "msg": insert.recordsets[0][0].msg,
                }
                return resultJson
            }
        } catch (err) {
            console.log(err)

        }

    }
    async addgrammarfile(req) {
        try {
            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_admin_grammar_file`)
            })

            let resultJson = {
                "code": insert.recordsets[0][0].code,
                "msg": insert.recordsets[0][0].msg,
            }
            return resultJson

        } catch (err) {
            console.log(err)
        }

    }
    async serverlist(req) {
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        //  console.log(JSON.stringify(req.body))
        try {
            let grammarlist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_get_server`)
            })
            columnsName = grammarlist.recordsets[1][0].columnName
            columnsdataName = grammarlist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            console.log(grammarlist.recordsets)
            let resultJson = {
                "reportname": "Grammar Management",
                "columnsname": columns,
                "recs": grammarlist.recordsets[0],
                "result": grammarlist.recordsets[1]
            };



            return resultJson

        } catch (err) {
            console.log(err)
        }
    }
    async grammarIntentList(req) {
        let columns = []
        let columnsName = ''
        let columnsdataName = ''
        let arrcolumnName
        let arrcolumndataName
        //  console.log(JSON.stringify(req.body))
        try {
            let grammarlist = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(req.body))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_get_grammar_intent`)
            })
            columnsName = grammarlist.recordsets[1][0].columnName
            columnsdataName = grammarlist.recordsets[1][0].columndataName
            arrcolumnName = columnsName.split(',')
            arrcolumndataName = columnsdataName.split(',')
            for (let e = 0; e < arrcolumnName.length; e++) {
                const items = {
                    'column_name': arrcolumnName[e],
                    'column_data': arrcolumndataName[e]
                }
                columns.push(items)
            }
            console.log(grammarlist.recordsets)
            let resultJson = {
                "reportname": "Grammar Management",
                "columnsname": columns,
                "recs": grammarlist.recordsets[0],
                "result": grammarlist.recordsets[1]
            };



            return resultJson

        } catch (err) {
            console.log(err)
        }
    }
    async uploadgrammarfile(body_upload) {
        try {

            let insert = await connectmssql.then((pool) => {
                return pool.request()
                    .input('jsonIN', JSON.stringify(body_upload))
                    .output('resultOUT')
                    .execute(`${pathdev.parsed.database}.civr.sp_upload_grammar_file`)
            })

            let resultJson = {
                "file_name": body_upload.file_name,
                "code": insert.recordsets[0][0].code,
                "msg": insert.recordsets[0][0].msg,

            }
            return resultJson

        } catch (err) {
            console.log(err)
        }

    }
}
const grammarService = new GrammarService();
module.exports = grammarService;