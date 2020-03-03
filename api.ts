import * as express from 'express';
import { Connection, Request, TYPES } from 'tedious';
import * as crypto from 'crypto';
import * as request from 'request';
import createPDF from './referral';

const router = express.Router();

//#region APP CONTENT
router.get('/app-content', RetrieveContentRequest, (req, res) => {
    res.json(req.appContent);
});
function RetrieveContentRequest(req, res, next) {
    const result = [];
    const connection = CreateSQLConnection();
    
    const sqlQuery = `
    SELECT [Id], [Page], [Description], [Content], [ImageUrl], [Sort], [Url], [IsTile], [IsCheckbox], [CheckboxDescription]
    FROM ApplicationContent
    WHERE [IsActive] = 1`;
    
    var sqlRequest = new Request(sqlQuery, function(err, rowCount, rows) {
        connection.close();

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({ err });
        };
        
        req.appContent = result;
        next();
    });
    
    sqlRequest.on('row', function(columns) {
        const row = {};  
        
        columns.forEach(function(column) {
        const colName = column.metadata.colName;
        const key = colName && colName.length > 0 ? colName[0].toLowerCase() + colName.slice(1) : '';
        row[key] = column.value;
        });
        
        result.push(row);
    });
    
    ExecuteSqlQuery(connection, sqlRequest);
}

router.put('/app-content', UpdateContent, (req, res) => {
    res.send(req.success);
});

function UpdateContent(req, res, next) {
    //check token

    const connection = CreateSQLConnection();
    
    const storedProc = `AppContent_Update`;
    
    var request = new Request(storedProc, function(err) {
        connection.close();

        if (err) {
            console.error(err);
            req.success = false;
            res.statusCode = 500;
        } else {
            req.success = true;
        }
        
        next();
    });

    request.addParameter('id', TYPES.Int, req.body.id);
    request.addParameter('content', TYPES.NVarChar, req.body.content);

    ExecuteSqlQuery(connection, request, true);
}

router.get('/employees', RetrieveEmployeesRequest, (req, res) => {
    res.json(req.employees);
});

function RetrieveEmployeesRequest(req, res, next) {
    const result = [];
    const connection = CreateSQLConnection();

    const sqlQuery = `
    SELECT [Id], [Name], [Description], [Description2], [Education], [Location]
    FROM Employees`;

    var sqlRequest = new Request(sqlQuery, function(err, rowCount, rows) {
        connection.close();

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({ err });
        };
        
        req.employees = result;
        next();
    });
    
    sqlRequest.on('row', function(columns) {
        const row = {};  
        
        columns.forEach(function(column) {
        const colName = column.metadata.colName;
        const key = colName && colName.length > 0 ? colName[0].toLowerCase() + colName.slice(1) : '';
        row[key] = column.value;
        });
        
        result.push(row);
    });
    
    ExecuteSqlQuery(connection, sqlRequest);
}

router.post('/employee', UpdateEmployee, (req, res) => {
    res.send(req.success);
});

function UpdateEmployee(req, res, next) {
    //check token

    const connection = CreateSQLConnection();
    const employee = req.body.employee;


    const storedProc = employee.id > 0 ? `Employees_Update` : 'Employees_Insert';
    
    var request = new Request(storedProc, function(err) {
        connection.close();

        if (err) {
            console.error(err);
            req.success = false;
            res.statusCode = 500;
        } else {
            req.success = true;
        }
        
        next();
    });

    if (employee.id) {
        request.addParameter('id', TYPES.Int, employee.id);
    }
    request.addParameter('name', TYPES.NVarChar, employee.name);
    request.addParameter('description', TYPES.NVarChar, employee.description);
    request.addParameter('description2', TYPES.NVarChar, employee.description2);
    request.addParameter('education', TYPES.NVarChar, employee.education);
    request.addParameter('location', TYPES.NVarChar, employee.location);
    
    ExecuteSqlQuery(connection, request, true);
}

router.delete('/employee', DeleteEmployee, (req, res) => {
    res.send(req.success);
});

function DeleteEmployee(req, res, next) {
    const id = req.query.id;
    const connection = CreateSQLConnection();


    const storedProc = 'Employees_Delete'
    
    var request = new Request(storedProc, function(err) {
        connection.close();

        if (err) {
            console.error(err);
            req.success = false;
            res.statusCode = 500;
        } else {
            req.success = true;
        }
        
        next();
    });

    request.addParameter('id', TYPES.Int, id);
    
    ExecuteSqlQuery(connection, request, true);
}
//#endregion

//#region LOGIN
router.post('/login', Login, (req, res)=> {
    res.json({success: req.success, token: req.token});
});

function Login(req, res, next) {
    const procName = req.body.token ? 'Users_RefreshToken' : 'Users_Login';
    const connection = CreateSQLConnection();

    const passHash = encrypt(req.body.password);

    var sqlRequest = new Request(procName, function(err) {
        connection.close();
        
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({ err });
        }

        if (!req.success) {
            res.statusCode = 401;
            return res.json({error: 'Password Incorrect'});
        }
        
        next();
    });

    if (req.body.token) {
        sqlRequest.addParameter('token', TYPES.UniqueIdentifier, req.body.token);
    } else {
        sqlRequest.addParameter('username', TYPES.VarChar, req.body.username);
        sqlRequest.addParameter('passwordHash', TYPES.VarChar, passHash);
    }

    sqlRequest.addOutputParameter('newToken', TYPES.UniqueIdentifier);
    
    sqlRequest.on('returnValue', function(parameterName, value, metadata) {
        if (parameterName == 'newToken') {
            if (value) {
                req.success = true;
                req.token = value;
            }
        }
    });
    
    ExecuteSqlQuery(connection, sqlRequest, true);
}
//#endregion

//#region REFERRAL
router.post('/referral', createPDF, (req, res) => {
    res.json(res.pdfPath);
});

router.post('/recaptcha', (req, res) => {
    const token = req.body.recaptcha;
    const secretKey = "6LfXN3UUAAAAADbMsJT0zVE5Gv_P_E1xGmIdwGSa";
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`;

    if(token === null || token === undefined){
        res.status(201).send({success: false, message: "Token is empty or invalid"});
        return console.log("token empty");
    }  
    
    request(url, function(err, response, body){
    //the body is the data that contains success message
    body = JSON.parse(body);
    
    //check if the validation failed
    if(body.success !== undefined && !body.success) {
            res.send({success: false, 'message': "recaptcha failed"});
            return console.log("failed");
        }
    
    //if passed response success message to client
        res.send({"success": true, 'message': "recaptcha passed"});
    });
})
//#endregion

//#region HELPERS
function CreateSQLConnection() {
    const config = {
        authentication: {
            options: {
                userName: 'ben',
                password: 'Gorge2016!'
            },
            type: 'default'
        },
        server: 'roomscapes.database.windows.net',
        options:
        {
            database: 'PBA',
            encrypt: true
        }
    };
    
    return new Connection(config);
}
    
function ExecuteSqlQuery(connection:Connection, sqlRequest: Request, isStoredProc: boolean = false) {
    connection.on('connect', function(err) {
        if (err) {
            console.error('COULD NOT CONNECT: ', err);
        } else {
            if (isStoredProc) {
                connection.callProcedure(sqlRequest);
            } else {
                connection.execSql(sqlRequest);
            }
        }
    });
}

function encrypt(text){
    const key = 'Pbakey12Passw0rdPassw0rdPbakey12';
    const iv = '323652cdbf239f42';

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.update(text, 'utf8', 'base64');
    const encryptedPassword = cipher.final('base64');

    return encryptedPassword;
}
//#endregion

export default router;