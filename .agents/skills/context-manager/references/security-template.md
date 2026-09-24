# SECURITY.md Template

## Document Purpose

`SECURITY.md` owns security posture: disclosure, supported-release policy,
secrets/sensitive data, trust-boundary validation, authentication/authorization,
security tooling, and remediation policy. Blocking numeric floors may be referenced
from `CONSTRAINTS.md` rather than duplicated.

## Canonical Structure

```markdown
# Security Policy & Guidelines

## 1. Reporting a Vulnerability
[Private reporting path and disclosure expectations.]

## 2. Supported Versions
[Real release support policy; if pre-release, say there is no matrix.]

## 3. Secrets & Environment Configuration
[Secret storage, logs, env handling.]

## 4. Input & Data Boundaries
[Validation/sanitization at trust boundaries that actually exist.]

## 5. Authentication & Authorization
[Current model or explicit absence; ownership checks when implemented.]

## 6. Security Tooling
[Configured dependency, secret, static-analysis, and workflow-security scanners.]
```

## Governance Rules

1. Do not publish transient vulnerability findings as long-lived policy; scanner
   output owns current findings.
2. Never invent auth/data defenses before those boundaries exist.
3. Keep branch names out of supported-version policy unless a branch is truly a
   maintained security-support channel.
4. Ground CI/security-automation claims in actual workflows/configuration.
