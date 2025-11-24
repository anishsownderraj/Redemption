// dependencies
import React from 'react';

const ListItem = ({ itemId, title, description, finished, handleDeleteItem, handleUpdateItem }) => {
    return (
        <div className='list-item'>
            <div className='title-description'>
                <span>{title}</span>
                <span>{description}</span>
            </div>
            <input
                className='finished'
                type='checkbox'
                value={finished}
                onChange={() => handleUpdateItem(itemId, finished)}
                checked={finished}
            />
            <button
                onClick={() => handleDeleteItem(itemId)}
            >
                X
            </button>
        </div>
    );
};

export default ListItem;