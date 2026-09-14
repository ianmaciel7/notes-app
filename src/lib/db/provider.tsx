"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Repositories, createRepositories } from "./repositories";
import { KnowledgeDatabase, createKnowledgeDatabase } from "./schema";

interface DatabaseContextValue {
  database: KnowledgeDatabase | null;
  repositories: Repositories | null;
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  database: null,
  repositories: null,
  isReady: false,
});

let globalDatabaseInstance: KnowledgeDatabase | null = null;
let globalRepositoriesInstance: Repositories | null = null;

export function getDatabase(): KnowledgeDatabase {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB database can only be accessed in browser environments.");
  }
  if (!globalDatabaseInstance) {
    globalDatabaseInstance = createKnowledgeDatabase();
    globalRepositoriesInstance = createRepositories(globalDatabaseInstance);
  }
  return globalDatabaseInstance;
}

export function getRepositories(): Repositories {
  if (!globalRepositoriesInstance) {
    const db = getDatabase();
    globalRepositoriesInstance = createRepositories(db);
  }
  return globalRepositoriesInstance;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DatabaseContextValue>({
    database: null,
    repositories: null,
    isReady: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const db = getDatabase();
    const repos = getRepositories();

    repos.spaces.ensureDefaultSpaces().then(() => {
      setState({ database: db, repositories: repos, isReady: true });
    });
  }, []);

  return (
    <DatabaseContext.Provider value={state}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseContextValue {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider.");
  }
  return context;
}

export function useRepositories(): Repositories {
  const { repositories, isReady } = useDatabase();
  if (!isReady || !repositories) {
    throw new Error("Repositories accessed before database initialization completed.");
  }
  return repositories;
}
