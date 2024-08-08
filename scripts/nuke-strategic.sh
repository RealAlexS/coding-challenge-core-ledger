#!/bin/sh

# Remove the current stack
pnpm run remove

# Remove .sst directory
rm -rf .sst/

# Remove node_modules directories
bash ./rm-node-modules.sh

# Remove pnpm-lock.yaml
rm -f pnpm-lock.yaml

# Reinstall dependencies
pnpm install

# Run the build script to recreate the .sst folder
pnpm run build
