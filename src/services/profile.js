import { GetMyProfileUrl } from '../utils/profileUrls'
import {
  genericPutRequestToApi } from '../utils/genericRequests'

/**
 * Updates user`s profile
 * @param {Profile} data - user Profile
 */
const updateMyProfile = (data) => {
  return genericPutRequestToApi(GetMyProfileUrl(), data)
}

export {
  updateMyProfile
}
