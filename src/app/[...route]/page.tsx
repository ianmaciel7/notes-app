import { WorkspaceShell } from "@/components/workspace-shell";

export default async function WorkspaceRoutePage({
  params,
}: PageProps<"/[...route]">) {
  const { route } = await params;
  return <WorkspaceShell pathname={`/${route.join("/")}`} />;
}
