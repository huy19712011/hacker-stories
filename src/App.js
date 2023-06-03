import React from "react";

import logo from './logo.svg';
import './App.css';

const App = () => {

    const stories = [
        {
            title: 'React',
            url: 'https://reactjs.org',
            author: 'Jordan Walke',
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

    const [searchTerm, setSearchTerm] = React.useState('React');

    const handleSearch = event => {

        setSearchTerm(event.target.value);
    };

    const searchStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div>
            <h1>My hacker stories</h1>

            <Search onSearch={handleSearch} search={searchTerm}></Search>

            {/*
            if need seachTerm in Search component
            <Search onSearch={handleSearch} searchTerm={searchTerm}></Search>
*/}

            {/*
            if need seachTerm in App component
            <p>
                Searching for {searchTerm}
            </p>
*/}

            <hr/>

            <List list={searchStories}/>
        </div>
    );
};

const Search = ({search, onSearch}) => {

    return (
        <div>
            <label htmlFor="search">Search</label>
            <input id="search" type="text" value={search} onChange={onSearch}/>

            {/*
            if need seachTerm in Search component
            <p>
                Searching for <strong>{props.searchTerm}</strong>
            </p>
*/}
        </div>
    );

};

const List = ({list}) =>
    list.map(item => <Item
            key={item.objectId}
            title={item.title}
            url={item.url}
            author={item.author}
            num_comments={item.num_comments}
            points={item.points}
        />
    );

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
Consider the concept of the callback handler: We pass a function from one component (App) to
another component (Search); we call it in the second component (Search); but have the actual
implementation of the function call in the first component (App). This way, we can communicate up
the component tree. A handler function used in one component becomes a callback handler, which
is passed down to components via React props. React props are always passed down as information
the component tree, and callback handlers passed as functions in props can be used to communicate
up the component hierarchy.
*/
