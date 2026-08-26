// createProduct.js

const apiUrl = API_URL;

const loginRes = http.post(`${apiUrl}/api/auth/login`, {
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    headers: { 'Content-Type': 'application/json' }
});
const token = JSON.parse(loginRes.body).token;

function createSimpleProduct(name) {
    const res = http.post(`${apiUrl}/api/seller/products`, {
        body: JSON.stringify({
            name: name,
            description: 'E2E test product — auto-created by Maestro',
            category: 'Home & Garden',
            condition: 'new',
            price: 29.99,
            stock: 10,
            shippingOptions: ['standard'],
            shippingFee: 'free',
        }),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const productId = JSON.parse(res.body).product._id;
    console.log('Created simple product ID:', productId);
    return productId;
}

function createVariantProduct(name) {
    const res = http.post(`${apiUrl}/api/seller/products`, {
        body: JSON.stringify({
            name: name,
            description: 'E2E test variant product — auto-created by Maestro',
            category: 'Clothing',
            condition: 'new',
            price: 29.99,
            stock: 0,
            shippingOptions: ['standard'],
            shippingFee: 'free',
            variantAttributes: [
                {
                    name: 'Size',
                    values: ['S', 'M', 'L'],
                }
            ],
            variants: [
                { attributes: { Size: 'S' }, price: 24.99, stock: 5 },
                { attributes: { Size: 'M' }, price: 29.99, stock: 5 },
                { attributes: { Size: 'L' }, price: 34.99, stock: 5 },
            ],
        }),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const productId = JSON.parse(res.body).product._id;
    console.log('Created variant product ID:', productId);
    return productId;
}

output.createSimpleProduct = createSimpleProduct;
output.createVariantProduct = createVariantProduct;
