// """  URL for logging in agent
//
//      endpoint: /login
//
//      post: Logs in the agent to the dashboard from
//            the data provided in the request body
// """
export const AuthLoginAgentUrl = () => {
  return '/login'
}

// """  URL for registering a new agent
//
//      endpoint: /account/agent
//
//      post: Sends agent credentials to the backend and
//            register a new account after validating
//            the data provided in the request body
// """
export const AuthRegisterAgentUrl = () => {
  return '/account/agent'
}

// """  URL to create a new client by inviting him by the Agent
//
//      endpoint: /account/invite
//
//      post: Sends a invitation request to a new user by the agent
// """
export const AccountInviteUserUrl = () => {
  return '/account/invite'
}

// """  URL for Generic CREATE/RETRIEVE/UPDATE view for Agent profile
//
//      endpoint: /profile
//
//      get: Returns the profile of the logged in user (agent or client)
// """
export const RetrieveProfileUrl = () => {
  return '/profile'
}

// """  URL for Generic CREATE/UPDATE/DELETE view for homes
//      that are added to the agent's list
//
//      endpoint: /profile/<profile_id>/favorite/<home_id>/
//
//      put: Updates a given home details
//
//      post: Adds property to client
//
//      delete: Deletes the home from the list
// """
export const CreateUpdateDeleteHomeUrl = (profileId, homeId) => {
  return 'profile/' + profileId + '/favorite/' + homeId
}

// """  URL for Generic RETRIEVE/UPDATE view for updating the status of home
//      mainly meant to set status as viewed, pending etc.
//
//      endpoint: /profile/<agent_id>/home/<property_id>/<status_type>/
//
//      get: Retrieve the current status of the home requested by home id
//
//      put: Updates the current status of the home requested
// """
export const RetrieveUpdateHomeStatusUrl = (agentId, propertyId, status) => {
  return (
    'profile/' +
    agentId +
    '/home/' +
    propertyId +
    '/' +
    status +
    '/'
  )
}

// """  URL for Generic RETRIEVE/CREATE/UPDATE view for the schedule date
//      of a particular property
//
//      endpoint: /profile/<profile_id>/home/<property_id>/schedule/
//
//      get: Retrieve the current schedule date of requested property
//
//      post: Creates a new scheduled date for viewing of the property
//
//      put: Updates the current schedule date of requested property
// """
export const RetrieveUpdateScheduleUrl = (profileId, propertyId) => {
  return (
    'profile/' + profileId + '/home/' + propertyId + '/schedule/'
  )
}

// """  URL for Generic RETRIEVE view of properties
//
//      endpoint: /mls
//
//      get: Retrieves the property list added to the database
// """
export const RetrieveSearchPropertyUrl = () => {
  return '/mls'
}

// """  URL for Generic RETRIEVE view of single property
//
//      endpoint: /mls/<propertyId>
//
//      get: Retrieves the property list added to the database
// """
export const RetrievePropertyByIdUrl = (propertyId) => {
  return '/mls/' + propertyId
}
