export interface StudyCard {
  readonly id: string
  readonly deckId: string
  readonly deckName: string
  readonly question: string
  readonly answer: string
  readonly due: boolean
}

export interface StudyDeck {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly cards: readonly StudyCard[]
}

export const studyDecks: readonly StudyDeck[] = [
  {
    id: '9f5d4a2c-7e1b-4f30-8a61-0d2b6e9c4f17',
    name: 'Fundamentos de React',
    description: 'Conceitos essenciais para construir interfaces previsíveis.',
    cards: [
      {
        id: '5b1f8d2a-3c44-4a6e-9f01-7c2d8e5b6a90',
        deckId: '9f5d4a2c-7e1b-4f30-8a61-0d2b6e9c4f17',
        deckName: 'Fundamentos de React',
        question: 'O que torna um componente React previsível?',
        answer:
          'Ele transforma props e estado em UI de forma declarativa, sem efeitos colaterais escondidos durante a renderização.',
        due: true,
      },
      {
        id: '2a6c9e41-8b0d-4f75-a3e2-1d7b5c8f9026',
        deckId: '9f5d4a2c-7e1b-4f30-8a61-0d2b6e9c4f17',
        deckName: 'Fundamentos de React',
        question: 'Quando um efeito deve ser usado?',
        answer:
          'Quando o componente precisa sincronizar-se com um sistema externo, como uma API, o DOM ou uma subscrição.',
        due: true,
      },
      {
        id: '7e3b1c90-5a42-4d68-8f02-6b9e4c1a7358',
        deckId: '9f5d4a2c-7e1b-4f30-8a61-0d2b6e9c4f17',
        deckName: 'Fundamentos de React',
        question: 'Qual é a diferença entre estado e props?',
        answer:
          'Props vêm do componente pai e são somente leitura; estado pertence ao componente e muda ao longo do tempo.',
        due: false,
      },
    ],
  },
  {
    id: '4c8e2a71-6d0f-4b93-9a25-1e7c5f8d3b60',
    name: 'Pensamento de produto',
    description: 'Perguntas curtas para decisões melhores no dia a dia.',
    cards: [
      {
        id: '8d2f6b40-1c73-4e95-a0b8-5f9d3c7a2461',
        deckId: '4c8e2a71-6d0f-4b93-9a25-1e7c5f8d3b60',
        deckName: 'Pensamento de produto',
        question: 'Qual problema estamos realmente tentando resolver?',
        answer:
          'O problema observado na vida do usuário, não a solução que já imaginamos. Nomeá-lo reduz o viés de confirmação.',
        due: true,
      },
    ],
  },
]

export const studyCards = studyDecks.flatMap((deck) => deck.cards)

export function getStudyCard(id: string) {
  return studyCards.find((card) => card.id === id)
}
