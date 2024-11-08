export const idlFactory = ({ IDL }) => {
  const GameState = IDL.Record({
    'startTime' : IDL.Int,
    'reward' : IDL.Opt(IDL.Text),
    'gameId' : IDL.Nat,
    'isComplete' : IDL.Bool,
  });
  return IDL.Service({
    'getGameStatus' : IDL.Func([IDL.Nat], [IDL.Opt(GameState)], ['query']),
    'getTimeRemaining' : IDL.Func([IDL.Nat], [IDL.Int], ['query']),
    'startGame' : IDL.Func([], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
