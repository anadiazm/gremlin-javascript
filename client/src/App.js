import {useState} from 'react';
import loader from './loader.gif'
import './App.css';

function App() {
  // const [response, setResponse] = useState('')
  const [queryRes, setQueryRes] = useState([])
  // const [ws, setWs] = useState('ws://localhost:8182/gremlin')
  const [graph, setGraph] = useState('cobra.g')
  const [query, setQuery] = useState('g.V().hasLabel("Year").count()')
  const [loading, setLoading] = useState(false)
  const serverURL = 'http://localhost:9000'
  // function callAPI() {
  //   fetch(serverURL+"/connect/"+graph)
  //   .then(res => res.text())
  //   .then(res => setResponse(res))
  // }
  function sendQuery(e) {
    e.preventDefault();
    setLoading(true);
    fetch(serverURL+"/query", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: query,
        source: graph
      })
    })
    .then(res => res.json())
    .then(response => setQueryRes(response))
    .then(setLoading(false))
  }
  return (
    <div className="App">
      <div style={{textAlign: 'left'}}>
        <h1>
          Query
        </h1>
        <input type="text" defaultValue={graph} onChange={event => setGraph(event.target.value)}/><br/>
        <textarea type="text" defaultValue={query} onChange={event => setQuery(event.target.value)}></textarea><br/>
        <button onClick={sendQuery}>Send Query</button>
      </div>
      <div>
      <p>
          Response: 
        </p>
        {!loading ?
          <div>
            {queryRes.length > 0 &&
              <pre>{JSON.stringify(queryRes, null, 2)}</pre>
            }
          </div>
          :
          <img src={loader} width='50'/>
        }
      </div>
     {/* <div>
        <h1>Connection</h1>
        <input type="text" defaultValue={ws} onChange={event => setWs(event.target.value)}/><br/>
        <button onClick={callAPI}>Connect</button>
        <p>
          Response: 
        </p>
        <div>
          {response}
        </div>
      </div> */}
    </div>
  );
}

export default App;
