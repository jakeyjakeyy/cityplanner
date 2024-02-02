import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { act } from "react-dom/test-utils";
import Select from "react-select";
import { GiConfirmed } from "react-icons/gi";

const ConfirmItinerary = ({
  itinerary,
  setItinerary,
  setUserActivelyChangingItinerary,
  currentResultIndex,
  setCurrentResultIndex,
}: any) => {
  const [objItinerary, setObjItinerary] = useState<any>([]);
  const [newItinerary, setNewItinerary] = useState<any>([]);
  const defaultOptions = ["Option 1", "Option 2", "Option 3"].map(
    (option, index) => ({
      value: index,
      label: option,
    })
  );

  useEffect(() => {
    // Creating an object with the itinerary and similar items for each location
    setObjItinerary(
      itinerary.map((location: string, index: number) => ({
        id: `location-${index}`,
        name: location,
        similarItems: [{ value: location, label: location }, ...defaultOptions],
      }))
    );
  }, []);

  const onDragEnd = (result: any) => {
    // Check if the item was reordered
    if (!result.destination) {
      return;
    }

    const items = Array.from(objItinerary);
    // remove the item from the original position
    const [reorderedItem] = items.splice(result.source.index, 1);
    // and insert it into the new position
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the state with the new order
    setObjItinerary(items);
  };

  const handleSelectChange = (selectedOption: any, index: number) => {
    // Logic for changing an itinerary item based on dropdown selection
  };

  const handleSubmit = () => {
    // Logic for submitting the itinerary
    let tempItinerary = [];
    for (let i = 0; i < objItinerary.length; i++) {
      let activity = objItinerary[i];
      tempItinerary.push(activity.name);
    }
    setItinerary(tempItinerary);
    setUserActivelyChangingItinerary(false);

    // changing value of currentResultIndex triggers a useEffect in Conversation component which will begin search
    if (currentResultIndex === -1) {
      // If we are at the beginning of the itinerary, we can start the search process
      setCurrentResultIndex(currentResultIndex + 1);
    } else {
      // Else user is restarting the search process with a new input
      setCurrentResultIndex(0);
    }
  };

  // debug printing
  useEffect(() => {
    console.log(objItinerary);
  }, [objItinerary]);

  return (
    <div className="confirm-itinerary">
      <GiConfirmed onClick={handleSubmit} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {objItinerary.map((activity: any, index: number) => (
                <Draggable
                  key={activity.id}
                  draggableId={activity.id}
                  index={index}
                >
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Select
                        defaultValue={activity.similarItems[0]}
                        options={activity.similarItems}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, index)
                        }
                        styles={{
                          option: (provided: any) => ({
                            ...provided,
                            color: "black",
                          }),
                          singleValue: (provided: any) => ({
                            ...provided,
                            color: "black",
                          }),
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ConfirmItinerary;
