import React from "react";

import './App.css';

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STORIES':
            return action.payload;
        case 'REMOVE_STORIES':
            return state.filter(story => action.payload.objectId !== story.objectId);
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

    // custom hook
    const useSemiPersistentState = (key, initialState) => {
        const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

        React.useEffect(() => {
            localStorage.setItem(key, value);
        }, [value, key]);

        return [value, setValue];
    };

    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

    // const [stories, setStories] = React.useState([]);
    const [stories, dispatchStories] = React.useReducer(storiesReducer, []);

    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);

        getAsyncStories().then(result => {
            dispatchStories({
                type: 'SET_STORIES',
                payload: result.data.stories,
            });
            setIsLoading(false);
        })
            .catch(() => setIsError(true));
    }, []);

    const handleRemoveStory = item => {
        dispatchStories({
            type: 'REMOVE_STORIES',
            payload: item,
        });
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

            {isError && <p>Something went wrong ...</p>}
            {isLoading ? (<p>Loading ...</p>) : (
                <List
                    list={searchStories}
                    onRemoveItem={handleRemoveStory}
                />
            )}

            {/*<List list={searchStories} onRemoveItem={handleRemoveStory}/>*/}
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

