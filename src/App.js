import React from "react";

import './App.css';

const App = () => {

    const initialStories = [
        {
            title: 'React',
            url: 'https://reactjs.org',
            author: 'Jordan Walk',
            num_comments: 3,
            points: 4,
            objectId: 0,
        },
        {
            title: 'Redux',
            url: 'https://redux.js.org',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectId: 1,
        },
    ];

    // custom hook
    const useSemiPersistentState = (key, initialState) => {
        const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

        React.useEffect(() => {
            localStorage.setItem(key, value);
        }, [value, key]);

        return [value, setValue];
    };

    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

    const [stories, setStories] = React.useState(initialStories);

    const handleRemoveStory = item => {
        const newStories = stories.filter(story => item.objectId !== story.objectId);

        setStories(newStories);
    };

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const searchStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div>
            <h1>My hacker stories</h1>

            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={handleSearch}
            >
                <strong>Search:</strong>
            </InputWithLabel>

            <hr/>

            <List list={searchStories} onRemoveItem={handleRemoveStory}/>
        </div>
    );
};

const InputWithLabel = ({id, value, type = 'text', onInputChange, isFocused, children}) => {

    // A. creating ref
    const inputRef = React.useRef(null);

    // C.
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            // D.
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            {/*B*/}
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
            />
        </>
    );
};

const List = ({list, onRemoveItem}) =>
    list.map((item) => (
        <Item
            key={item.objectId}
            item={item}
            onRemoveItem={onRemoveItem}
        />
    ));

const Item = ({item, onRemoveItem}) => {
    const handleRemoveItem = () => {
        onRemoveItem(item);
    };

    return (
        <div>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
                <button type="button" onClick={handleRemoveItem}>
                    Dismiss
                </button>
            </span>
        </div>
    );
};

export default App;

