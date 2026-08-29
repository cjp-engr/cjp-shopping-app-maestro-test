# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains [Maestro](https://maestro.mobile.dev/) UI test flows for a shopping app (TokoMart). Maestro is a mobile UI testing framework that uses YAML-based flow files.

## Running Tests

```bash
# Run a specific flow
maestro test tests/0_auth/login_flow.yaml

# Run all flows in a directory
maestro test tests/

# Run by tag
maestro test tests/ --include-tags smoke
maestro test tests/ --exclude-tags wip
```

Environment variables are loaded automatically from `.env` in the project root.

## Project Structure

```
tests/
  0_auth/          # Auth flows (login, signup)
  1_seller/        # Seller flows (add/edit/delete products)
  2_buyer/         # Buyer flows (checkout variants)
elements/
  selectors/       # JS files exporting element IDs into output.*
  clients/         # JS files for API calls (login, create, delete products)
  loadElements.yaml  # Runs all selector + API scripts; referenced by auth flows
```

## Flow Architecture

All test flows start with `runFlow: ../0_auth/login_flow.yaml`, which runs `loadElements.yaml`. This loads all element selectors and performs API login, making `output.*` variables and `output.TOKEN` available throughout the flow.

Element IDs are defined in `elements/selectors/*.js` and accessed in YAML as `${output.<namespace>.<key>}`. Example: `${output.navBar.sellerNavTab}`.

## API Helpers

`elements/clients/apiClients.js` — handles login and exposes `findProductByName()` and `deleteProduct()` via `output`.

`elements/clients/createProduct.js` — exposes `createSimpleProduct()` and `createVariantProduct()` via `output`.

`elements/clients/deleteProduct.js` — standalone teardown script; accepts `PRODUCT_NAME` env and deletes the matching product via API.

`elements/clients/generateData.js` — generates a random product name into `output.PRODUCT_NAME`.

All client scripts use Maestro's GraalJS runtime: no `async/await`, no `fetch()` — use `http.get()`/`http.post()`/`http.delete()` and `output.*` for return values.

## Environment Variables

Defined in `.env` (auto-loaded by Maestro CLI):

```
APP_ID=com.example.TokoMart
EMAIL=
PASSWORD=
API_URL=http://10.0.2.2:5000
```

## Teardown Pattern

Flows that create data clean up via API at the end using `elements/clients/deleteProduct.js` with `PRODUCT_NAME: ${output.PRODUCT_NAME}`.
