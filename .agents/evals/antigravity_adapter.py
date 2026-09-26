#!/usr/bin/env python3
import argparse, asyncio, json, time
from google.antigravity import Agent, LocalAgentConfig, types
from google.antigravity.hooks import policy

async def run(workspace: str, prompt: str) -> None:
    config = LocalAgentConfig(
        workspaces=[workspace],
        capabilities=types.CapabilitiesConfig(
            run_command_config=types.RunCommandConfig(enable_sandbox=True),
        ),
        policies=[policy.allow_all()],
        system_instructions=(
            "You are running a disposable repository behavioral evaluation. "
            "Work only inside the configured workspace, follow AGENTS.md, and finish the requested task."
        ),
    )
    started=time.perf_counter()
    calls=[]
    async with Agent(config) as agent:
        response=await agent.chat(prompt)
        async for call in response.tool_calls:
            calls.append({"name":str(call.name),"args":call.args})
        final_text=await response.text()
    print(json.dumps({"events":[{"type":"tool_call",**c} for c in calls],"finalText":final_text,"durationMs":round((time.perf_counter()-started)*1000)}))

def main() -> None:
    parser=argparse.ArgumentParser()
    parser.add_argument("--workspace",required=True); parser.add_argument("--prompt",required=True)
    args=parser.parse_args(); asyncio.run(run(args.workspace,args.prompt))

if __name__=="__main__": main()
