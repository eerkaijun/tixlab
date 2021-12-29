import EventsList from "../components/events/EventsList";
import Home from "../components/Home";

const DUMMY_EVENTS = [
  {
    id: "e1",
    title: "First Event",
    image:
      "https://cdn.vox-cdn.com/thumbor/Ds2tYQDw22nkqULf9GgNCoU28d4=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/66731964/acastro_200331_1777_zoom_0001.0.0.jpg",
    zoomLink: "https://zoom-link-1",
    description: "First Event Description",
  },
  {
    id: "e2",
    title: "Second Event",
    image:
      "https://cdn.vox-cdn.com/thumbor/Ds2tYQDw22nkqULf9GgNCoU28d4=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/66731964/acastro_200331_1777_zoom_0001.0.0.jpg",
    zoomLink: "https://zoom-link-1",
    description: "Second Event Description",
  },
];
function HomePage() {
  //   return <EventsList></EventsList>;
  return <EventsList events={DUMMY_EVENTS}></EventsList>;
}
export default HomePage;
