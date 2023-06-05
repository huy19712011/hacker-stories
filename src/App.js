import React from "react";

import './App.css';

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
                    story => action.payload.objectId !== story.objectId
                ),
            };
        default:
            throw new Error();
    }
};

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

    const getAsyncStories = () =>
        new Promise(resolve => setTimeout(
            () => resolve({data: {stories: initialStories}}), 2000)
        );

    // only for test with reject
    // const getAsyncStories2 = () =>
    //     new Promise((resolve, reject) => setTimeout(reject, 2000));

    // custom hook
    const useSemiPersistentState = (key, initialState) => {
        const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

        React.useEffect(() => {
            localStorage.setItem(key, value);
        }, [value, key]);

        return [value, setValue];
    };

    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isAppError: false}
    );

    React.useEffect(() => {
        dispatchStories({type: 'STORIES_FETCH_INIT'});

        getAsyncStories()
            .then(result => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.data.stories,
                });
            })
            .catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
    }, []);

    const handleRemoveStory = item => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const searchStories = stories.data.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


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

            {stories.isAppError && <p>Something went wrong ...</p>}
            {stories.isLoading ? (<p>Loading ...</p>) : (
                <List
                    list={searchStories}
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
            key={item.objectId}
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
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
                <button type="button" onClick={() => onRemoveItem(item)}>
                    Dismiss
                </button>
            </span>
    </div>
);

export default App;

