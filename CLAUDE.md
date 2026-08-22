# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains [Maestro](https://maestro.mobile.dev/) UI test flows for a shopping app. Maestro is a mobile UI testing framework that uses YAML-based flow files.

## Running Tests

```bash
# Run a specific flow
maestro test login_flow.yaml

# Run with environment variables
maestro test login_flow.yaml -e APP_ID=com.example.app -e EMAIL=user@example.com -e PASSWORD=secret

# Run all flows in the directory
maestro test .
```

## Flow Structure

Flows use YAML with a header block (separated by `---`) for app-level config, followed by a list of commands:

```yaml
appId: ${APP_ID}   # Required: bundle ID / package name; use env vars for flexibility
---
- launchApp:
    clearState: true
- tapOn: <label>
- inputText: <value>
- assertVisible: <text>
```

Environment variables are referenced as `${VAR_NAME}` and passed via `-e KEY=value` flags at runtime.
