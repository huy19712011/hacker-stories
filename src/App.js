import React from "react";

import './App.css';

const App = () => {

    const stories = [
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

            <List list={searchStories}/>
        </div>
    );
};

const InputWithLabel = ({id, value, type='text', onInputChange, isFocused, children}) => {

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
const List = ({list}) =>
    list.map(({objectId, ...item}) => <Item key={objectId} {...item}/>);

// Using nested destructuring
const Item = ({title, url, author, num_comments, points}) => (
    <div>
        <span>
            <a href={url}>{title}</a>
        </span>
        <span>{author}</span>
        <span>{num_comments}</span>
        <span>{points}</span>
    </div>
);


export default App;

/*
• (A) First, create a ref with React’s useRef hook. This ref object is a persistent value which
stays intact over the lifetime of a React component. It comes with a property called current,
which, in contrast to the ref object, can be changed.
• (B) Second, the ref is passed to the input field’s JSX-reserved ref attribute and the element
instance is assigned to the changeable current property.
• (C) Third, opt into React’s lifecycle with React’s useEffect Hook, performing the focus on the
input field when the component renders (or its dependencies change).
• (D) And fourth, since the ref is passed to the input field’s ref attribute, its current property
gives access to the element. Execute its focus programmatically as a side-effect, but only if
isFocused is set and the current property is existent.
*/
