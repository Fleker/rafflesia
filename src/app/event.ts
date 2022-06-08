type EventType = 'rafflesia_copy' |
  'rafflesia_open' |
  'rafflesia_insert' |
  'rafflesia_getProjectFiles' |
  'rafflesia_create'

export interface Event {
  type: EventType
  data: any
}