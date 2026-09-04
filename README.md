<div align="center">

# TokoMart Mobile E2E Tests (Maestro)

End-to-end UI test automation for the TokoMart mobile app using [Maestro](https://maestro.mobile.dev/) — declarative YAML flows that run on Android and iOS without any test harness compiled into the app.

![TokoMart Maestro](docs/img/tokomart_maestro_1.png)

</div>

---

## Requirements

- [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro)
- Android emulator or iOS simulator (or a real device)
- TokoMart backend running and accessible at the configured `API_URL`

**Install Maestro:**
```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

---

## Setup

Copy `.env.example` to `.env` and fill in your values:

```env
APP_ID=com.example.TokoMart
EMAIL=your@email.com
PASSWORD=yourpassword
API_URL=http://10.0.2.2:5000
```

> `API_URL` uses `10.0.2.2` to reach `localhost` from an Android emulator. Use `127.0.0.1` for a real device or iOS simulator.

---

## Running Tests

```bash
# Run a single flow
maestro test tests/1_seller/add_product_simple_flow.yaml

# Run all flows in a directory
maestro test tests/

# Run by tag
maestro test tests/ --include-tags smoke
maestro test tests/ --exclude-tags wip

# Interactive selector explorer
maestro studio
```

---

## Project Structure

```
tests/
  0_auth/
    login_flow.yaml               # Shared login subflow (used by all tests)
    signup_flow.yaml
  1_seller/
    add_product_simple_flow.yaml  # TC-090
    add_product_variant_flow.yaml # TC-091
    edit_product_simple_flow.yaml # TC-616
    edit_product_variant_flow.yaml# TC-619
    delete_product_simple_flow.yaml
    delete_product_variant_flow.yaml
  2_buyer/
    simple_cod_checkout_flow.yaml
    simple_new_credit_checkout_flow.yaml
    simple_saved_credit_checkout_flow.yaml
    variant_cod_checkout_flow.yaml
    variant_new_credit_checkout_flow.yaml
    variant_saved_credit_checkout_flow.yaml

elements/
  loadElements.yaml       # Runs all selectors + API login; referenced by login_flow
  selectors/
    login.js              # output.login.*
    navBar.js             # output.navBar.*
    sellerDashboard.js    # output.sellerDashboard.*
    addEditProduct.js     # output.addEditProduct.* (wizard fields)
  clients/
    apiClients.js         # Performs API login; exposes output.TOKEN
    createProduct.js      # createSimpleProduct / createVariantProduct functions + SETUP_* flags
    deleteProduct.js      # Standalone teardown: finds product by name and deletes it
    generateData.js       # Generates a unique product name into output.PRODUCT_NAME
```

---

## Architecture

All flows start with:
```yaml
- runFlow: ../0_auth/login_flow.yaml
```

This runs `loadElements.yaml`, which loads all selector scripts and performs API login — making `output.*` selectors and `output.TOKEN` available throughout the flow.

> **Important:** `runFlow` resets the `output` scope. Any `runScript` calls that set `output.*` variables must come **after** `runFlow`, not before.

---

## Selector Namespaces

| Namespace | File | Example |
|---|---|---|
| `output.navBar.*` | `selectors/navBar.js` | `output.navBar.sellerNavTab` |
| `output.sellerDashboard.*` | `selectors/sellerDashboard.js` | `output.sellerDashboard.addProductFab` |
| `output.addEditProduct.*` | `selectors/addEditProduct.js` | `output.addEditProduct.pricing.simple.priceField` |

Dynamic IDs use a prefix pattern — append the variant or product identifier:
```yaml
id: "${output.addEditProduct.pricing.variant.priceField}M"   # → wizard_variant_price_field_M
id: "${output.sellerDashboard.editProductButton}${output.PRODUCT_ID}" # → edit_product_button_<id>
```

---

## API Helpers

### `createProduct.js`
Creates a product via API as a test precondition. Pass a flag via `env` to trigger creation:

```yaml
- runScript:
    file: ../../elements/clients/createProduct.js
    env:
      EMAIL: ${EMAIL}
      PASSWORD: ${PASSWORD}
      API_URL: ${API_URL}
      SETUP_SIMPLE: "true"    # creates a simple product
      # SETUP_VARIANT: "true" # creates a variant product
```

Sets `output.PRODUCT_ID` and `output.ORIGINAL_PRODUCT_NAME` for use in the flow.

### `deleteProduct.js`
Standalone teardown script. Pass the product name as an env var:

```yaml
- runScript:
    file: ../../elements/clients/deleteProduct.js
    env:
      EMAIL: ${EMAIL}
      PASSWORD: ${PASSWORD}
      API_URL: ${API_URL}
      PRODUCT_NAME: ${output.PRODUCT_NAME}
```

### `generateData.js`
Generates a unique product name using a timestamp:
```yaml
- runScript: ../../elements/clients/generateData.js
# sets output.PRODUCT_NAME = "TestProduct Name 1724934521234"
```

---

## Teardown Pattern

Every flow that creates data cleans up via API at the end:

```yaml
- runScript:
    file: ../../elements/clients/deleteProduct.js
    env:
      EMAIL: ${EMAIL}
      PASSWORD: ${PASSWORD}
      API_URL: ${API_URL}
      PRODUCT_NAME: ${output.PRODUCT_NAME}
```

If the product name was changed during the test, pass the updated name. If unchanged, pass `output.ORIGINAL_PRODUCT_NAME`.

---

## Tags

| Tag | Flows |
|---|---|
| `smoke` | Critical happy-path flows |
| `seller` | All seller flows |
| `add-product-simple` | TC-090 |
| `add-product-variant` | TC-091 |
| `edit-product-simple` | TC-616 |
| `edit-product-variant` | TC-619 |
