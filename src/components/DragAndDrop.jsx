import React, { useRef, useState } from "react";
import { data } from "./Data";

const DragItems = () => {
  const [dataList, setDataList] = useState(data);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, params) => {
    // console.log("drag start", params);
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, params) => {
    // console.log("drag entering...", params);
    const currentItem = dragItem.current;
    if (dragNode.current !== e.target) {
      // console.log('Target not same');
      // this making a new copy of the dataList without mutating it
      setDataList((oldDataList) => {
        let newDataList = JSON.parse(JSON.stringify(oldDataList));
        newDataList[params.groupIndex].items.splice(
          params.index,
          0,
          newDataList[currentItem.groupIndex].items.splice(
            currentItem.index,
            1
          )[0]
        );
        dragItem.current = params;
        return newDataList;
      });
    }
  };

  const handleDragEnd = () => {
    // console.log("drag ending!");
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const getStyles = (params) => {
    const currentItem = dragItem.current;
    if (
      currentItem.groupIndex === params.groupIndex &&
      currentItem.index === params.index
    ) {
      return "current dnd-item";
    }
    return "dnd-item";
  };

  return (
    <div>
      <header className="App-header">
        <div className="drag-n-drop">
          {dataList.map((datagroup, groupIndex) => (
            <div
              key={groupIndex}
              className="dnd-group"
              onDragEnter={
                dragging && !datagroup.items.length
                  ? (e) => handleDragEnter(e, { groupIndex, index: 0 })
                  : null
              }
            >
              <div className="group-title">{datagroup.title}</div>
              {datagroup.items.map((item, index) => {
                return (
                  <div
                    draggable
                    onDragEnter={
                      dragging
                        ? (e) => handleDragEnter(e, { groupIndex, index })
                        : null
                    }
                    onDragStart={(e) =>
                      handleDragStart(e, { groupIndex, index })
                    }
                    key={index}
                    className={
                      dragging ? getStyles({ groupIndex, index }) : "dnd-item"
                    }
                  >
                    <p>{item}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default DragItems;
