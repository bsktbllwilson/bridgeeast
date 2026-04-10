#!/bin/zsh
setopt errexit

cd '/Users/wilwin/Bridge East'
output='claude-site-analysis-context.txt'

files=($(find . \
  \( -path './node_modules' -o -path './.next' -o -path './.git' -o -path './dist' -o -path './coverage' \) -prune -o \
  \( -name '.env*' -o -name '*.log' -o -name 'package-lock.json' -o -path './.vercel/*' -o -path './.github/*' -o -name 'page.tsx.backup' -o -name 'claude-site-analysis-context.txt' \) -prune -o \
  -type f -print | sort))

{
  printf 'BridgeEast Code Snapshot\n'
  printf 'Generated: %s\n\n' "$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  printf 'Notes:\n'
  printf -- '- Excludes .env files, node_modules, .next, .git, Vercel metadata, Copilot instructions, and package-lock.json\n'
  printf -- '- Includes app source, config, i18n messages, and Supabase schema/functions\n\n'

  printf 'Project Tree\n============\n'
  printf '%s\n' "${files[@]}"

  printf '\n\nFile Contents\n=============\n'
  for file in "${files[@]}"; do
    printf '\n\n--- FILE: %s ---\n\n' "$file"
    cat "$file"
  done
} > "$output"

wc -lc "$output"
printf '\nCreated %s\n' "$output"
