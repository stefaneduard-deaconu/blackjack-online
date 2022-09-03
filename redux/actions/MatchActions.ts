import {Dispatch} from "redux";
import {
    MATCH_START_GAME, MATCH_DRAW, MATCH_BET, MATCH_DOUBLE_HAND,
    MatchDispatchTypes
} from "./MatchActionTypes";

import axios from 'axios';

// TODO use all dispatch variant for building up useful functions.
//  it's not NECESSARY

// E.g.:

// export const GetPokemon = (pokemon: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch({
//             type: POKEMON_LOADING
//         })
//
//         const res = await axios.get(
//             `https://pokeapi.co/api/v2/pokemon/${pokemon}`
//         )
//         dispatch({
//             type: POKEMON_SUCCESS,
//             payload: res.data
//         })
//     }catch(e) {
//         dispatch({
//             type: POKEMON_FAIL
//         })
//     }
// }