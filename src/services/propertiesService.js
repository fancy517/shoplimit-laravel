import { RetrievePropertyByIdUrl } from '../utils/agentUrls'
import { genericGetRequestToApi } from '../utils/genericRequests'

/**
 * receives data about property by property id
 * @param {ObjectId} id - Property Id in the system
 */
const getPropertyById = (id) => genericGetRequestToApi(RetrievePropertyByIdUrl(id))

export {
  getPropertyById
}
