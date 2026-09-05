// findProduct.js
// Looks up a product by name via API and sets output.PRODUCT_ID.
// Requires PRODUCT_NAME, EMAIL, PASSWORD, API_URL env vars.

const apiUrl = API_URL;

const loginRes = http.post(`${apiUrl}/api/auth/login`, {
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    headers: { 'Content-Type': 'application/json' }
});
const token = JSON.parse(loginRes.body).token;
if (!token) {
    console.log('Login failed:', loginRes.body);
}

var match = null;
var attempts = 0;
var maxAttempts = 5;

while (!match && attempts < maxAttempts) {
    attempts++;
    var retryRes = http.get(`${apiUrl}/api/seller/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    var products = JSON.parse(retryRes.body).products;
    console.log('Attempt ' + attempts + ' — products returned: ' + products.length);
    match = products.find(function(p) { return p.name === PRODUCT_NAME; });

    if (!match && attempts < maxAttempts) {
        // busy-wait ~1s before retrying
        var wait = Date.now() + 1000;
        while (Date.now() < wait) {}
    }
}

if (!match) {
    console.log('Product not found after ' + maxAttempts + ' attempts:', PRODUCT_NAME);
} else {
    output.PRODUCT_ID = match._id;
    console.log('Found product ID:', output.PRODUCT_ID);
}
