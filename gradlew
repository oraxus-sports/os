#!/usr/bin/env bash
DIRNAME="$(cd "$(dirname "$0")" && pwd)"
TARGET="$DIRNAME/app-services/user/gradlew"
if [ -x "$TARGET" ]; then
  exec "$TARGET" "$@"
else
  echo "ERROR: Could not find delegated Gradle wrapper at $TARGET" >&2
  exit 1
fi
