import React from 'react';
import faunadb from 'faunadb';

import Teams from '../../src/components/Teams';

// import { convertGamesToMatches } from '../src/utils/dataUtils';
// import './App.scss';

function App({ players, teams }) {
  return (
    <div className="app">
      <Teams teams={teams} players={players} />
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
    const playerResp = await client.query(q.Paginate(q.Match(q.Index('players_by_season'), CUR_SEASON), { size: 1000 }));
    const playerRefs = playerResp.data;
    const getPlayers = playerRefs.map((ref) => q.Get(ref));

    const playersData = await client.query(getPlayers);
    const allPlayers = playersData.map((g) => g.data);

    // also get the list of teams
    const teamResp = await client.query(q.Paginate(q.Match(q.Index('teams_by_season'), CUR_SEASON), { size: 20 }));
    const teamRefs = teamResp.data;
    const getTeams = teamRefs.map((ref) => q.Get(ref));

    const teamsData = await client.query(getTeams);
    const allTeams = teamsData.map((g) => g.data);

    // const matches = convertGamesToMatches(allGames);
    // matches.sort((a, b) => new Date(a.gameTime) - new Date(b.gameTime)); // earlier game times first

    // console.log(matches);
    return { props: { players: allPlayers, teams: allTeams } };
  } catch (e) {
    console.error(e);
  }

  return { props: { games: [] } };
}
