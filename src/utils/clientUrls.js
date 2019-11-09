// """  URL for Generic RETRIEVE view for Client profile
//
//      endpoint: /profile
//
//      get: Returns the profile details for the client
//
//      put: Updates the client information
// """
export const RetrieveUpdateClientProfileUrl = () => {
  return '/profile'
}

// """  URL for Generic CREATE password for new client's account
//
//      endpoint: /profile/complete
//
//      post: Sets the password for new client by sending password
//            payload in the request body
// """
export const CreateClientPasswordUrl = () => {
  return '/account/complete'
}

// """  URL for Generic RETRIEVE an Agent's profile from Clent side
//
//      endpoint: /profile/<profile_id>
//
//      get: Returns the profile details for the client
// """
export const RetrieveProfileById = (profileId) => {
  return '/profile/' + profileId + '/'
}

// """  URL for Generic CREATE/UPDATE/RETRIEVE view for BRA agreement
//      between the client and associated agent
//
//      endpoint: /account/bra/<agent_id>
//
//      get: Returns the status of BRA agreement between the
//          logged in client and the agent
//
//      put: Updates the status of the BRA agreement between
//          the mentioned client and the agent
// """
export const CreateRetrieveBraAgreementUrl = (agentId) => {
  return '/account/bra/' + agentId + '/'
}

// """  URL for Generic RETRIEVE/DELETE client favorites
//
//      endpoint: /profile/<profile_id>/favorite
//
//      get: Returns the list of favorites for the client
//
//      delete: Deletes all favorites list for the client
// """
export const RetrieveDeleteAllFavoritesUrl = (profileId) => {
  return '/profile/' + profileId + '/favorite/'
}

// """  URL for Specific CREATE/UPDATE favorite property for client
//
//      endpoint: /profile/<profile_id>/favorite/<property_id>
//
//      post: Creates a property as favorite for client
//
//      put: Updates request tour status by passing requestTour
//          query param status in request body
//
//      delete: Removes the property from client's list of favorites
// """
export const CreateFavoriteUrl = (profileId, propertyId) => {
  return '/profile/' + profileId + '/favorite/' + propertyId
}

// """  URL for Specific DELETE of a favorite property
//
//      endpoint: /profile/<profile_id>/favorite/<favorite_id>
//
//      delete: Removes the property from client's list of favorites
// """
export const UpdateDeleteFavoriteUrl = (profileId, favoriteId) => {
  return '/profile/' + profileId + '/favorite/' + favoriteId
}

// """  URL for Specific RETRIEVE a favorite property
//
//      endpoint: /profile/<profile_id>/favorite/<favorite_id>
//
//      put: Updates request tour status by passing requestTour
//          queryParam status in request body
//
// """
// export const RetrieveClientFavoriteUrl = (profileId, favoriteId) => {
//   return '/profile/' + profileId + '/favorite/' + favoriteId
// }

// """  URL for Specific UPDATE of property feedback match parameters
//
//      endpoint: /profile/<profile_id>/favorite/<favorite_id>/match
//
//      put: Updates the match parameters for a property based on
//          the data send in the request body
//
// """
export const UpdateFeedbackMatchUrl = (profileId, favoriteId) => {
  return '/profile/' + profileId + '/favorite/' + favoriteId + '/match/'
}

// """  URL for Specific UPDATE of property feedback notes
//
//      endpoint: /profile/<profile_id>/favorite/<favorite_id>/notes
//
//      put: Creates or updates feedback notes for a property based on
//          the data send in the request body
//
// """
export const UpdateFeedbackNotesUrl = (profileId, favoriteId) => {
  return '/profile/' + profileId + '/favorite/' + favoriteId + '/notes/'
}

// """  URL for Specific CREATE/UPDATE of property feedback images
//
//      endpoint: /profile/<profile_id>/favorite/<favorite_id>/media
//
//      post: Creates a new media object for favorite property
//            by sending image file in data
//
//      put: Updates the match parameters for a property based on
//          the data send in the request body
//
// """
export const CreateUpdateFeedbackMediaUrl = (profileId, favoriteId) => {
  return '/profile/' + profileId + '/favorite/' + favoriteId + '/media/'
}

export const DeleteFeedbackMediaUrl = (profileId, favoriteId, mediaIndex) => {
  return '/profile/' + profileId + '/favorite/' + favoriteId + '/media/' + mediaIndex
}

// """  URL for Generic CREATE/UPDATE feedback provided
//      by the client after viewing a property
//
//      endpoint: /profile/<profile_id>/favorite/<home_id>/schedule/<viewing_id>/feedback
//
//      put: Updates feedback given by a client
// """
export const CreateUpdateFeedbackUrl = (profileId, propertyId, viewingId) => {
  return (
    'profile/' +
    profileId +
    '/favorite/' +
    propertyId +
    '/schedule/' +
    viewingId +
    '/feedback/'
  )
}

// """  URL to CREATE/RETRIEVE client routes
//       Allows for optimized timing in response (pass in query param)
//
//      endpoint: /profile/<profile_id>/route
//
//      post: Creates a new route and returns the route object
//            For optimized timings pass a query param 'optimize'
//
//      get: Retrieves all routes associated with a client
// """
export const CreateRetrieveRouteUrl = (profileId) => {
  return (
    'profile/' + profileId + '/route'
  )
}

// """  URL for Generic UPDATE of route state to pending when
//      the client sends a request for showing a property
//
//      endpoint: /profile/<profile_id>/route/<route_id>/schedule
//
//      put: Sets the route status to pending on request
// """
export const UpdateScheduleRouteUrl = (profileId, routeId) => {
  return (
    'profile/' +
    profileId +
    '/route/' +
    routeId +
    '/schedule'
  )
}

// """  URL for UPDATE of route state to scheduled while sending
//      the route details to the mentioned client
//
//      endpoint: /profile/<profile_id>/route/<route_id>/share
//
//      put: Sets the route status to pending on request
// """
export const ShareScheduledRouteUrl = (profileId, routeId) => {
  return (
    'profile/' +
    profileId +
    '/route/' +
    routeId +
    '/share'
  )
}

// For optimized timings update send query param 'optimize'
export const UpdateDeleteRouteUrl = (profileId, routeId) => {
  return 'profile/' + profileId + '/route/' + routeId
}
