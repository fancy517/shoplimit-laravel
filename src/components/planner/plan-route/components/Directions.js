function setRoute(origin, destination, stops) {
  // eslint-disable-next-line no-undef
  const service = new google.maps.DirectionsService()

  const params = {
    origin: origin,
    destination: destination,
    waypoints: stops,
    optimizeWaypoints: true,
    travelMode: 'DRIVING',
    avoidTolls: true,
    avoidFerries: true
  }

  const result = new Promise((resolve, reject) => {
    service.route(params, (response, status) => {
      resolve(response)
      // if (status === 'OK') {
      //   resolve(response)
      // } else {
      //   reject(status)
      // }
    })
  })

  return result.then(resultRes => resultRes)
}

export default setRoute
