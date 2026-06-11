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
        print(f"Error calling Codex API: {e}", file=sys.stderr)
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
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Missing OPENAI_API_KEY environment variable.", file=sys.stderr)
        sys.exit(2)

    full_prompt = f"Agent: {args.agent}\nThoroughness: {args.thoroughness}\n\n{args.prompt}\n"

    resp = call_codex(api_key, args.model, full_prompt, max_tokens=args.max_tokens, temperature=args.temperature)
    if not resp:
        sys.exit(1)

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


if __name__ == "__main__":
    main()
