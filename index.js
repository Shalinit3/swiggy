/***
 * returns the distance between two geo locations
 */
getHaversineDistance = (coords1, coords2) => {
    const RADIUS = 6371;
  
    const diffLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const diffLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  
    const arc =
      Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(diffLng / 2) *
        Math.sin(diffLng / 2) +
      Math.sin(diffLat / 2) * Math.sin(diffLat / 2);
    const c = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
  
    const distance = RADIUS * c;
  
    return Math.round(distance);
  };
  
  const isAlreadyVisited = (location, visited) =>
    visited.filter(loc => loc.id === location).length;
  
  const unvisitedOrOrderPickedPath = (
    resturant,
    locId,
    vistedLocations
  ) =>
    (!resturant && !isAlreadyVisited(locId, vistedLocations)) ||
    (resturant && isAlreadyVisited(resturant, vistedLocations));

  const getNextLocationToVisit = (currentLocation, locations, visited) => {
    let minTimeTravel = Infinity;
    let indexToBeRemove = -1;
    locations.forEach((loc, i) => {
      if (unvisitedOrOrderPickedPath(loc.orderFrom, loc.id, visited)) {
        const travelTime = (getHaversineDistance(currentLocation, loc) * 60) / 20;
        const minimumTime = travelTime < loc.waitingTime ? loc.waitingTime : travelTime;
        if (minimumTime < minTimeTravel) {
          minTimeTravel = minimumTime;
          currentLocation = loc;
          indexToBeRemove = i;
        }
      }
    });
    return [indexToBeRemove, currentLocation];
  };
  
  function shortestPath(Aman, C1, C2, R1, R2) {
    let locations = [R1, R2, C1, C2];
    const visited = [];
    let currentLocation = Aman;
    while (locations.length) {
      const [removeVisited, nextLocation] = getNextLocationToVisit(
        currentLocation,
        locations,
        visited
      );
      currentLocation = nextLocation;
      locations.splice(removeVisited, 1);
      visited.push(currentLocation);
    }
    let path = ` ${Aman.id}`;
    visited.forEach(i => {path += ` -> ${i.id}`})
    return (path);
  }
  
  /*********************************/
  /*               TESTS           */
  /*********************************/
  
  const Aman = { lat: 40, lng: 60, id: 'Aman' };
  const R1 = { id: 'R1', lat: 41, lng: 60.345, waitTime: 50 };
  const R2 = { id: 'R2', lat: 39, lng: 60, waitTime: 30 };
  const C1 = {
    id: 'C1',
    lat: 40,
    lng: 61,
    waitTime: 0,
    orderFrom: 'R1'
  };
  const C2 = {
    id: 'C2',
    lat: 41,
    lng: 60.45,
    waitTime: 0,
    orderFrom: 'R2'
  };
  
  console.log(shortestPath(Aman, C1, C2, R1, R2));