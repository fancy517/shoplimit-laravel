/**
 * Validation checking for empty primitive or object values
 * returns true if empty, false otherwise
 *
 * @param value The value that will be checked
 * @return
 */
export const isEmpty = value => {
  return !!(value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0))
}

export const groupArrayByKey = (value, key) => {
  return value.reduce((obj, item) => {
    obj[item[key]] = obj[item[key]] || []
    obj[item[key]].push(item)
    return obj
  }, {})
}

export const toCapitalCase = value => {
  return value
    .toLowerCase()
    .replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

export const getUrlParameters = (paramKey) => {
  let params = []
  let hash
  let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    params[hash[0]] = hash[1]
  }
  return params[paramKey]
}

/**
 * Filtering out list of objects from an array of objects
 * that match some criteria based on keys
 */
export const filterObjectsFromArray = (sourceArray, objectArray, keyToCheck) => {
  return sourceArray.filter(sourceItem => {
    let isPresent = false
    objectArray.forEach(objectItem => {
      if (sourceItem[keyToCheck] === objectItem[keyToCheck]) {
        isPresent = true
      }
    })
    return !isPresent
  })
}

export const sortArrayBasedOnAnotherArray = (objectArray, orderArray, key) => {
  objectArray.sort(function(a, b) {
    return orderArray.indexOf(a[key]) > orderArray.indexOf(b[key]) ? 1 : -1
  })
  return objectArray
}

export const sortObjectArrayByKey = (objectArray, key, order = 'asc') => {
  const multiplier = order === 'desc' ? -1 : 1
  objectArray.sort(function(a, b) { return a[key] > b[key] ? multiplier : multiplier * (-1) })
  return objectArray
}

export const coordinateMatch = (latitude, longitude, address, properties) => {
  let accLat = latitude.substr(0, latitude.indexOf('.') + 4)
  let accLng = longitude.substr(0, longitude.indexOf('.') + 4)
  // console.log(properties)
  let found = properties.find(home => home['Latitude'].toString().includes(accLat) && home['Longitude'].toString().includes(accLng))
  // console.log(found)
  if (!found || isEmpty(found)) {
    accLat = accLat.slice(0, accLat.length - 1)
    accLng = accLng.slice(0, accLng.length - 1)
    // console.log(accLat, accLng)
    found = properties.find(home => addressMatcher(home['Address'], address, 2))
  }
  // console.log(found)
  return found._id
}

const addressMatcher = (propertyAddress, addressToFind, commonWords) => {
  addressToFind = addressToFind.replace(',', ' ')
  let apiAddressArray = addressToFind.split(' ')
  let propertyAddressArray = propertyAddress.split(' ')
  let wordsFound = 0
  propertyAddressArray.forEach(word => {
    if (word !== '' && apiAddressArray.includes(word)) {
      wordsFound++
    }
  })
  return wordsFound >= commonWords
}
