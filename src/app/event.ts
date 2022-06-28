type EventType = 'rafflesia_copy' |
  'rafflesia_open' |
  'rafflesia_insert' |
  'rafflesia_getProjectFiles' |
  'rafflesia_create' |
  'rafflesia_read' |
  'rafflesia_goto' |
  'rafflesia_alert' |
  'rafflesia_iframe'

export interface Event {
  type: EventType
  data: any
}