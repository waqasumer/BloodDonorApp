import eventList from "./static-data/events";

/*----------------------------------------------*\
  @ async function to fetch data from real APIs
\*----------------------------------------------*/
function api(axios) {
  let events = [];
  let initialized = false;

  async function initialize() {
    initialized = true;
    events = eventList;
  }

  async function getEvents() {
    if (!initialized)
      throw new TypeError(
        `Attempted to call 'getEvents()' before API instance initialised`
      );

    return Promise.resolve(events);
  }

  async function addEvent(newEvent) {
    console.log("event", newEvent);
    const currentDateTime = Date.now();
    newEvent.dateSubmitted = currentDateTime;
    newEvent.id = currentDateTime.toString();

    if (!initialized)
      throw new TypeError(
        `Attempted to call 'addEvent()' before API instance initialised`
      );

    events.push(newEvent);
    return Promise.resolve({ status: "Ok", statusCode: 200 });
  }

  return {
    initialize,
    getEvents,
    addEvent
  };
}

export default api;
