# CLI Tool

`cmd-table` includes a standalone CLI for formatting data directly in the terminal.

## Installation

The CLI is included with the package — no extra install needed:

```bash
# Via npx (no install)
echo '[{"name":"Alice"}]' | npx cmd-table

# Or install globally
npm install -g cmd-table
cat data.json | cmd-table
```

## Usage

```bash
cat <file> | cmd-table [options]
```

Pipe JSON or CSV data into `cmd-table` and it renders a formatted table instantly.

## Options

| Flag | Description | Example |
|---|---|---|
| `--columns` | Comma-separated list of columns to display | `--columns=name,age,city` |
| `--theme` | Built-in theme name | `--theme=double` |
| `--format` | Input format: `json` or `csv` (auto-detected if omitted) | `--format=csv` |
| `--interactive` | Launch interactive TUI mode | `--interactive` |
| `--help` | Show help | `--help` |

## Examples

### Format JSON

```bash
# Simple JSON array
echo '[{"name":"Alice","age":30},{"name":"Bob","age":25}]' | npx cmd-table
```

**Output:**
```
╭───────┬─────╮
│ name  │ age │
├───────┼─────┤
│ Alice │ 30  │
│ Bob   │ 25  │
╰───────┴─────╯
```

### Format CSV

CSV is auto-detected — no need to specify `--format`:

```bash
echo "name,age,city
Alice,30,NYC
Bob,25,LA" | npx cmd-table
```

### Select Specific Columns

```bash
cat employees.json | npx cmd-table --columns=name,department,salary
```

### Apply a Theme

```bash
cat data.json | npx cmd-table --theme=double
```

### Interactive Mode

Launch the full TUI with search, pagination, and sorting:

```bash
cat large_dataset.csv | npx cmd-table --interactive
```

::: tip
Interactive mode is perfect for exploring CSV exports, log files, or API responses directly in the terminal.
:::

## Auto-Detection

The CLI automatically detects whether input is JSON or CSV:

- **JSON**: Starts with `[` or `{`
- **CSV**: Contains commas/tabs and newlines

You can override with `--format=json` or `--format=csv` if auto-detection gets it wrong.

## Real-World Examples

### Explore a JSON API

```bash
curl -s https://api.example.com/users | npx cmd-table --interactive
```

### Format a CSV Report

```bash
cat monthly_sales.csv | npx cmd-table --columns=product,revenue,units --theme=bold
```

### Pipeline with jq

```bash
cat complex.json | jq '.data.items' | npx cmd-table
```
