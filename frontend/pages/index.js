import EventsList from "../components/events/EventsList";
import Home from "../components/Home";

const DUMMY_EVENTS = [
  {
    id: "e1",
    title: "First Event",
    image: "accelerate.png",
    zoomLink: "https://zoom-link-1",
    description: "First Event Description",
  },
  {
    id: "e2",
    title: "Second Event",
    image: "accelerate.png",
    zoomLink: "https://zoom-link-1",
    description: "Second Event Description",
  },
];
function HomePage() {
  //   return <EventsList></EventsList>;
  return <EventsList events={DUMMY_EVENTS}></EventsList>;
}
export default HomePage;
