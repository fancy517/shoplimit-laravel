/**
 * Model Name: Associated Buyer
 *
 * Current model structure: {id, email, name, phone, agentId, availability, homePref, propertiesOfInterest:Object, viewings:Object, feedback, activeViewings:Object}
 */

// Specified the buyer ids that are already created in buyer.js file
export const associatedBuyer = [
  {
    id: '1'
  },
  {
    id: '2'
  }
]

/**
 * Model Name: Associated Agent
 *
 * Current model structure: {id, braSigned, timestamp}
 */
export const associatedAgent = [
  {
    id: '1',
    braSigned: false,
    timestamp: '1545411600'
  },
  {
    id: '2',
    braSigned: true,
    timestamp: '1545532700'
  }
]

/**
 * Model Name: Viewings
 *
 * Assumed model structure
 */

// export const viewings = [
//   {

//   }
// ]
