import {
  SendMessageUrl,
  GetMessagesFromUserUrl,
  UpdateMessageUrl,
  GetAllMessagesUrl } from '../utils/communicationUrls'
import {
  genericPostRequestToApi,
  genericGetRequestToApi,
  genericPutRequestToApi } from '../utils/genericRequests'

/**
 * Send message to the list of receivers
 * @param {Object} data - message data
 * @param {Array<String>} data.to - array of receivers
 * @param {String} data.message - message
 * @param {String=} data.propertyId - property id
 */
const sendMessage = (data) => {
  return genericPostRequestToApi(SendMessageUrl(), data)
}

/**
 * Send message to the list of receivers
 * @param {Object} data - message data
 * @param {Array<String>} data.to - array of receivers
 * @param {String} data.message - message
 * @param {String=} data.propertyId - property id
 * @param {Number} data.amount - amount
 */
const sendOfferMessage = ({ to, address, agent, amount }) => {
  const message = ` Hi ${agent} I love ${address.trim()} and I would like to put in an offer of ${amount}. Please call me so we can discuss the details.`
  return sendMessage({
    to,
    message,
    subject: 'New offer',
    type: 'offer'
  })
}

/**
 * Receives all messages sent by user
 * @param {String} id - User Id
 */
const getUserMessages = (id) => {
  return genericGetRequestToApi(GetMessagesFromUserUrl(id))
}

/**
 * Receives all users messages
 */
const getAllMessages = () => genericGetRequestToApi(GetAllMessagesUrl())

/**
 * Asks the client for offer
 * @param {Object} data - message data
 * @param {Array<String>} data.to - array of receivers
 * @param {String} data.address - home address
 */
const askClientForOffer = ({ to, address }) => {
  const message = `I noticed that ${address} matches 80% or more of your needs and wants. Should we discuss making an offer on this home?`
  return sendMessage({
    to,
    message,
    subject: 'Asking for request'
  })
}

/**
 * Asks the client for providing feedback
 * @param {Object} data - message data
 * @param {Array<String>} data.to - array of receivers
 * @param {String} data.address - home address
 */
const askClientForFeedback = ({ to, address }) => {
  const message = `I enjoyed viewing ${address.trim()} with you, please provided the required feedback to help decide  whether we should make an offer on this home.`
  return sendMessage({
    message,
    to,
    subject: `Please provide feedback for ${address.trim()}`
  })
}

const sendRouteSchedule = ({ to, message, subject }) => {
  return sendMessage({
    message,
    to,
    subject
  })
}

const markMessageAsRead = (messageId) => {
  return genericPutRequestToApi(UpdateMessageUrl(messageId), { read: true })
}

export {
  sendMessage,
  sendOfferMessage,
  getUserMessages,
  getAllMessages,
  askClientForOffer,
  sendRouteSchedule,
  askClientForFeedback,
  markMessageAsRead
}
