import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellMobile,
  AppShellMobileSidebar,
  AppShellMobileSidePanel,
  AppShellPanelGroup,
  AppShellProvider,
  AppShellSidebar,
  AppShellSidebarTrigger,
  AppShellSidePanel,
  AppShellSurface,
  AppShellWorkspace,
} from "@/components/app-shell";
import {
  WorkspaceNewContentDialogController,
  WorkspaceSidebar,
} from "@/components/app-sidebar-primary-actions-command-dialog";
import { FocusModeProvider } from "@/components/focus-mode-provider";
import {
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
} from "@/components/space-controller";
import { WorkspaceFlashcardReviewPanel } from "@/components/workspace-flashcard-review-panel";
import { WorkspaceStudyGoalDashboard } from "@/components/workspace-study-goal-dashboard";

export default function HomePage() {
  return (
    <AppShellProvider>
      <FocusModeProvider>
        <WorkspaceProvider>
          <WorkspaceNewContentDialogController />

          <AppShell>
            <AppShellPanelGroup>
              <AppShellSidebar>
                <WorkspaceSidebar />
              </AppShellSidebar>

              <AppShellWorkspace>
                <AppShellMain>
                  <WorkspaceMainHeader />
                  <AppShellSurface className="h-full w-full">
                    <div className="flex h-full min-h-0 flex-col">
                      <WorkspaceStudyGoalDashboard />
                      <div className="min-h-0 flex-1">
                        <WorkspaceFlashcardReviewPanel />
                      </div>
                    </div>
                  </AppShellSurface>
                </AppShellMain>

                <AppShellSidePanel>
                  <WorkspaceSidePanelHeader />
                  <AppShellSurface side="side-panel" className="h-full w-full" />
                </AppShellSidePanel>
              </AppShellWorkspace>
            </AppShellPanelGroup>

            <AppShellSidebarTrigger />
          </AppShell>

          <AppShellMobile>
            <AppShellHeader className="relative">
              <AppShellMobileSidebar>
                <WorkspaceSidebar />
              </AppShellMobileSidebar>
              <AppShellMobileSidePanel className="flex flex-col p-0">
                <WorkspaceSidePanelHeader />
                <AppShellSurface side="side-panel" className="h-full w-full" />
              </AppShellMobileSidePanel>
            </AppShellHeader>
            <AppShellSurface className="h-full w-full">
              <div className="flex h-full min-h-0 flex-col">
                <WorkspaceStudyGoalDashboard />
                <div className="min-h-0 flex-1">
                  <WorkspaceFlashcardReviewPanel />
                </div>
              </div>
            </AppShellSurface>
          </AppShellMobile>
        </WorkspaceProvider>
      </FocusModeProvider>
    </AppShellProvider>
  );
}
