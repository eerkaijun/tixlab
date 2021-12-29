import { useRef } from "react";

import Card from "../ui/Card";
import classes from "./NewEventForm.module.css";

function NewEventForm(props) {
  const titleInputRef = useRef();
  const imageInputRef = useRef();
  const addressInputRef = useRef();
  const descriptionInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredImage = imageInputRef.current.value;
    const enteredZoomLink = addressInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    const eventData = {
      title: enteredTitle,
      image: enteredImage,
      zoomLink: enteredZoomLink,
      description: enteredDescription,
    };

    props.onAddEvent(eventData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="title">Event Title</label>
          <input type="text" required id="title" ref={titleInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="image">Event Image</label>
          <input type="url" required id="image" ref={imageInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="address">Zoom Link</label>
          <input type="text" required id="address" ref={addressInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows="5"
            ref={descriptionInputRef}
          ></textarea>
        </div>
        <div className={classes.actions}>
          <button>Add Event</button>
        </div>
      </form>
    </Card>
  );
}

export default NewEventForm;
