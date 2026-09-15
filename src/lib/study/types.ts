export type CardRating = 'again' | 'hard' | 'good' | 'easy'

export type StudyCard = {
  id: string
  deckId: string
  front: string
  back: string
  topic: string
}

export type StudyDeck = {
  id: string
  title: string
  description: string
  cards: StudyCard[]
  accent: 'blue' | 'violet' | 'amber'
}

export type ReviewState = {
  cardId: string
  dueAt: string
  stability: number
  difficulty: number
  reps: number
  lapses: number
  lastRating?: CardRating
  updatedAt: string
}
