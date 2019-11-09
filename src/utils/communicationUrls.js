// """  URL for sending messages to the user
//
//      endpoint: /messages
//
//      post: Sends the message to the receivers
// """
export const SendMessageUrl = () => {
  return '/messages'
}

// """  URL for getting all messages from client
//
//      endpoint: /messages?includes=<client-id>
//
//      get: Receives all messages from user
// """
export const GetMessagesFromUserUrl = (id) => {
  return `/messages?includes=${id}`
}

// """  URL for getting all clients messages
//
//      endpoint: /messages
//
//      get: Receives all user messages
// """
export const GetAllMessagesUrl = (id) => {
  return `/messages`
}

// """  URL for updating the messages
//
//      endpoint: /messages/<message-id>
//
//      put: Updates message
// """
export const UpdateMessageUrl = (id) => {
  return `/messages/${id}`
}
