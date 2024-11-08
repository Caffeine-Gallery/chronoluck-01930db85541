import Bool "mo:base/Bool";

import Timer "mo:base/Timer";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat8 "mo:base/Nat8";

actor MysteryBox {
    // Stable variables for persistence
    stable var currentGameId : Nat = 0;
    stable var activeGames : [(Nat, Int)] = [];
    stable var gamesEntries : [(Nat, GameState)] = [];

    // Game states
    private type GameState = {
        gameId: Nat;
        startTime: Int;
        reward: ?Text;
        isComplete: Bool;
    };

    private let games = HashMap.HashMap<Nat, GameState>(10, Nat.equal, Hash.hash);

    // Rewards pool
    private let rewards = [
        "🎁 Common Gift Box",
        "💎 Rare Diamond",
        "👑 Legendary Crown",
        "🌟 Epic Star",
        "🎨 Mythical Paint",
        "🎮 Ultra Game Console",
        "🚀 Cosmic Spaceship"
    ];

    // Timer duration (30 seconds)
    private let GAME_DURATION_NS : Nat = 30_000_000_000;

    system func preupgrade() {
        gamesEntries := Iter.toArray(games.entries());
    };

    system func postupgrade() {
        for ((k, v) in gamesEntries.vals()) {
            games.put(k, v);
        };
    };

    // Start a new mystery box game
    public shared func startGame() : async Nat {
        let gameId = currentGameId;
        currentGameId += 1;

        let startTime = Time.now();
        
        let newGame : GameState = {
            gameId = gameId;
            startTime = startTime;
            reward = null;
            isComplete = false;
        };

        games.put(gameId, newGame);

        // Set timer for game completion
        let timerId = Timer.setTimer(#nanoseconds(GAME_DURATION_NS), func() : async () {
            await completeGame(gameId);
        });

        gameId
    };

    // Complete the game and generate reward
    private func completeGame(gameId : Nat) : async () {
        switch (games.get(gameId)) {
            case (?game) {
                if (not game.isComplete) {
                    let seed = await Random.blob();
                    let randomBytes = Iter.toArray(seed.vals());
                    let randomNat = Nat8.toNat(randomBytes[0]);
                    let randomIndex = randomNat % rewards.size();
                    
                    let updatedGame : GameState = {
                        gameId = game.gameId;
                        startTime = game.startTime;
                        reward = ?rewards[randomIndex];
                        isComplete = true;
                    };
                    games.put(gameId, updatedGame);
                };
            };
            case null {};
        };
    };

    // Get game status
    public query func getGameStatus(gameId : Nat) : async ?GameState {
        games.get(gameId)
    };

    // Get time remaining for a game
    public query func getTimeRemaining(gameId : Nat) : async Int {
        switch (games.get(gameId)) {
            case (?game) {
                if (game.isComplete) {
                    return 0;
                };
                let elapsed = Time.now() - game.startTime;
                let remaining = Int.abs(GAME_DURATION_NS) - elapsed;
                if (remaining < 0) {
                    return 0;
                };
                remaining
            };
            case null { 0 };
        }
    };
}
