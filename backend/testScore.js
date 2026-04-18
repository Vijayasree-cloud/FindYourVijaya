const http = require('http');

const data = JSON.stringify({
  resumeText: "React developer with 5 years experience",
  targetRole: "Software Engineer"
});

const req = http.request('http://localhost:5000/api/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', console.error);
req.write(data);
req.end();
