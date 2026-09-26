# RTK

RTK is the repository's shell-command wrapper for reducing command-output noise.

## Usage

Prefix supported project shell commands with `rtk`:

```text
rtk <command> [args...]
```

Use direct execution only when RTK is unavailable, incompatible with the operation,
changes required behavior, or RTK itself is being diagnosed.

## Enforcement

Every shell command in agent and contributor workflows MUST be prefixed with `rtk`.
Running a command bare — without the `rtk` prefix — is a policy violation equivalent
to bypassing a required check.

Permitted exceptions:
- The RTK diagnostic commands themselves: `rtk --version`, `rtk gain`.
- Cases where RTK is verifiably unavailable or broken; the reason must be stated
  explicitly, and the narrowest direct-execution fallback used.

## RTK Commands

These are RTK's own commands rather than wrapped project commands:

```text
rtk gain
rtk --version
```
