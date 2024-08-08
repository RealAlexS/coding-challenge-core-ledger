#!/bin/sh

# Remove node_modules directories
bash ./rm-node-modules.sh

# Remove pnpm-lock.yaml
rm -f pnpm-lock.yaml

# Reinstall dependencies
pnpm install
