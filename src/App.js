import React from "react";

import './App.css';

// custom hook
const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isAppError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isAppError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isAppError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    story => action.payload["objectID"] !== story["objectID"]
                ),
            };
        default:
            throw new Error();
    }
};

const App = () => {
    const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isAppError: false}
    );


    /*
    Move all the data fetching logic into a standalone function outside
    the side-effect (A); wrap it into a useCallback hook (B); and then invoke it in the useEffect hook
    (C). Let’s explore why React’s useCallback Hook is needed here. This hook creates a memoized function
    every time its dependency array (E) changes. As a result, the useEffect hook runs again (C) because
    it depends on the new function (D)
        1. change: searchTerm
        2. implicit change: handleFetchStories
        3. run: side-effect
    */

    // A
    const handleFetchStories = React.useCallback(() => {
        // if (!searchTerm) return;

        dispatchStories({type: 'STORIES_FETCH_INIT'});

        fetch(url)
            .then(response => response.json())
            .then(result => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result["hits"],
                });
            })
            .catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
    }, [url]); // E

    React.useEffect(() => {
        handleFetchStories(); // C
    }, [handleFetchStories]); // D

    const handleRemoveStory = item => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearchInput = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
    };

    return (
        <div>
            <h1>My hacker stories</h1>

            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={handleSearchInput}
            >
                <strong>Search:</strong>
            </InputWithLabel>

            <button
                type="button"
                disabled={!searchTerm}
                onClick={handleSearchSubmit}
            >
                Submit
            </button>

            <hr/>

            {stories.isAppError && <p>Something went wrong ...</p>}
            {stories.isLoading ? (<p>Loading ...</p>) : (
                <List
                    list={stories.data}
                    onRemoveItem={handleRemoveStory}
                />
            )}

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
            key={item["objectID"]}
            item={item}
            onRemoveItem={onRemoveItem}
        />
    ));

const Item = ({item, onRemoveItem}) => (
    <div>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item["num_comments"]}</span>
        <span>{item.points}</span>
        <span>
                <button type="button" onClick={() => onRemoveItem(item)}>
                    Dismiss
                </button>
            </span>
    </div>
);

export default App;

