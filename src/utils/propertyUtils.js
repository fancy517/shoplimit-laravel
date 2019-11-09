import { isEmpty } from './generalUtils'

export const getWantNeedMatch = (home, column) => {
  let type = 0
  let typeTotal = 0

  if (home.feedback.match) {
    const feedbackWantNeedList = home.feedback.match.results

    feedbackWantNeedList.forEach(item => {
      if (column === 'need') {
        type += item.wantNeed === 'Need' && item.match
        typeTotal += item.wantNeed === 'Need'
      } else {
        type += item.wantNeed === 'Want' && item.match
        typeTotal += item.wantNeed === 'Want'
      }
    })
    const percentage = (type / typeTotal) * 100
    return percentage.toFixed(2).toString()
  }
  return '0'
}

export const getPropertyKeyValue = (propertyId, propertiesList, requiredKey) => {
  if (propertiesList) {
    const searchedProperty = propertiesList.find(property => property._id === propertyId)
    if (searchedProperty) {
      if (requiredKey === 'Images') {
        if (searchedProperty.Images && searchedProperty.Images.length > 0) {
          return searchedProperty.Images[0]
        } else {
          return '/img/lazy-loading.jpg'
        }
      } else {
        return searchedProperty[requiredKey]
      }
    }
  }
  return 'Loading ' + requiredKey + '...'
}

export const calculateFeedbackMatch = feedbackMatch => {
  // This condition might change later based on feedback object model
  // and schedulings array update in the API
  if (feedbackMatch) {
    if (feedbackMatch.results && feedbackMatch.results.length > 0) {
      const feedbackWantNeedList = feedbackMatch.results
      let type = 0
      let typeTotal = 0
      feedbackWantNeedList.forEach(item => {
        const points = item.wantNeed === 'Need' ? 3 : 1
        type += item.match ? points : 0
        typeTotal += points
      })
      if (typeTotal !== 0) {
        const percentage = (type / typeTotal) * 100
        return percentage.toFixed(2).toString()
      }
    }
  }
  return null
}

export const getFavoriteObjectFromPropertyId = (clientHomes, propertyId) => {
  // console.log(propertyId)
  if (clientHomes.length > 0) {
    let foundHome = clientHomes.find(home => home.propertyId === propertyId)
    // console.log(foundHome)
    return foundHome
  }
  return null
}

export const feedbackProvidedProperties = properties => {
  if (properties) {
    return properties.filter(
      home =>
        !isEmpty(home.feedback) &&
        home.feedback.match &&
        home.feedback.match.results.some(entry => entry.match === true)
    )
  }
  return []
}

export const feedbackNeededProperties = properties => {
  // Condition will be updated later when all code
  // gets updated based on new API endpoints
  if (properties) {
    return properties.filter(
      home =>
        isEmpty(home.feedback) ||
        (!isEmpty(home.feedback) &&
          home.feedback.match &&
          !home.feedback.match.results.some(entry => entry.match === true)) ||
        (!home.feedback.match && home.feedback.media)
    )
  }
  return []
}

/**
 * Function to return full address of a property
 */
export const propertyFullAddress = property => {
  if (property) {
    return property['Address'] + ' ' + property['City'] + ', ' + property['StateOrProvince'] + ' ' + property['PostalCode']
  }
  return null
}

export const filterRoutePropertyByState = (routeStops, propertyState) => {
  return routeStops.filter(stop => stop.state !== propertyState)
}

export const propertyInRouteCheckByState = (clientRoutes, propertyState, propertyId) => {
  let isPresent = false
  clientRoutes.forEach(route => {
    if (route.routeStops) {
      route.routeStops.forEach(stop => {
        if (stop.propertyId === propertyId && stop.state === propertyState) {
          isPresent = true
        }
      })
    }
  })
  return isPresent
}

/**
 *
 * @param {Array} clientRoutes
 * @param {String} propertyState
 *
 * Get property id list that are included in any of the client routes
 */
export const routePropertiesIdByState = (clientRoutes, propertyState) => {
  let propertyArray = []
  clientRoutes.forEach(route => {
    if (route.routeStops) {
      route.routeStops.forEach(stop => {
        if (stop.state === propertyState && !propertyArray.includes(stop.propertyId)) {
          propertyArray.push(stop.propertyId)
        }
      })
    }
  })
  return propertyArray
}

export const propertiesIdInRoute = (routeData) => {
  let propertyArray = []
  routeData.routeStops.forEach(stop => propertyArray.push(stop.propertyId))
  return propertyArray
}

export const clientRoutesByState = (clientData, routeState) => {
  return clientData.routes.filter(route => route.state === routeState)
}
