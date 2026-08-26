// teardown.js

const apiUrl = API_URL;

const loginRes = http.post(`${apiUrl}/api/auth/login`, {
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    headers: { 'Content-Type': 'application/json' }
});
const token = JSON.parse(loginRes.body).token;

const productsRes = http.get(`${apiUrl}/api/seller/products`, {
    headers: { 'Authorization': `Bearer ${token}` }
});
const products = JSON.parse(productsRes.body).products;
const match = products.find(p => p.name === PRODUCT_NAME);

if (!match) {
    console.log('Product not found:', PRODUCT_NAME);
} else {
    console.log('Deleting product ID:', match._id);
    const deleteRes = http.delete(`${apiUrl}/api/seller/products/${match._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Delete status:', deleteRes.statusCode);
    console.log('Delete body:', deleteRes.body);
}
