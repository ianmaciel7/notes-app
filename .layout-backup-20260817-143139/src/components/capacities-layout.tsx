import type { ReactNode } from "react";

import {
  CapacitiesSidebarIcon,
  type CapacitiesSidebarIconName,
} from "@/components/capacities-sidebar-icon";

function NavItem({
  icon,
  children,
  active = false,
  count,
}: {
  icon: CapacitiesSidebarIconName;
  children: ReactNode;
  active?: boolean;
  count?: number;
}) {
  return (
    <div className={active ? "cap-nav-item active" : "cap-nav-item"}>
      <span className="cap-nav-icon">
        <CapacitiesSidebarIcon name={icon} />
      </span>

      <span className="cap-nav-label">{children}</span>

      {count !== undefined ? (
        <span className="cap-nav-count">{count}</span>
      ) : null}
    </div>
  );
}

function SectionTitle({
  icon,
  children,
  count,
}: {
  icon: CapacitiesSidebarIconName;
  children: ReactNode;
  count?: number;
}) {
  return (
    <div className="cap-section-title">
      <CapacitiesSidebarIcon name={icon} />
      <span>{children}</span>

      {count !== undefined ? (
        <span className="cap-section-count">{count}</span>
      ) : null}
    </div>
  );
}

function TopButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button aria-label={label} className="cap-top-button" type="button">
      {children}
    </button>
  );
}

export function CapacitiesLayout() {
  return (
    <div className="cap-app">
      <header className="cap-workspace-header">
        <button className="cap-workspace-picker" type="button">
          <CapacitiesSidebarIcon name="workspace" />
          <span>Teste</span>
          <CapacitiesSidebarIcon name="switch" />
        </button>

        <button
          aria-label="Recolher barra lateral"
          className="cap-sidebar-toggle"
          type="button"
        >
          <CapacitiesSidebarIcon name="sidebar" />
        </button>
      </header>

      <header className="cap-main-header">
        <TopButton label="Voltar">‹</TopButton>
        <TopButton label="Avançar">›</TopButton>

        <button className="cap-active-tab" type="button">
          <span className="cap-active-tab-icon">
            <CapacitiesSidebarIcon name="page" />
          </span>

          <span>Sem título</span>

          <span className="cap-active-tab-close">×</span>
        </button>

        <TopButton label="Novo">+</TopButton>

        <div className="cap-grow" />

        <TopButton label="Layout amplo">↗</TopButton>
      </header>

      <header className="cap-context-header">
        <button className="cap-context-tab" type="button">
          <span>◉</span>
          <span>Explorar</span>
          <span>×</span>
        </button>

        <TopButton label="Nova aba">+</TopButton>

        <div className="cap-grow" />

        <TopButton label="Fechar painel">▯</TopButton>
        <TopButton label="Mais opções">⌄</TopButton>
      </header>

      <aside className="cap-sidebar">
        <div className="cap-sidebar-primary">
          <NavItem icon="add">Novo</NavItem>
          <NavItem icon="search">Buscar</NavItem>

          <div className="cap-nav-gap" />

          <NavItem icon="rocket">Explorar</NavItem>
          <NavItem icon="calendar">Calendário</NavItem>
        </div>

        <div className="cap-sidebar-scroll">
          <section>
            <SectionTitle count={0} icon="pin">
              Fixados
            </SectionTitle>

            <p className="cap-empty">Nenhum conteúdo fixado</p>
          </section>

          <section>
            <SectionTitle count={1} icon="types">
              Tipos de objeto
            </SectionTitle>

            <NavItem active count={1} icon="page">
              Páginas
            </NavItem>

            <button className="cap-add-section" type="button">
              <span>+</span>
              <span>Adicionar seção</span>
            </button>
          </section>

          <div className="cap-trash">
            <NavItem icon="trash">Lixeira</NavItem>
          </div>

          <section className="cap-help">
            <SectionTitle icon="help">Ajuda e recursos</SectionTitle>

            <NavItem icon="graduation">Primeiros passos</NavItem>
            <NavItem icon="help">Fazer uma pergunta</NavItem>
            <NavItem icon="documentation">Documentação</NavItem>
            <NavItem icon="news">Novidades</NavItem>
            <NavItem icon="feedback">Feedback</NavItem>
          </section>
        </div>

        <footer className="cap-sidebar-footer">
          <CapacitiesSidebarIcon name="settings" />
          <CapacitiesSidebarIcon name="moon" />
          <CapacitiesSidebarIcon name="user" />

          <span className="cap-pro">
            <CapacitiesSidebarIcon name="rocket" />
            Pro
          </span>

          <div className="cap-grow" />

          <CapacitiesSidebarIcon name="share" />
        </footer>
      </aside>

      <main className="cap-main-card">
        <article className="cap-editor">
          <h1>Sem título</h1>

          <div className="cap-meta">
            <span className="cap-type">
              <span>
                <CapacitiesSidebarIcon name="page" />
              </span>
              Página
            </span>

            <button type="button">Coleções</button>
            <button type="button">Personalizar</button>
          </div>

          <div className="cap-divider" />

          <div className="cap-property">
            <span>Etiquetas</span>
            <span>—</span>
          </div>

          <div className="cap-caret" />
        </article>
      </main>

      <aside className="cap-context-card">
        <div className="cap-context-content">
          <h2>Explorar</h2>
          <p className="cap-context-description">
            Abra conteúdo relevante, inicie um chat de IA ou visualize o grafo
            para ampliar o contexto do seu trabalho.
          </p>

          <button className="cap-context-row" type="button">
            <CapacitiesSidebarIcon name="rocket" />
            Explorar
          </button>

          <button className="cap-context-row" type="button">
            <CapacitiesSidebarIcon name="types" />
            Visualização em grafo
          </button>

          <button className="cap-context-row" type="button">
            <CapacitiesSidebarIcon name="weblink" />
            Links de entrada
          </button>

          <button className="cap-context-row" type="button">
            <CapacitiesSidebarIcon name="types" />
            Objetos internos
          </button>

          <button className="cap-context-row" type="button">
            <CapacitiesSidebarIcon name="page" />
            Conteúdo relacionado
          </button>

          <button className="cap-context-row" type="button">
            <CapacitiesSidebarIcon name="chat" />
            Chat de IA
          </button>

          <div className="cap-search">
            <CapacitiesSidebarIcon name="search" />
            Buscar
          </div>
        </div>
      </aside>
    </div>
  );
}
