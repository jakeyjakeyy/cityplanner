import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Select from "react-select";
import { GiConfirmed } from "react-icons/gi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./ConfirmItinerary.css";
import { IoCloseCircleOutline } from "react-icons/io5";

const ConfirmItinerary = ({
  itinerary,
  setItinerary,
  setUserActivelyChangingItinerary,
  currentResultIndex,
  setCurrentResultIndex,
  setNewOrder,
  alternateLocations,
}: any) => {
  console.log(alternateLocations);
  const [objItinerary, setObjItinerary] = useState<any>([]);
  const defaultOptions = ["Arcade", "Zoo", "Museum"].map((option, index) => ({
    value: index,
    label: option,
  }));

  useEffect(() => {
    // Creating an object with the itinerary and similar items for each location
    setObjItinerary(
      itinerary.map((location: string, index: number) => ({
        id: `location-${index}`,
        name: location,
        similarItems: [
          { value: location, label: location },
          ...(alternateLocations[location]
            ? alternateLocations[location].map((loc: string) => ({
                value: loc,
                label: loc,
              }))
            : []),
        ],
      }))
    );
  }, [itinerary, alternateLocations]);

  const onDragEnd = (result: any) => {
    // Check if the item was reordered
    if (!result.destination) {
      return;
    }

    const items = Array.from(objItinerary);
    // remove the item from the original position
    const [reorderedItem] = items.splice(result.source.index, 1);
    console.log(reorderedItem);
    // and insert it into the new position
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the state with the new order
    setObjItinerary(items);
    updateOrder(items);
  };

  const handleSelectChange = (selectedOption: any, index: number) => {
    // Logic for changing an itinerary item based on dropdown selection
    let tempItinerary = [...objItinerary];
    tempItinerary[index].name = selectedOption.label;
    setObjItinerary(tempItinerary);
    // Update the itinerary to be sent to the assistant
    updateOrder(tempItinerary);
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

  const updateOrder = (tempItinerary: any) => {
    let newOrder = [];
    for (let i = 0; i < tempItinerary.length; i++) {
      newOrder.push((tempItinerary[i] as any).name);
    }
    setNewOrder(newOrder);
  };

  // debug printing
  useEffect(() => {
    console.log(objItinerary);
  }, [objItinerary]);

  return (
    <div className="confirm-itinerary">
      <GiConfirmed
        onClick={handleSubmit}
        style={{ cursor: "pointer", margin: "1rem 0 0.5rem 0" }}
        size={20}
        aria-label="Confirm Itinerary"
        tabIndex={0}
        onKeyDown={(e) => {
          e.key === "Enter" && handleSubmit();
        }}
      />
      <div className="drag-delete">
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
                            menuPortal: (base) => ({
                              ...base,
                              position: "absolute",
                            }),
                          }}
                          menuPortalTarget={document.body}
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
        <div className="delete-selection">
          {objItinerary.map((activity: any, index: number) => (
            <div className="delete-button" key={activity.id}>
              <IoCloseCircleOutline
                onClick={() => {
                  let tempItinerary = [...objItinerary];
                  tempItinerary.splice(index, 1);
                  setObjItinerary(tempItinerary);
                  updateOrder(tempItinerary);
                }}
                style={{ cursor: "pointer", paddingLeft: "0.5rem" }}
                size={20}
                aria-label="Delete Activity"
                tabIndex={0}
                onKeyDown={(e) => {
                  e.key === "Enter" &&
                    (() => {
                      let tempItinerary = [...objItinerary];
                      tempItinerary.splice(index, 1);
                      setObjItinerary(tempItinerary);
                      updateOrder(tempItinerary);
                    })();
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmItinerary;
