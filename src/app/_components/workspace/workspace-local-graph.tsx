import { Button } from "@/components/ui/button";
import type { LocalEntityGraph } from "@/lib/spaces/space-graph";

export function WorkspaceLocalGraph({
  graph,
  onOpenEntity,
}: {
  graph: LocalEntityGraph;
  onOpenEntity?: (id: string) => void;
}) {
  const nodes = graph.nodes.map((node, index) => {
    const angle = ((index - 1) / Math.max(1, graph.nodes.length - 1)) * Math.PI * 2;
    return {
      ...node,
      x: index === 0 ? 150 : 150 + Math.cos(angle) * 115,
      y: index === 0 ? 150 : 150 + Math.sin(angle) * 115,
    };
  });
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return (
    <div className="space-y-3">
      <svg
        viewBox="0 0 300 300"
        role="img"
        aria-label="Conexões do objeto"
        className="w-full text-muted-foreground"
      >
        <title>Conexões do objeto</title>
        {graph.edges.map((edge) => {
          const source = byId.get(edge.sourceId);
          const target = byId.get(edge.targetId);
          return source && target ? (
            <line
              key={edge.id}
              data-slot="graph-edge"
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="currentColor"
            />
          ) : null;
        })}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.depth === 0 ? 10 : 7}
            className={node.depth === 0 ? "fill-primary" : "fill-muted-foreground"}
          >
            <title>{node.title}</title>
          </circle>
        ))}
      </svg>
      <ul className="space-y-1">
        {nodes.map((node) => (
          <li key={node.id}>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start whitespace-normal text-left"
              disabled={!onOpenEntity}
              onClick={() => onOpenEntity?.(node.id)}
            >
              {node.title || "Sem título"}
            </Button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        {graph.nodes.length} objetos · {graph.edges.length} relações salvas
      </p>
    </div>
  );
}
