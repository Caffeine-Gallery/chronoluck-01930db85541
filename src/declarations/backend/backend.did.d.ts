import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameState {
  'startTime' : bigint,
  'reward' : [] | [string],
  'gameId' : bigint,
  'isComplete' : boolean,
}
export interface _SERVICE {
  'getGameStatus' : ActorMethod<[bigint], [] | [GameState]>,
  'getTimeRemaining' : ActorMethod<[bigint], bigint>,
  'startGame' : ActorMethod<[], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
