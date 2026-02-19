#!/bin/bash
# Purpose: Scaffold EF Core entities + MyDbContext from the SQLite DB.
# Prerequisites:
#   - .NET SDK installed and available on PATH
#   - dotnet-ef tool (script will install/update global tool v10.*)
#   - .env file in this directory containing CONN_STR
# Notes:
#   - Outputs entities to ./Entities (script-relative)
#   - Context class: MyDbContext, namespace: Infrastructure.Sqlite.Scaffolding

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<EOF
Usage: $(basename "$0")

Scaffolds EF Core entities and DbContext from SQLite using CONN_STR from:
$SCRIPT_DIR/.env

Requirements:
- dotnet SDK installed
- .env file at script location with CONN_STR set
EOF
  exit 0
fi

set -euo pipefail

cd "$SCRIPT_DIR"
set -a
source "$SCRIPT_DIR/.env"
set +a

dotnet tool update -g dotnet-ef --version 10.* || dotnet tool install -g dotnet-ef --version 10.*

dotnet ef dbcontext scaffold "${CONN_STR:?CONN_STR is required}" Microsoft.EntityFrameworkCore.Sqlite \
    --project "$SCRIPT_DIR/efscaffold.csproj" \
    --output-dir "$SCRIPT_DIR/Entities" \
    --context-dir "$SCRIPT_DIR" \
    --context MyDbContext \
    --no-onconfiguring \
    --namespace EfScaffold.Entities \
    --context-namespace Infrastructure.Sqlite.Scaffolding \
    --table todos \
    --force
