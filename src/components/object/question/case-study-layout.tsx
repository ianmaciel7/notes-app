"use client";

import { BookOpenIcon } from "lucide-react";
import { MarkdownPrompt } from "@/components/object/question/markdown-prompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaseStudyContext } from "@/types/question";

interface CaseStudyLayoutProps {
  caseStudy: CaseStudyContext;
  children: React.ReactNode;
}

export function CaseStudyLayout({ caseStudy, children }: CaseStudyLayoutProps) {
  const defaultTab = caseStudy.tabs[0]?.id || "tab-0";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Case Study Context Column */}
      <div className="lg:col-span-6">
        <Card className="flex h-full flex-col border-border/80 bg-card shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpenIcon className="size-4" />
              </span>
              <CardTitle className="text-base font-semibold text-foreground">
                {caseStudy.title}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4 sm:p-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="mb-4 flex w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
                {caseStudy.tabs.map((tab, idx) => {
                  const tabId = tab.id || `tab-${idx}`;
                  return (
                    <TabsTrigger
                      key={tabId}
                      value={tabId}
                      className="px-3 py-1.5 text-xs font-medium"
                    >
                      {tab.title}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {caseStudy.tabs.map((tab, idx) => {
                const tabId = tab.id || `tab-${idx}`;
                return (
                  <TabsContent
                    key={tabId}
                    value={tabId}
                    className="focus-visible:outline-none"
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
                      <MarkdownPrompt prompt={tab.content} />
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Question Column */}
      <div className="lg:col-span-6">{children}</div>
    </div>
  );
}
