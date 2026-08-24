// apiClients.js

const apiUrl = API_URL;

const response = http.post(`${apiUrl}/api/auth/login`, {
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    headers: { 'Content-Type': 'application/json' }
});

const body = JSON.parse(response.body);
output.TOKEN = body.token;
console.log('Token:', output.TOKEN);