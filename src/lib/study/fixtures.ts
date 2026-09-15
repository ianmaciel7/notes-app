import type { StudyDeck } from './types'

export const studyDecks: StudyDeck[] = [
  {
    id: '2f1b7e3c-8a8d-4b7b-9c63-0a3d75b3e6f1',
    title: 'React fundamentals',
    description: 'The mental models behind components, state, and rendering.',
    accent: 'blue',
    cards: [
      {
        id: '15c1c2da-5e41-48d0-8d88-3ed36b5ea1d2',
        deckId: '2f1b7e3c-8a8d-4b7b-9c63-0a3d75b3e6f1',
        topic: 'Components',
        front: 'What is a React component?',
        back: 'A reusable unit of UI that receives inputs as props and returns a description of what should be rendered.',
      },
      {
        id: 'c08af1f4-1d5c-4cc1-bf88-4ea595a99350',
        deckId: '2f1b7e3c-8a8d-4b7b-9c63-0a3d75b3e6f1',
        topic: 'State',
        front: 'When should state be lifted up?',
        back: 'When multiple components need to coordinate around the same changing value, move the state to their closest common owner.',
      },
      {
        id: 'b8a3fb13-a4bc-4db9-8481-7dc2f3f1c29f',
        deckId: '2f1b7e3c-8a8d-4b7b-9c63-0a3d75b3e6f1',
        topic: 'Rendering',
        front: 'What does a render represent in React?',
        back: 'A calculation of the UI for the current props and state. Rendering does not necessarily mean the DOM changes.',
      },
    ],
  },
  {
    id: '5a2ab8e1-9d5a-4a4d-8d05-9fbb0cbba2c9',
    title: 'Product thinking',
    description: 'Short prompts for making clearer product decisions.',
    accent: 'violet',
    cards: [
      {
        id: '68a9f2ef-99f9-4ed7-b43a-60e9d9ef7d30',
        deckId: '5a2ab8e1-9d5a-4a4d-8d05-9fbb0cbba2c9',
        topic: 'Scope',
        front: 'What makes an MVP useful?',
        back: 'It proves the riskiest user outcome with the smallest coherent experience, not the smallest feature list.',
      },
      {
        id: 'fbf47c12-32cf-4cbf-92e6-0d5b3b7b49a4',
        deckId: '5a2ab8e1-9d5a-4a4d-8d05-9fbb0cbba2c9',
        topic: 'Discovery',
        front: 'What is a strong product assumption?',
        back: 'A belief about a user, problem, or behavior that can be stated clearly and tested with evidence.',
      },
    ],
  },
]
