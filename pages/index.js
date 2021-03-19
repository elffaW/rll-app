import React from 'react';
import faunadb from 'faunadb';

import Games from '../src/components/Games';

import { convertGamesToMatches } from '../src/utils/dataUtils';
// import './App.scss';

function App({ games, teams }) {
  return (
    <div className="app">
      <Games games={games} teams={teams} />
    </div>
  );
}

export default App;

export async function getStaticProps() {
  // const res = await fetch(`https://images-api.nasa.gov/search?q=neptune`)
  // const data = await res.json()

  // let image = data.collection.items[0].links[0].href
  // let info = data.collection.items[0].data[0]

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
  });

  const CUR_SEASON = 6;

  try {
    const queryResp = await client.query(q.Paginate(q.Match(q.Index('games_by_season'), CUR_SEASON), { size: 1000 }));
    const allRefs = queryResp.data;
    const getAll = allRefs.map((ref) => q.Get(ref));

    const response = await client.query(getAll);
    const allGames = response.map((g) => g.data);

    // also get the list of teams
    const teamResp = await client.query(q.Paginate(q.Match(q.Index('teams_by_season'), CUR_SEASON), { size: 20 }));
    const teamRefs = teamResp.data;
    const getTeams = teamRefs.map((ref) => q.Get(ref));

    const teamsData = await client.query(getTeams);
    const allTeams = teamsData.map((g) => g.data);

    // const matches = convertGamesToMatches(allGames);
    // matches.sort((a, b) => new Date(a.gameTime) - new Date(b.gameTime)); // earlier game times first

    // console.log(matches);
    return { props: { games: allGames, teams: allTeams } };
  } catch (e) {
    console.error(e);
  }

  return { props: { games: [] } };
}
