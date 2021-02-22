import React from 'react';

import Games from './components/Games';

import { convertGamesToMatches } from './utils/dataUtils';
// import './App.scss';

function App(props) {
  const { games } = props;
   
  return (
    <div className="app">
      <Games games={games} />
    </div>
  );
}

export default App;

export async function getStaticProps() {
  // const res = await fetch(`https://images-api.nasa.gov/search?q=neptune`)
  // const data = await res.json()

  // let image = data.collection.items[0].links[0].href
  // let info = data.collection.items[0].data[0]

  try {
    const queryResp = await client.query(q.Paginate(q.Match(q.Index('games_by_season'), 5), { size: 500 }));
    const allRefs = queryResp.data;
    const getAll = allRefs.map((ref) => q.Get(ref));

    const response = await client.query(getAll);
    const allGames = response.map((g) => g.data);

    const matches = convertGamesToMatches(allGames);
    matches.sort((a, b) => new Date(a.gameTime) - new Date(b.gameTime)); // earlier game times first

    return { games: matches };
  } catch (e) {
    console.error(e);
  }

  return { games: [] };
}
