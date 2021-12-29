import NewEventForm from "../../components/events/NewEventForm";

function NewEventPage() {
  function addEventHandler(enteredEventData) {
    console.log(enteredEventData);
  }

  return <NewEventForm onAddEvent={addEventHandler} />;
}

export default NewEventPage;
