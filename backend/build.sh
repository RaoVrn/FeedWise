#!/usr/bin/env bash

# Optional: Ensure virtualenv exists
python -m venv .venv
source .venv/bin/activate

# Upgrade pip and install wheel
pip install --upgrade pip wheel setuptools

# Install dependencies
pip install -r requirements.txt
