import {Dispatch} from "redux";
import {
    MATCH_START_GAME, MATCH_HIT, MATCH_DOUBLE, MATCH_STAND,
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