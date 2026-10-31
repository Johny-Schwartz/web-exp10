const http = require('http');
const fs = require('fs');
const path = require('path'); 
const { MongoClient } = require('mongodb');

// MongoDB Atlas Cloud Connection Setup
// ⚠️ MANDATORY: Replace <db_password> below with your actual database user password!
const url = "mongodb+srv://johnywork007_db_user:DB1255@cluster0.zswzqp7.mongodb.net/?retryWrites=true&w=majority";
const dbName = "mydb";
const collectionName = "customers";

const server = http.createServer(function (req, res) {
    
    // GET Route: Safely serves the form layout from the project directory
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { "Content-Type": "text/html" });
        
        const filePath = path.join(__dirname, 'home.html');
        
        if (fs.existsSync(filePath)) {
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h3>Error: home.html file not found in the current folder location.</h3>");
        }
    } 
    
    // POST Route: Captures data streams asynchronously and streams directly to Cloud Cluster storage
    else if (req.method === 'POST' && req.url === '/server') {
        let rawData = "";
        
        req.on('data', function (chunk) {
            rawData += chunk;
        });
        
        req.on('end', async function () {
            try {
                // Parse standard incoming URL-encoded context buffers
                const params = new URLSearchParams(rawData);
                
                const name = params.get('name');
                const password = params.get('password');
                const age = params.get('age');
                const mobile = params.get('mobile');
                const email = params.get('email');
                const gender = params.get('gender');
                const state = params.get('state');
                
                // Formats multiple checkbox item arrays safely into a single string flat text field
                const skillsArray = params.getAll('skills');
                const skillsStr = skillsArray.join(', ');

                // Build modern structured document database mapping configuration
                const userObj = {
                    name: name,
                    password: password,
                    age: age,
                    mobile: mobile,
                    email: email,
                    gender: gender,
                    state: state,
                    skills: skillsStr
                };

                // Asynchronous promise-driven cloud connection sequence
                const client = await MongoClient.connect(url);
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                
                // Write data entity direct insertion mapping execution execution
                await collection.insertOne(userObj);
                console.log("1 document safely recorded into cloud cluster storage");
                client.close();

                // Render beautiful confirmation table payload straight to user screen layout
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>User Submitted Details</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; align-items: center; padding: 50px 20px; background-color: #f4f6f9; }
                        h2 { color: #0044cc; text-decoration: underline; margin-bottom: 20px; }
                        table { width: 100%; max-width: 600px; border-collapse: collapse; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
                        th, td { border: 1px solid #b0c4de; padding: 14px 20px; text-align: left; }
                        td:first-child { font-weight: bold; width: 40%; color: #333; background-color: #fcfdfe; }
                        td:last-child { color: #0022aa; }
                    </style>
                </head>
                <body>
                    <h2>User Submitted Details</h2>
                    <table>
                        <tr><td>Name</td><td>${name}</td></tr>
                        <tr><td>Password</td><td>${password}</td></tr>
                        <tr><td>Age</td><td>${age}</td></tr>
                        <tr><td>Mobile Number</td><td>${mobile}</td></tr>
                        <tr><td>Email</td><td>${email}</td></tr>
                        <tr><td>Gender</td><td>${gender}</td></tr>
                        <tr><td>State</td><td>${state}</td></tr>
                        <tr><td>Skills</td><td>${skillsStr || 'None Selected'}</td></tr>
                    </table>
                </body>
                </html>
                `);
                res.end();

            } catch (err) {
                console.error("Database Execution Interruption Details:", err);
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("<h3>Database Connection Error. Check password value strings or network whitelist config.</h3>");
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Page Route Not Found");
    }
});

// Start listener engine pipeline safely over universal web application port 3000
server.listen(3000, function () {
    console.log('Application Server successfully listening at: http://localhost:3000');
});
