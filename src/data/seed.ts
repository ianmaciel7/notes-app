import type {
  BackupEnvelope,
  CardRecord,
  CardSchedule,
  DeckRecord,
  ReviewLogRecord,
  UserSettingsRecord,
} from "@/data/types";
import { type RevisaDatabase, db, replaceDatabase } from "@/data/db";

/**
 * Generates rich, realistic seed data dynamically anchored to the current timestamp.
 */
export function generateRealisticSeedData(baseDate = new Date()): BackupEnvelope {
  const now = baseDate.getTime();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  const iso = (msOffset: number) => new Date(now + msOffset).toISOString();

  // 1. Decks
  const deck1Id = "deck-js-ts";
  const deck2Id = "deck-english-idioms";
  const deck3Id = "deck-const-law";
  const deck4Id = "deck-anatomy-physio";

  const decks: DeckRecord[] = [
    {
      id: deck1Id,
      name: "JavaScript & TypeScript Essencial",
      description: "Conceitos fundamentais do runtime, tipagem estática e assincronismo.",
      createdAt: iso(-14 * ONE_DAY),
      updatedAt: iso(-2 * ONE_DAY),
    },
    {
      id: deck2Id,
      name: "Inglês para Conversação & Expressões",
      description: "Expressões idiomáticas, phrasal verbs e vocabulário avançado para fluência.",
      createdAt: iso(-14 * ONE_DAY),
      updatedAt: iso(-1 * ONE_DAY),
    },
    {
      id: deck3Id,
      name: "Direito Constitucional & Direitos Fundamentais",
      description: "Princípios fundamentais, garantias individuais e organização do Estado (CF/88).",
      createdAt: iso(-12 * ONE_DAY),
      updatedAt: iso(-3 * ONE_DAY),
    },
    {
      id: deck4Id,
      name: "Anatomia & Fisiologia Humana",
      description: "Sistemas cardiovascular, nervoso, respiratório e funções orgânicas essenciais.",
      createdAt: iso(-10 * ONE_DAY),
      updatedAt: iso(-1 * ONE_DAY),
    },
  ];

  // 2. Cards
  const cards: CardRecord[] = [
    // Deck 1: JS & TS
    {
      id: "card-js-1",
      deckId: deck1Id,
      front: "O que é um Closure em JavaScript?",
      back: "É a combinação de uma função agrupada com o seu escopo léxico circundante. O closure permite que uma função interna acesse variáveis da função externa mesmo após a função externa ter retornado.",
      createdAt: iso(-14 * ONE_DAY),
      updatedAt: iso(-14 * ONE_DAY),
    },
    {
      id: "card-js-2",
      deckId: deck1Id,
      front: "Qual a diferença prática entre `null` e `undefined`?",
      back: "`undefined` indica que uma variável foi declarada mas ainda não recebeu um valor definido (ou propriedade inexistente).\n`null` representa uma ausência intencional e explícita de valor ou objeto.",
      createdAt: iso(-14 * ONE_DAY),
      updatedAt: iso(-14 * ONE_DAY),
    },
    {
      id: "card-js-3",
      deckId: deck1Id,
      front: "Qual a diferença entre o tipo `unknown` e o tipo `any` no TypeScript?",
      back: "`unknown` é a versão 'type-safe' de `any`. Qualquer valor pode ser atribuído a `unknown`, mas você não pode chamar métodos ou atribuí-lo a outros tipos sem antes fazer uma verificação de tipo (narrowing).",
      createdAt: iso(-13 * ONE_DAY),
      updatedAt: iso(-13 * ONE_DAY),
    },
    {
      id: "card-js-4",
      deckId: deck1Id,
      front: "Como funciona a prioridade entre Microtasks (Promises) e Macrotasks (setTimeout) no Event Loop?",
      back: "A fila de Microtasks tem prioridade máxima: todas as microtasks pendentes são processadas completamente antes que o Event Loop execute a próxima macrotask da fila.",
      createdAt: iso(-12 * ONE_DAY),
      updatedAt: iso(-12 * ONE_DAY),
    },
    {
      id: "card-js-5",
      deckId: deck1Id,
      front: "O que o operador `satisfies` faz no TypeScript 4.9+?",
      back: "Ele valida se uma expressão corresponde a um tipo específico sem alterar ou alargar o tipo inferido final, preservando tipos literais específicos.",
      createdAt: iso(-10 * ONE_DAY),
      updatedAt: iso(-10 * ONE_DAY),
    },
    {
      id: "card-js-6",
      deckId: deck1Id,
      front: "O que caracteriza uma função pura (Pure Function)?",
      back: "1. Para os mesmos argumentos, sempre retorna o mesmo resultado determinístico.\n2. Não produz efeitos colaterais observáveis (mutação de variáveis globais, I/O, etc.).",
      createdAt: iso(-8 * ONE_DAY),
      updatedAt: iso(-8 * ONE_DAY),
    },

    // Deck 2: English Idioms
    {
      id: "card-en-1",
      deckId: deck2Id,
      front: "What does the idiom 'Bite the bullet' mean?",
      back: "To force yourself to face a difficult, unpleasant or painful situation with courage and determination after hesitating.",
      createdAt: iso(-14 * ONE_DAY),
      updatedAt: iso(-14 * ONE_DAY),
    },
    {
      id: "card-en-2",
      deckId: deck2Id,
      front: "What is the difference between 'Affect' and 'Effect'?",
      back: "• 'Affect' is usually a verb meaning to influence or produce a change (e.g., 'The cold weather affects my joints').\n• 'Effect' is usually a noun meaning the result or outcome (e.g., 'The drug has no side effects').",
      createdAt: iso(-14 * ONE_DAY),
      updatedAt: iso(-14 * ONE_DAY),
    },
    {
      id: "card-en-3",
      deckId: deck2Id,
      front: "What does it mean 'To call it a day'?",
      back: "To decide or agree to stop working on something for the rest of the day.",
      createdAt: iso(-12 * ONE_DAY),
      updatedAt: iso(-12 * ONE_DAY),
    },
    {
      id: "card-en-4",
      deckId: deck2Id,
      front: "How do you define the noun 'Serendipity'?",
      back: "The occurrence and development of events by chance in a happy, fortunate or beneficial way.",
      createdAt: iso(-10 * ONE_DAY),
      updatedAt: iso(-10 * ONE_DAY),
    },
    {
      id: "card-en-5",
      deckId: deck2Id,
      front: "What does the expression 'Cut corners' mean?",
      back: "To do something in the easiest, cheapest, or fastest way, often sacrificing quality, standards or safety rules.",
      createdAt: iso(-9 * ONE_DAY),
      updatedAt: iso(-9 * ONE_DAY),
    },
    {
      id: "card-en-6",
      deckId: deck2Id,
      front: "What is the meaning of 'Once in a blue moon'?",
      back: "An event or occurrence that happens very rarely or almost never.",
      createdAt: iso(-8 * ONE_DAY),
      updatedAt: iso(-8 * ONE_DAY),
    },

    // Deck 3: Direito Constitucional
    {
      id: "card-dir-1",
      deckId: deck3Id,
      front: "Quais são os Fundamentos da República Federativa do Brasil (Art. 1º da CF/88)?",
      back: "Mnemônico: SOCIDIVAPU\n1. SOberania\n2. CIdadania\n3. DIgnidade da pessoa humana\n4. VAlores sociais do trabalho e da livre iniciativa\n5. PlUralismo político",
      createdAt: iso(-12 * ONE_DAY),
      updatedAt: iso(-12 * ONE_DAY),
    },
    {
      id: "card-dir-2",
      deckId: deck3Id,
      front: "O que são as 'Cláusulas Pétreas' da CF/88 (Art. 60, § 4º)?",
      back: "Matérias que não podem ser abolidas por Emenda Constitucional:\n1. Forma federativa de Estado\n2. Voto direto, secreto, universal e periódico\n3. Separação dos Poderes\n4. Direitos e garantias individuais",
      createdAt: iso(-12 * ONE_DAY),
      updatedAt: iso(-12 * ONE_DAY),
    },
    {
      id: "card-dir-3",
      deckId: deck3Id,
      front: "Quando cabe a impetração de Habeas Data?",
      back: "Para assegurar o conhecimento de informações relativas à pessoa do impetrante constantes de registros públicos ou governamentais, ou para a retificação de dados quando não se prefira fazê-lo por processo sigiloso.",
      createdAt: iso(-11 * ONE_DAY),
      updatedAt: iso(-11 * ONE_DAY),
    },
    {
      id: "card-dir-4",
      deckId: deck3Id,
      front: "Qual o prazo do Princípio da Anterioridade Nonagesimal (Noventena)?",
      back: "Veda a cobrança de tributos antes de decorridos 90 (noventa) dias da data em que haja sido publicada a lei que os instituiu ou aumentou.",
      createdAt: iso(-10 * ONE_DAY),
      updatedAt: iso(-10 * ONE_DAY),
    },
    {
      id: "card-dir-5",
      deckId: deck3Id,
      front: "O que é o Princípio da Reserva Legal?",
      back: "Significa que determinadas matérias só podem ser regulamentadas estritamente por meio de lei formal em sentido estrito, aprovada pelo Poder Legislativo.",
      createdAt: iso(-8 * ONE_DAY),
      updatedAt: iso(-8 * ONE_DAY),
    },
    {
      id: "card-dir-6",
      deckId: deck3Id,
      front: "O que caracteriza a Ação Popular (Art. 5º, LXXIII)?",
      back: "Qualquer cidadão é parte legítima para propor ação popular visando anular ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural.",
      createdAt: iso(-7 * ONE_DAY),
      updatedAt: iso(-7 * ONE_DAY),
    },

    // Deck 4: Anatomia & Fisiologia
    {
      id: "card-anat-1",
      deckId: deck4Id,
      front: "Qual a função do Ventrículo Esquerdo do coração?",
      back: "Bombear sangue oxigenado sob alta pressão para todo o corpo através da artéria aorta (circulação sistêmica). Por isso sua parede miocárdica é mais espessa.",
      createdAt: iso(-10 * ONE_DAY),
      updatedAt: iso(-10 * ONE_DAY),
    },
    {
      id: "card-anat-2",
      deckId: deck4Id,
      front: "O que é a Bainha de Mielina e qual sua principal função?",
      back: "É uma estrutura lipídica formada por células de Schwann (SNP) ou oligodendrócitos (SNC) que envolve o axônio, permitindo a condução saltatória ultrarrápida dos impulsos nervosos.",
      createdAt: iso(-10 * ONE_DAY),
      updatedAt: iso(-10 * ONE_DAY),
    },
    {
      id: "card-anat-3",
      deckId: deck4Id,
      front: "Como ocorre o processo de hematose nos pulmões?",
      back: "É a troca gasosa que ocorre nos alvéolos pulmonares: o O2 do ar alveolar difunde-se para os capilares sanguíneos, enquanto o CO2 do sangue difunde-se para o alvéolo para ser expirado.",
      createdAt: iso(-9 * ONE_DAY),
      updatedAt: iso(-9 * ONE_DAY),
    },
    {
      id: "card-anat-4",
      deckId: deck4Id,
      front: "Quais são as principais funções fisiológicas do Fígado?",
      back: "• Metabolismo de glicose e lipídios\n• Produção e secreção da bile\n• Síntese de proteínas plasmáticas (albumina, fatores de coagulação)\n• Desintoxicação de metabólitos e drogas",
      createdAt: iso(-8 * ONE_DAY),
      updatedAt: iso(-8 * ONE_DAY),
    },
    {
      id: "card-anat-5",
      deckId: deck4Id,
      front: "O que é a Sinapse Química e como ela transmite o sinal?",
      back: "É a junção entre neurônios onde o impulso elétrico pré-sináptico provoca a liberação de neurotransmissores na fenda sináptica, ligando-se a receptores pós-sinápticos específicos.",
      createdAt: iso(-6 * ONE_DAY),
      updatedAt: iso(-6 * ONE_DAY),
    },
    {
      id: "card-anat-6",
      deckId: deck4Id,
      front: "Qual o papel do néfron no sistema renal?",
      back: "É a unidade funcional do rim responsável por filtrar o sangue na cápsula de Bowman, reabsorver água e nutrientes nos túbulos renais e excretar toxinas na urina.",
      createdAt: iso(-5 * ONE_DAY),
      updatedAt: iso(-5 * ONE_DAY),
    },
  ];

  // 3. Card Schedules (mixture of Due Today, Future Reviews, Relearning/Lapses, and New cards)
  const schedules: CardSchedule[] = [
    // JS & TS schedules
    {
      cardId: "card-js-1",
      due: iso(-2 * ONE_HOUR), // Due today (pending)
      stability: 4.2,
      difficulty: 3.1,
      elapsedDays: 4,
      scheduledDays: 4,
      learningSteps: 0,
      reps: 3,
      lapses: 0,
      state: 2, // Review
      lastReview: iso(-4 * ONE_DAY),
    },
    {
      cardId: "card-js-2",
      due: iso(4 * ONE_DAY), // Future
      stability: 8.5,
      difficulty: 2.2,
      elapsedDays: 2,
      scheduledDays: 6,
      learningSteps: 0,
      reps: 4,
      lapses: 0,
      state: 2,
      lastReview: iso(-2 * ONE_DAY),
    },
    {
      cardId: "card-js-3",
      due: iso(-1 * ONE_HOUR), // Due today
      stability: 2.1,
      difficulty: 6.8,
      elapsedDays: 2,
      scheduledDays: 2,
      learningSteps: 0,
      reps: 5,
      lapses: 2, // Problematic card!
      state: 3, // Relearning
      lastReview: iso(-2 * ONE_DAY),
    },
    {
      cardId: "card-js-4",
      due: iso(7 * ONE_DAY), // Future
      stability: 12.0,
      difficulty: 3.5,
      elapsedDays: 3,
      scheduledDays: 10,
      learningSteps: 0,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReview: iso(-3 * ONE_DAY),
    },
    // card-js-5 has no schedule -> New card
    // card-js-6 has no schedule -> New card

    // English Idioms schedules
    {
      cardId: "card-en-1",
      due: iso(-5 * ONE_HOUR), // Due today
      stability: 5.0,
      difficulty: 2.9,
      elapsedDays: 5,
      scheduledDays: 5,
      learningSteps: 0,
      reps: 4,
      lapses: 0,
      state: 2,
      lastReview: iso(-5 * ONE_DAY),
    },
    {
      cardId: "card-en-2",
      due: iso(-3 * ONE_HOUR), // Due today (problematic)
      stability: 1.8,
      difficulty: 7.2,
      elapsedDays: 1,
      scheduledDays: 1,
      learningSteps: 0,
      reps: 6,
      lapses: 3, // High lapses
      state: 3,
      lastReview: iso(-1 * ONE_DAY),
    },
    {
      cardId: "card-en-3",
      due: iso(5 * ONE_DAY),
      stability: 7.4,
      difficulty: 3.0,
      elapsedDays: 2,
      scheduledDays: 7,
      learningSteps: 0,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReview: iso(-2 * ONE_DAY),
    },
    {
      cardId: "card-en-4",
      due: iso(14 * ONE_DAY),
      stability: 18.2,
      difficulty: 2.4,
      elapsedDays: 4,
      scheduledDays: 18,
      learningSteps: 0,
      reps: 5,
      lapses: 0,
      state: 2,
      lastReview: iso(-4 * ONE_DAY),
    },
    // card-en-5 and card-en-6: new cards (no schedule)

    // Direito schedules
    {
      cardId: "card-dir-1",
      due: iso(-4 * ONE_HOUR), // Due today
      stability: 6.2,
      difficulty: 2.8,
      elapsedDays: 6,
      scheduledDays: 6,
      learningSteps: 0,
      reps: 4,
      lapses: 0,
      state: 2,
      lastReview: iso(-6 * ONE_DAY),
    },
    {
      cardId: "card-dir-2",
      due: iso(8 * ONE_DAY),
      stability: 11.5,
      difficulty: 3.2,
      elapsedDays: 3,
      scheduledDays: 11,
      learningSteps: 0,
      reps: 4,
      lapses: 0,
      state: 2,
      lastReview: iso(-3 * ONE_DAY),
    },
    {
      cardId: "card-dir-3",
      due: iso(-2 * ONE_HOUR), // Due today (problematic)
      stability: 2.4,
      difficulty: 6.5,
      elapsedDays: 2,
      scheduledDays: 2,
      learningSteps: 0,
      reps: 4,
      lapses: 2,
      state: 3,
      lastReview: iso(-2 * ONE_DAY),
    },
    {
      cardId: "card-dir-4",
      due: iso(3 * ONE_DAY),
      stability: 5.8,
      difficulty: 4.1,
      elapsedDays: 1,
      scheduledDays: 4,
      learningSteps: 0,
      reps: 2,
      lapses: 0,
      state: 2,
      lastReview: iso(-1 * ONE_DAY),
    },
    // card-dir-5 and card-dir-6: new cards

    // Anatomia schedules
    {
      cardId: "card-anat-1",
      due: iso(-1 * ONE_HOUR), // Due today
      stability: 4.5,
      difficulty: 3.4,
      elapsedDays: 4,
      scheduledDays: 4,
      learningSteps: 0,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReview: iso(-4 * ONE_DAY),
    },
    {
      cardId: "card-anat-2",
      due: iso(6 * ONE_DAY),
      stability: 9.0,
      difficulty: 2.9,
      elapsedDays: 2,
      scheduledDays: 8,
      learningSteps: 0,
      reps: 3,
      lapses: 0,
      state: 2,
      lastReview: iso(-2 * ONE_DAY),
    },
    {
      cardId: "card-anat-3",
      due: iso(-6 * ONE_HOUR), // Due today
      stability: 3.8,
      difficulty: 4.0,
      elapsedDays: 3,
      scheduledDays: 3,
      learningSteps: 0,
      reps: 3,
      lapses: 1,
      state: 2,
      lastReview: iso(-3 * ONE_DAY),
    },
    {
      cardId: "card-anat-4",
      due: iso(10 * ONE_DAY),
      stability: 14.0,
      difficulty: 2.5,
      elapsedDays: 3,
      scheduledDays: 13,
      learningSteps: 0,
      reps: 4,
      lapses: 0,
      state: 2,
      lastReview: iso(-3 * ONE_DAY),
    },
    // card-anat-5 and card-anat-6: new cards
  ];

  // 4. Review Logs spanning past 7 days to today (generating strong streak, ~87% retention, daily progress)
  const reviewLogs: ReviewLogRecord[] = [];
  let logIdCounter = 1;

  const addLog = (
    cardId: string,
    deckId: string,
    rating: "again" | "hard" | "good" | "easy",
    daysAgo: number,
    hourOffset: number,
    state = 2,
  ) => {
    const reviewedAt = new Date(now - daysAgo * ONE_DAY + hourOffset * ONE_HOUR).toISOString();
    reviewLogs.push({
      id: `log-${logIdCounter++}`,
      cardId,
      deckId,
      rating,
      reviewedAt,
      scheduledDays: rating === "again" ? 1 : rating === "hard" ? 3 : rating === "good" ? 6 : 10,
      state,
      previousSchedule: null,
    });
  };

  // Day -6 (16 reviews)
  addLog("card-js-1", deck1Id, "good", 6, 9);
  addLog("card-js-2", deck1Id, "good", 6, 9.2);
  addLog("card-js-3", deck1Id, "hard", 6, 9.5);
  addLog("card-en-1", deck2Id, "good", 6, 10);
  addLog("card-en-2", deck2Id, "again", 6, 10.2);
  addLog("card-en-3", deck2Id, "good", 6, 10.4);
  addLog("card-dir-1", deck3Id, "good", 6, 14);
  addLog("card-dir-2", deck3Id, "easy", 6, 14.2);
  addLog("card-dir-3", deck3Id, "hard", 6, 14.5);
  addLog("card-anat-1", deck4Id, "good", 6, 18);
  addLog("card-anat-2", deck4Id, "good", 6, 18.2);
  addLog("card-anat-3", deck4Id, "good", 6, 18.4);
  addLog("card-js-4", deck1Id, "easy", 6, 19);
  addLog("card-en-4", deck2Id, "good", 6, 19.2);
  addLog("card-dir-4", deck3Id, "good", 6, 19.5);
  addLog("card-anat-4", deck4Id, "easy", 6, 20);

  // Day -5 (20 reviews)
  addLog("card-en-2", deck2Id, "hard", 5, 8.5);
  addLog("card-js-3", deck1Id, "again", 5, 9);
  addLog("card-js-1", deck1Id, "good", 5, 9.2);
  addLog("card-js-2", deck1Id, "good", 5, 9.5);
  addLog("card-en-1", deck2Id, "good", 5, 10);
  addLog("card-en-3", deck2Id, "easy", 5, 10.3);
  addLog("card-en-4", deck2Id, "good", 5, 10.6);
  addLog("card-dir-1", deck3Id, "good", 5, 13.5);
  addLog("card-dir-2", deck3Id, "good", 5, 13.8);
  addLog("card-dir-3", deck3Id, "again", 5, 14.1);
  addLog("card-dir-4", deck3Id, "good", 5, 14.4);
  addLog("card-anat-1", deck4Id, "good", 5, 17);
  addLog("card-anat-2", deck4Id, "easy", 5, 17.3);
  addLog("card-anat-3", deck4Id, "hard", 5, 17.6);
  addLog("card-anat-4", deck4Id, "good", 5, 17.9);
  addLog("card-js-3", deck1Id, "good", 5, 19);
  addLog("card-en-2", deck2Id, "good", 5, 19.3);
  addLog("card-dir-3", deck3Id, "hard", 5, 19.6);
  addLog("card-js-4", deck1Id, "good", 5, 20);
  addLog("card-anat-1", deck4Id, "good", 5, 20.3);

  // Day -4 (18 reviews)
  addLog("card-js-1", deck1Id, "good", 4, 8);
  addLog("card-js-2", deck1Id, "easy", 4, 8.3);
  addLog("card-js-3", deck1Id, "hard", 4, 8.6);
  addLog("card-en-1", deck2Id, "good", 4, 11);
  addLog("card-en-2", deck2Id, "again", 4, 11.3);
  addLog("card-en-3", deck2Id, "good", 4, 11.6);
  addLog("card-dir-1", deck3Id, "easy", 4, 15);
  addLog("card-dir-2", deck3Id, "good", 4, 15.3);
  addLog("card-dir-3", deck3Id, "good", 4, 15.6);
  addLog("card-anat-1", deck4Id, "good", 4, 18);
  addLog("card-anat-2", deck4Id, "good", 4, 18.3);
  addLog("card-anat-3", deck4Id, "again", 4, 18.6);
  addLog("card-anat-4", deck4Id, "easy", 4, 18.9);
  addLog("card-en-2", deck2Id, "good", 4, 19.5);
  addLog("card-anat-3", deck4Id, "good", 4, 20);
  addLog("card-js-4", deck1Id, "good", 4, 20.3);
  addLog("card-dir-4", deck3Id, "easy", 4, 20.6);
  addLog("card-en-4", deck2Id, "good", 4, 21);

  // Day -3 (22 reviews)
  addLog("card-js-1", deck1Id, "good", 3, 9);
  addLog("card-js-2", deck1Id, "good", 3, 9.2);
  addLog("card-js-3", deck1Id, "again", 3, 9.5);
  addLog("card-js-4", deck1Id, "easy", 3, 9.8);
  addLog("card-en-1", deck2Id, "good", 3, 10.5);
  addLog("card-en-2", deck2Id, "hard", 3, 10.8);
  addLog("card-en-3", deck2Id, "good", 3, 11.1);
  addLog("card-en-4", deck2Id, "easy", 3, 11.4);
  addLog("card-dir-1", deck3Id, "good", 3, 14);
  addLog("card-dir-2", deck3Id, "good", 3, 14.3);
  addLog("card-dir-3", deck3Id, "again", 3, 14.6);
  addLog("card-dir-4", deck3Id, "good", 3, 14.9);
  addLog("card-anat-1", deck4Id, "good", 3, 16.5);
  addLog("card-anat-2", deck4Id, "good", 3, 16.8);
  addLog("card-anat-3", deck4Id, "hard", 3, 17.1);
  addLog("card-anat-4", deck4Id, "easy", 3, 17.4);
  addLog("card-js-3", deck1Id, "hard", 3, 18.5);
  addLog("card-dir-3", deck3Id, "good", 3, 18.8);
  addLog("card-js-1", deck1Id, "easy", 3, 19.5);
  addLog("card-en-1", deck2Id, "good", 3, 20);
  addLog("card-dir-2", deck3Id, "good", 3, 20.3);
  addLog("card-anat-2", deck4Id, "good", 3, 20.6);

  // Day -2 (19 reviews)
  addLog("card-js-2", deck1Id, "good", 2, 8.5);
  addLog("card-js-3", deck1Id, "hard", 2, 8.8);
  addLog("card-en-1", deck2Id, "good", 2, 9.5);
  addLog("card-en-2", deck2Id, "again", 2, 9.8);
  addLog("card-en-3", deck2Id, "easy", 2, 10.1);
  addLog("card-dir-1", deck3Id, "good", 2, 13);
  addLog("card-dir-3", deck3Id, "hard", 2, 13.3);
  addLog("card-dir-4", deck3Id, "good", 2, 13.6);
  addLog("card-anat-1", deck4Id, "good", 2, 15);
  addLog("card-anat-2", deck4Id, "good", 2, 15.3);
  addLog("card-anat-4", deck4Id, "good", 2, 15.6);
  addLog("card-en-2", deck2Id, "hard", 2, 16.5);
  addLog("card-js-1", deck1Id, "good", 2, 17.5);
  addLog("card-dir-2", deck3Id, "good", 2, 18);
  addLog("card-anat-3", deck4Id, "good", 2, 18.5);
  addLog("card-js-4", deck1Id, "easy", 2, 19);
  addLog("card-en-4", deck2Id, "good", 2, 19.5);
  addLog("card-dir-1", deck3Id, "easy", 2, 20);
  addLog("card-anat-2", deck4Id, "good", 2, 20.5);

  // Day -1 (yesterday - 20 reviews)
  addLog("card-js-1", deck1Id, "good", 1, 9);
  addLog("card-js-2", deck1Id, "good", 1, 9.3);
  addLog("card-js-3", deck1Id, "again", 1, 9.6);
  addLog("card-en-1", deck2Id, "good", 1, 10.5);
  addLog("card-en-2", deck2Id, "again", 1, 10.8);
  addLog("card-en-3", deck2Id, "easy", 1, 11.1);
  addLog("card-dir-1", deck3Id, "good", 1, 14);
  addLog("card-dir-2", deck3Id, "good", 1, 14.3);
  addLog("card-dir-3", deck3Id, "hard", 1, 14.6);
  addLog("card-dir-4", deck3Id, "good", 1, 14.9);
  addLog("card-anat-1", deck4Id, "good", 1, 16);
  addLog("card-anat-2", deck4Id, "easy", 1, 16.3);
  addLog("card-anat-4", deck4Id, "good", 1, 16.6);
  addLog("card-js-3", deck1Id, "good", 1, 18);
  addLog("card-en-2", deck2Id, "hard", 1, 18.3);
  addLog("card-js-4", deck1Id, "good", 1, 19);
  addLog("card-en-4", deck2Id, "easy", 1, 19.3);
  addLog("card-dir-2", deck3Id, "easy", 1, 20);
  addLog("card-anat-3", deck4Id, "good", 1, 20.3);
  addLog("card-dir-1", deck3Id, "good", 1, 20.6);

  // Day 0 (today - 14 reviews completed toward daily goal of 20)
  addLog("card-js-2", deck1Id, "easy", 0, -5);
  addLog("card-js-4", deck1Id, "good", 0, -4.8);
  addLog("card-en-3", deck2Id, "good", 0, -4.5);
  addLog("card-en-4", deck2Id, "easy", 0, -4.2);
  addLog("card-dir-2", deck3Id, "good", 0, -3.5);
  addLog("card-dir-4", deck3Id, "good", 0, -3.2);
  addLog("card-anat-2", deck4Id, "good", 0, -2.8);
  addLog("card-anat-4", deck4Id, "easy", 0, -2.5);
  addLog("card-js-1", deck1Id, "hard", 0, -2);
  addLog("card-en-1", deck2Id, "good", 0, -1.8);
  addLog("card-dir-1", deck3Id, "good", 0, -1.5);
  addLog("card-anat-1", deck4Id, "good", 0, -1.2);
  addLog("card-en-2", deck2Id, "again", 0, -0.8);
  addLog("card-js-3", deck1Id, "hard", 0, -0.4);

  // 5. User Settings
  const settings: UserSettingsRecord = {
    id: "global",
    dailyCardGoal: 20,
    monthlyCardGoal: 500,
    updatedAt: iso(0),
  };

  return {
    schemaVersion: 1,
    exportedAt: iso(0),
    decks,
    cards,
    schedules,
    reviewLogs,
    settings,
  };
}

/**
 * Completely clears all database tables and inserts fresh realistic seed data.
 */
export async function resetAndSeedDatabase(database: RevisaDatabase = db): Promise<BackupEnvelope> {
  const seedData = generateRealisticSeedData();
  await replaceDatabase(database, seedData);
  return seedData;
}
