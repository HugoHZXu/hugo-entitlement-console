#!/usr/bin/env bash
set -euo pipefail

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$HOME/.nvm/nvm.sh"
  if [ -f ".nvmrc" ]; then
    nvm use >/dev/null
  fi
fi

exec "$@"
