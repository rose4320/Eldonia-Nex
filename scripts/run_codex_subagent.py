#!/usr/bin/env python3
"""
run_codex_subagent.py

Simple runner that calls OpenAI Codex (via the Completions API) to execute
sub-agent prompts. The script expects an environment variable `OPENAI_API_KEY`.

Usage:
  python scripts/run_codex_subagent.py --agent Explore --prompt "Find Dockerfiles" --thoroughness quick --output result.txt

Note: Replace model name if your Codex variant differs (e.g., code-davinci-002).
"""
import os
import sys
import argparse
import json
import urllib.request
import datetime
import traceback


def load_env_file(path: str = ".env") -> None:
    """Load simple KEY=VALUE pairs from a .env file into os.environ if not set.

    This is intentionally minimal to avoid adding dependencies. It ignores
    comments and blank lines. Existing environment variables are not overwritten.
    """
    if not os.path.exists(path):
        return
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = val
    except Exception:
        # Fail silently; any missing API key will be handled downstream.
        pass


DEFAULT_MODEL = "code-davinci-002"


def call_codex(api_key: str, model: str, prompt: str, max_tokens: int = 800, temperature: float = 0.2):
    url = "https://api.openai.com/v1/completions"
    payload = {
        "model": model,
        "prompt": prompt,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "n": 1,
        "stop": None,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {api_key}")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body)
    except Exception as e:
        # Try to surface HTTP error body if present
        try:
            if hasattr(e, 'read'):
                body = e.read().decode('utf-8')
                print(f"Codex API error body: {body}", file=sys.stderr)
        except Exception:
            pass
        print(f"Error calling Codex API: {e}", file=sys.stderr)
        traceback.print_exc()
        return None


def main():
    parser = argparse.ArgumentParser(description="Run an agent prompt using OpenAI Codex")
    parser.add_argument("--agent", required=True)
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--thoroughness", default="quick", choices=["quick", "medium", "thorough"])
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--max-tokens", type=int, default=800)
    parser.add_argument("--temperature", type=float, default=0.2)
    parser.add_argument("--output", help="Write raw completion text to this file")
    parser.add_argument("--raw", action="store_true", help="Write full JSON response instead of extracted text")
    parser.add_argument("--dry-run", action="store_true", help="Do not call API; print prompt and exit")
    parser.add_argument("--log", help="Append run metadata to this log file")
    args = parser.parse_args()

    # Try loading a local .env file if present (do not commit real secrets).
    load_env_file()

    full_prompt = f"Agent: {args.agent}\nThoroughness: {args.thoroughness}\nModel: {args.model}\nTimestamp: {datetime.datetime.utcnow().isoformat()}Z\n\n{args.prompt}\n"

    if args.dry_run:
        # Print prompt for inspection and exit successfully
        print("--- DRY RUN PROMPT START ---")
        print(full_prompt)
        print("--- DRY RUN PROMPT END ---")
        if args.log:
            try:
                with open(args.log, "a", encoding="utf-8") as lf:
                    lf.write(f"{datetime.datetime.utcnow().isoformat()}Z DRY_RUN agent={args.agent} model={args.model}\n")
            except Exception:
                pass
        sys.exit(0)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Missing OPENAI_API_KEY environment variable.", file=sys.stderr)
        sys.exit(2)

    if args.dry_run:
        # Print prompt for inspection and exit successfully
        print("--- DRY RUN PROMPT START ---")
        print(full_prompt)
        print("--- DRY RUN PROMPT END ---")
        if args.log:
            try:
                with open(args.log, "a", encoding="utf-8") as lf:
                    lf.write(f"{datetime.datetime.utcnow().isoformat()}Z DRY_RUN agent={args.agent} model={args.model}\n")
            except Exception:
                pass
        sys.exit(0)

    resp = call_codex(api_key, args.model, full_prompt, max_tokens=args.max_tokens, temperature=args.temperature)
    if not resp:
        if args.log:
            try:
                with open(args.log, "a", encoding="utf-8") as lf:
                    lf.write(f"{datetime.datetime.utcnow().isoformat()}Z ERROR agent={args.agent} model={args.model} call_failed\n")
            except Exception:
                pass
        sys.exit(1)

    # Optionally write raw JSON
    if args.raw:
        raw_text = json.dumps(resp, ensure_ascii=False, indent=2)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(raw_text)
            print(f"Wrote raw JSON result to {args.output}")
        else:
            print(raw_text)
    else:
        # Extract text
        text = ""
        try:
            choices = resp.get("choices") or []
            if choices:
                text = choices[0].get("text", "").strip()
        except Exception:
            pass

        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Wrote result to {args.output}")
        else:
            print(text)

    if args.log:
        try:
            with open(args.log, "a", encoding="utf-8") as lf:
                lf.write(f"{datetime.datetime.utcnow().isoformat()}Z OK agent={args.agent} model={args.model} output={'written' if args.output else 'stdout'}\n")
        except Exception:
            pass


if __name__ == "__main__":
    main()
