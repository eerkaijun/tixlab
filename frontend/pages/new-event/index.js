import NewEventForm from "../../components/events/NewEventForm";

function NewEventPage() {
  function addEventHandler(enteredEventData) {
    console.log(enterredEventData);
  }

  return <NewEventForm onAddEvent={addEventHandler} />;
}

export default NewEventPage;
