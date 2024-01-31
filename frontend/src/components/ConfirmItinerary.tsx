import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { act } from "react-dom/test-utils";
import Select from "react-select";

const ConfirmItinerary = (
  { itinerary }: any,
  setUserActivelyChangingItinerary: boolean
) => {
  const [objItinerary, setObjItinerary] = useState<any>([]);
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

  return (
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
  );
};

export default ConfirmItinerary;
