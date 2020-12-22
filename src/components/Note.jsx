import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { mainStateDispatchContext } from './Main';
import { GithubPicker } from 'react-color';
import { Icon } from 'semantic-ui-react';
import brightnessByColor from './brightnessByColor';

const icons = {
  delete: <Icon name="delete" />,
  cancel: <Icon name="ban" />,
  save: <Icon name="save" />,
};

const NoteWrapper = styled.div`
  border:1px solid;
  border-bottom-right-radius: 16px;
  display: flex;
  flex-direction: column;
  button {
      background: none;
      border: none;
      outline: none;
  }
`;

const NoteToolbar = styled.div`
  background-color: rgba(256,256,256,0.7);
  padding: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NoteBody = styled.div`
  flex-grow: 1;
  textarea {
    width: 97%;
    height: 95%;
    background: none;
    border:none;
    outline:none;
    color: inherit;
    padding: 10px 5px;
    resize:none;
    font-size:1rem;
    font-family:inherit;
  }
}
`;

function Note(props) {
  /**
   * the dispatch function of the state of 'Main' component 
   * @param {object} action
   */
  const mainStateDispatchFunction = useContext(mainStateDispatchContext);
  const [tempBody, setTempBody] = useState(props.body);
  const [tempBgColor, setTempBgColor] = useState(props.color);
  const [editMode, setEditMode] = useState(false);

  const style = {
    backgroundColor: tempBgColor,
    color: ((brightnessByColor(tempBgColor)) > 150 ? '#2b2a2a' : '#fcfcfa'),
  };
  /**
   * to pass the temp state to the main state
   */
  const editSaveHandler = () => {
    mainStateDispatchFunction({
      type: 'edit',
      body: tempBody,
      color: tempBgColor,
      id: props.id,
    });
    setEditMode(false);
  };
  /**
   * to return the note to its last saved state
   */
  const editCancelHandler = () => {
    setTempBody(props.body);
    setTempBgColor(props.color);
    setEditMode(false);
  };
  /**
   * passes the chosen color to the temp. state of the note
   * @param {string} color
   * @param {object} event
   */
  const handleColorChange = (color, event) => {
    setTempBgColor(color.hex);
  };
  const bodyEditable = <textarea value={tempBody} onChange={e => setTempBody(e.target.value)}></textarea>;
  const bodyReadonly = <textarea value={tempBody} onClick={() => setEditMode(true)} readOnly></textarea>;
  const deleteButton = <button onClick={ () => mainStateDispatchFunction({type: 'delete', id: props.id})}>{ icons.delete }</button>;
  //note editing mode
  const colorPicker = <GithubPicker onChangeComplete={handleColorChange}/>;
  const saveButton = <button onClick={() => editSaveHandler()}>{icons.save} Save</button>;
  const cancelButton = <button onClick={() => editCancelHandler()}>{icons.cancel} Cancel</button>;
  return (
    <NoteWrapper style={style}>
      <NoteToolbar>
        {editMode ? <> {colorPicker} {saveButton} {cancelButton}</> : <>{deleteButton}</> }
      </NoteToolbar>
      <NoteBody>
        {editMode ? <>{bodyEditable}</> : <>{bodyReadonly}</>}
      </NoteBody>
    </NoteWrapper>
  );
}

export default React.memo(Note);
