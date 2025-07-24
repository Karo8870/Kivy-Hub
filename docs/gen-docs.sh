#!/bin/bash

# Exit on error
set -e

# Function to convert string to kebab-case
to_kebab_case() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Function to create _meta.ts with only direct children, preserving original order
create_meta_file() {
  local dir="$1"
  local json="$2"

  # Start meta file
  echo 'import type { MetaRecord } from '"'"'nextra'"'"';' > "$dir/_meta.ts"
  echo "" >> "$dir/_meta.ts"
  echo "export default {" >> "$dir/_meta.ts"

  # Get all direct keys in their original order
  # Using to_entries to preserve original order instead of keys which sorts alphabetically
  local keys_json=$(echo "$json" | jq -c 'to_entries | map(.key)')

  # Count the number of keys for comma handling
  local key_count=$(echo "$keys_json" | jq 'length')
  local current_index=0

  # Process each key in original order
  echo "$keys_json" | jq -r '.[]' | while read -r key; do
    # Skip if empty
    [ -z "$key" ] && continue

    # Convert to kebab case
    local kebab_key=$(to_kebab_case "$key")

    # Add to meta file
    echo "  '$kebab_key': {" >> "$dir/_meta.ts"
    echo "    title: '$key'" >> "$dir/_meta.ts"

    # Add comma if not the last item
    current_index=$((current_index + 1))
    if [ $current_index -lt $key_count ]; then
      echo "  }," >> "$dir/_meta.ts"
    else
      echo "  }" >> "$dir/_meta.ts"
    fi
  done

  # Close file
  echo "} as MetaRecord;" >> "$dir/_meta.ts"
}

# Function to process JSON
process_node() {
  local json="$1"
  local path="$2"

  # Create directory
  mkdir -p "$path"

  # Check if this node has children
  local has_children=$(echo "$json" | jq 'keys | length > 0')

  if [ "$has_children" = "true" ]; then
    # Create _meta.ts for this directory
    create_meta_file "$path" "$json"

    # Get keys in original order using to_entries
    local keys_json=$(echo "$json" | jq -c 'to_entries | map(.key)')

    # Process each key in the original order from the JSON
    echo "$keys_json" | jq -r '.[]' | while read -r key; do
      # Skip if empty
      [ -z "$key" ] && continue

      # Convert to kebab case for directory name - preserving original key
      local kebab_key=$(to_kebab_case "$key")
      local child_path="$path/$kebab_key"

      # Get child JSON using the exact original key
      local child_json=$(echo "$json" | jq -c --arg key "$key" '.[$key]')

      # Process child node
      process_node "$child_json" "$child_path"
    done
  else
    # Create empty page.mdx for leaf nodes
    touch "$path/page.mdx"
  fi
}

# Main function
main() {
  if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <json_file> [output_directory]"
    exit 1
  fi

  json_file="$1"
  output_dir="${2:-./output}"

  if [ ! -f "$json_file" ]; then
    echo "Error: JSON file not found: $json_file"
    exit 1
  fi

  # Create and clear output directory
  mkdir -p "$output_dir"
  rm -rf "$output_dir"/*

  # Read JSON and process
  json_content=$(cat "$json_file")
  process_node "$json_content" "$output_dir"

  echo "Folder structure created successfully in $output_dir"
}

main "$@"