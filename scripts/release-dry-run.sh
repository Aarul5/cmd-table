#!/bin/bash
# Verifies a package can be published without actually publishing.
# Usage: bash scripts/release-dry-run.sh <package-name>
# Example: bash scripts/release-dry-run.sh cmd-table

set -e

PKG=${1:-cmd-table}
echo "Running release dry-run for: $PKG"

pnpm --filter "$PKG" build
pnpm --filter "$PKG" publish --dry-run --access public

echo ""
echo "✅ Dry-run complete for $PKG — ready to publish."
echo "To release: commit with message "release: $PKG <version>" and push to main."
