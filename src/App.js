import React from "react";
import axios from "axios";

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


    const handleFetchStories = React.useCallback(async () => {

        dispatchStories({type: 'STORIES_FETCH_INIT'});

        try {
            const result = await axios.get(url);

            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data["hits"],
            });
        } catch {
            dispatchStories({type: 'STORIES_FETCH_FAILURE'});
        }

    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = item => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearchInput = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();
    };

    return (
        <div>
            <h1>My hacker stories</h1>

            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

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

const SearchForm = ({
                        searchTerm,
                        onSearchInput,
                        onSearchSubmit,
                    }) => (
    <form onSubmit={onSearchSubmit}>
        <InputWithLabel
            id="search"
            value={searchTerm}
            isFocused
            onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithLabel>
        <button type="submit" disabled={!searchTerm}>
            Submit
        </button>
    </form>
);

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

