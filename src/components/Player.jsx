import { useState } from "react"

export default function Player({ initialName, symbol, isActivePLayer, onChangeName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [playerName, setPlayerName] = useState(initialName);

    function editNameButtonCLicked() {
        setIsEditing(editing => !editing);

        if(isEditing) onChangeName(symbol, playerName);
    }
    function handlePlayerNameChange(event) {
        setPlayerName(event.target.value);
    }

    let editablePLayerName = <span className="player-name">{playerName}</span>;
    let buttonText = 'Edit';
    if (isEditing) {
        editablePLayerName = <input type="text" required value={playerName} onChange={handlePlayerNameChange}/>;
        buttonText = 'Save';
    }
    return(
        <li className={ isActivePLayer ? 'active' : undefined }>
            <span className="player">
            {editablePLayerName}
            <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={editNameButtonCLicked}>{buttonText}</button>
        </li>
    )
}