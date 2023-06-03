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

    const handleSearch = event => {

        console.log(event.target.value);
    };


    return (
        <div>
            <h1>My hacker stories</h1>

            <Search onSearch={handleSearch}></Search>

            <hr/>

            <List list={stories}/>
        </div>
    );
};

const Search = (props) => {

    const [searchTerm, setSearchTerm] = React.useState('');

    const handleChange = event => {

        setSearchTerm(event.target.value);

        props.onSearch(event);
    };

    return (
        <div>
            <label htmlFor="search">Search</label>
            <input id="search" type="text" onChange={handleChange}/>

            <p>
                Searching for <strong>{searchTerm}</strong>
            </p>
        </div>
    );

};

const List = props =>
    props.list.map(item => (
        <div key={item.objectId}>
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
        </div>
    ));

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
