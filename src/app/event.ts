type EventType = 'rafflesia_copy' |
  'rafflesia_open' |
  'rafflesia_insert'

export interface Event {
  type: EventType
  data: any
}