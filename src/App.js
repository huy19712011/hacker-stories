import logo from './logo.svg';
import './App.css';

const welcome = {
    greeting: 'Hey',
    title: 'React',
};

function getTitle(title) {
    return title;
}

function App() {

    return (
        <div>
            <h1>{welcome.greeting} {welcome.title}</h1>
            <h1>Hello {getTitle('React')}</h1>

            <label htmlFor="search">Search</label>
            <input id="search" type="text"/>
        </div>
    );
}

export default App;
