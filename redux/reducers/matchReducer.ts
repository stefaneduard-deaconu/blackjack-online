import {
    MatchType, MatchDispatchTypes,
    MATCH_START_GAME, MATCH_DRAW, MATCH_BET, MATCH_DOUBLE_HAND
} from "../actions/MatchActionTypes";

interface DefaultStateI {

}

const defaultState: DefaultStateI = {

}


const pokemonReducer = (state: DefaultStateI, action: MatchDispatchTypes): DefaultStateI => {
    if (!state) {
        return defaultState;
    }

    switch (action.type) {

        default:
            return state;
    }
}

export default pokemonReducer;