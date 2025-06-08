#!/usr/bin/env bash

echo "🚀 Initializing TRAE IDE ruleset..."

# Create folder structure
mkdir -p .trae/rules/{core,project,departments}
mkdir -p .trae/templates

# Core org enforcement rule
cat <<EOF > .trae/rules/core/00_architecture.rules
# TRAE CORE RULE: Enforce Org Chart Adherence
rule:
  id: core-architecture
  name: Org Chart Must Be Respected
  description: >
    All AI agents (PM, QA, Design, Code, Assets) must refer to
    ORG_CHART_FULL.png before taking independent action.
    If uncertain, agents must STOP and consult a human.
  phase: all
  level: error
EOF

# Project lifecycle step enforcement
cat <<EOF > .trae/rules/project/01_lifecycle.rules
# Enforce linear stage flow
rule:
  id: lifecycle-linear
  name: Linear Development Phases
  description: >
    Work must proceed through the following stages in order:
    PM Review → Department Contribution → PM Evaluation → QA → Release.
    No agent may skip, overlap, or fork a phase.
  phase: all
  level: warning
EOF

echo "✅ TRAE rules scaffolding generated in .trae/rules/"

