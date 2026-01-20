#!/usr/bin/env bash
set -euo pipefail

echo "== Install =="
npm install

echo "== Test =="
npm test

echo "== Build =="
npm run build

echo "== Demo 1: SOC2 =="
npm start -- "Do we have SOC2 and where is it?"

echo "== Demo 2: Pricing exception policy =="
npm start -- "What’s our pricing exception policy?"

echo "== Demo 3: Draft follow-up (security timeline) on D-103 =="
npm start -- "Draft a follow-up asking for security review timeline on D-103."

echo "== Demo 4: Goal prompt (status + next steps) =="
npm start -- "What’s the status of deal D-103 and what should I do next?"

echo "✅ All demos ran successfully."