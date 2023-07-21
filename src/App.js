import './App.css';
import React, { useEffect,useState } from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _ from "lodash";
import {v4} from "uuid";
import addbutton from './add-button.png';
import raspberrysans from './raspberryicon.png';
import magnify from './magnify.png';
import better_add from './better_add.png'
import round_add from './round_Add.png'

// Define initial items
const item1 = {
  id: v4(),
  text: "Submit Portfolio by midnight today",
  description: "Write up first"
};

const item2 = {
  id: v4(),
  text: "Send email to Professor Kim",
  description: "By tuesday"
};

const item3 = {
  id: v4(),
  text: "Clean the room 80%",
  description: " Do it fast"
};

const item4 = {
  id: v4(),
  text: "Edit the food vlog (urgent)",
  description: " EAT FIRST"
};
function App() {
 
  // Define state variables
  const [text, setText] = useState(localStorage.getItem("text") || "");
  const [description, setDescription] = useState(localStorage.getItem("description") || "");
  // used to store the text and description after eidting the task cards
  const [etext,setEditText]=useState("")
  const [edescription,setEditDescription]=useState("")
  // Tracks the editing id
  const [editingId, setEditingId] = useState(null);
  // added state variable for search query
  const [searchText, setSearchText] = useState(""); 
  const [state, setState] = useState(
    localStorage.getItem("state")
      ? JSON.parse(localStorage.getItem("state"))
      : {
          "todo": {
            title: "To-Do",
            items: [item1, item2],
            css: {
              "border-color": "#f4b6ff"
            }
          },
          "inprogress": {
            title: "In-Progress",
            items: [item4],
            css: {
              "border-color": "#ffb6c1"
            }
          },
          "done": {
            title: "Achieved",
            items: [item3],
            css: {
              "border-color": "#c1ffb6"
            }
          },
          "delete": {
            title: "Delete",
            items: [],
            css: {
              "border-color": "#b6fff4"
            }
          }
        }
  );

  // Funciton Handles the drag and drop feature of cards 
  const handleDragEnd = ({destination, source}) => {
    if(!destination)  return;

    if(destination.droppableId === source.droppableId && destination.index === source) return;
    {/*dropped in same place */}
    const itemcopy = {...state[source.droppableId].items[source.index]}
    console.log(itemcopy);
    if(destination.droppableId === "delete" && source.droppableId !== "delete"){
      {/*deleteing an item */}
      setState(prev =>{
        prev = {...prev}
        prev[source.droppableId].items.splice(source.index,1);
        return prev;
      })
    }
    else{
      {/*adding an item*/}
    setState(prev =>{
      prev = {...prev}
      prev[source.droppableId].items.splice(source.index,1);
      {/*splice used to delete but also add */}
      prev[destination.droppableId].items.splice(destination.index,0, itemcopy);
      return prev;
    })

    }
  }

  
  // Function responds when first clicked on the 'Edit' button on the task cards
  const handleEdit = (columnName, id) => {
    setEditingId(id);
    const item = state[columnName].items.find(item => item.id === id);
    if (item) {
      // when the item has been edited
      setEditText(item.text);
      setEditDescription(item.description);
    } else {
      setEditText('');
      setEditDescription('');
    }
  };


  //Function responds when first clicked on the 'Cancel' button on the task cards after clicking on 'Edit'
  const handleCancelEdit = () => {
    // discard all the typed changes
    setEditingId(null);
    setEditText('');
    setEditDescription('');
  };
 
  // Function responds when first clicked on the 'Save' button on the task cards after clicking on 'Edit'
  const handleSave = (columnName) => {
    if (!etext || !edescription) {
      // if there is no text in either of the boxes of title and description then do not save
      window.alert("Please enter a title and description before saving.");
      return;
    }
    setState(prev => {
      const items = [...prev[columnName].items];
      const index = items.findIndex(item => item.id === editingId);
      items[index] = {
        ...items[index],
        text: etext,
        description: edescription
      };
      return {
        ...prev,
        [columnName]: {
          ...prev[columnName],
          items: items
        }
      };
    });
    setEditingId(null);
    setEditText('');
    setEditDescription('');
  };

 
 // Function handles adding new items to the list
 // Assumption: Given that it is To-do list any new task that the user enters will land straight in the to-do part of the page
 // The user can then move the particular task around when the need arises
  const addItem = () => {
    if (!text || !description) {
      // if there is no text in either of the boxes of title and description then do not allow to create card
      window.alert("Please enter a title and description before creating a new task.");
      return;
    }
    setState((prev) => {
      return {
        ...prev,
        todo: {
          title: "To-Do",
          items: [
            {
              id: v4(),
              text: text,
              description: description,
            },
            ...prev.todo.items,
          ],
        },
      };
    });
    setText("");
    setDescription("");
  };


  // Save state,text and description variables to the browsers local storage 
  useEffect(() => {
    localStorage.setItem("text", text);
  }, [text]);
  
  useEffect(() => {
    localStorage.setItem("description", description);
  }, [description]);
  
  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);


  

  return (
      <div className="App">
        <br/>
        <div className="username">  </div>
        <div class="header"> 
        <img height="50px" width="50px" src={raspberrysans}/>
        To-do List Application
      </div>
      
      {/* Add to-do item */}
      <div className="add_todo"> 
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter task title" autoFocus/>
      <input type="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter task description" />
        {/* Add button */}
        <button className="addbutton" onClick={addItem}>  
          <img alt = "" src = {round_add} height="50px" width="50px"   class="add_button" />
        </button>
      </div>
       
      
      {/* Search bar */}
      <div className="search_bar">
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search tasks" />
        <img height="50px" width="50px" src={magnify} alt="Search" class="search-icon"/>
      </div>


      <div className="drop"> 
      <DragDropContext onDragEnd= {handleDragEnd}>
        {/* Map through state object */}
        {_.map(state, (data, key) => {
          return(
            <div key={key} className="column"> 
             {/* To-do list title */}
              <h2 className="datatitle" style={data.css}>{data.title}</h2>
                {/* Droppable area */}
                <Droppable droppableId={key}>
                  {(provided) => {
                    // Filter items based on search text
                    const filteredItems = data.items.filter((item) =>
                    item.text.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchText.toLowerCase())
                  );
                    return(
                      <div ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="droppable_column"
                      >
                       {/* Map through filtered items */} 
                      {filteredItems.map((element, index) => {
                        // Check if editing
                        const isEditing = Boolean(editingId && element.id === editingId );
                          return (
                                <Draggable key={element.id} index={index} draggableId={element.id.toString()}>
                                  {(provided) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="draggable_item"
                                      >
                                        {/* If editing, show input fields */}
                                        {isEditing ? (
                                          <div className="input-wrapper">
                                            <input
                                              type="text"
                                              value={etext}
                                              onChange={(e) => setEditText(e.target.value)}
                                              placeholder="Enter task title"
                                            />
                                            <input
                                              type="text"
                                              value={edescription}
                                              onChange={(e) => setEditDescription(e.target.value)}
                                              placeholder="Enter task description"
                                            />
                                            <button onClick={() => handleSave(key)}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                          </div>
                                            ) : (
                                              // If not editing, show item details
                                          <>
                                            <h3>{element.text}</h3>
                                            <div className="input-wrapper">
                                              <p>{element.description}</p>
                                            </div>
                                            <button onClick={() => handleEdit(key, element.id)}>
                                              Edit
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                        {provided.placeholder}
                      </div>
                    )
                  }
                  }

                </Droppable>
              </div>
            
          )
          
        })}
      </DragDropContext>
      </div>
    </div>
  );
}

export default App;


