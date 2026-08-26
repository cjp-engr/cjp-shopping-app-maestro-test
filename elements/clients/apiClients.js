// apiClients.js

const apiUrl = API_URL;

// Auth
const loginRes = http.post(`${apiUrl}/api/auth/login`, {
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    headers: { 'Content-Type': 'application/json' }
});
const token = JSON.parse(loginRes.body).token;
output.TOKEN = token;
console.log('Token:', output.TOKEN);
