export enum MatchOption {
    MATCH_START_GAME = "MATCH_START_GAME",
    MATCH_HIT = "MATCH_HIT",
    MATCH_STAND = "MATCH_STAND",
    MATCH_SPLIT = "MATCH_SPLIT",
    MATCH_DOUBLE = "MATCH_BET",
    MATCH_SURRENDER = "MATCH_SURRENDER",
    MATCH_INSURANCE = "MATCH_INSURANCE",
    MATCH_DEALERS_TURN = "MATCH_DEALERS_TURN",
}

export enum CardHouse {
    HOUSE_CLUB = '♣',
    HOUSE_HEART = '♥',
    HOUSE_DIAMOND = '♦',
    HOUSE_SPADE = '♠'
}

export type CardNumber = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
export type Card = {
    house: CardHouse,
    number: CardNumber
}
export type DeckType = {
    cards: Card[]
}

// players' data:

export enum PlayerOption {
    NONE,
    STAND,
    HIT,
    DOUBLE,
    INSURANCE,
    SURRENDER,
    SPLIT,
    BLACKJACK,
    BUST
}

export type CurrentPlayerType = 0 | 1 | 2

export type PlayerType = {
    hands: Card[][],  // each player will have multiple cards
    bet: number,
    remainingCash: number;
    lastOption: PlayerOption,
    isChoosingFirstOption: boolean,
    splitByCard?: Card // TODO after first SPLIT, you'll have to take this into account
}

// The second card will be face down...
export type DealerType = {
    firstCard?: Card,
    secondCard?: Card // will be face down :)
    fullHand: Card[]  // the hand he deals to himself at the end of round
    // the dealer will keep going until  reaching the maximum number
    // TODO other rules?
}

// payload types:
export type MatchType = {
    deck: Card[],
    player1: PlayerType,
    player2: PlayerType,
    dealer: DealerType,
    currentPlayer: CurrentPlayerType,
    currentBet: number,
    currentStartingBet: number,
}

// individual action types:


export interface MatchStartGame {
    // take into account doubling the hand when starting the game :)
    type: MatchOption,
    payload: null
}


export interface MatchHit {
    // Draw another card for one of the hands
    type: MatchOption
    payload: { hand: number }
}

export interface MatchStand {
    // Do nothing and keep the current hands
    type: MatchOption
    payload: { hand: number }
}

export interface MatchDouble {
    // double the bet for one of the hands and draw the last card for that hand
    type: MatchOption
    payload: { hand: number }
}

export interface MatchSplit {
    type: MatchOption,
    payload: null
}

export interface MatchSurrender {
    // Give up on the current cards, and keep 50% of the bets
    type: MatchOption,
    payload: null
}

export interface MatchInsurance {
    // WHEN THE DEALER HAS AN Ace, the player bets whether the Dealer has Blackjack. And they gan get back 250%
    type: MatchOption,
    payload: null
    }

export interface MatchDealersTurn {
    type: MatchOption,
    payload: null
}


// dispatch types:

export type MatchDispatchTypes = MatchStartGame | MatchHit |  MatchStand| MatchDouble | MatchSplit | MatchSurrender | MatchInsurance | MatchDealersTurn  ;

