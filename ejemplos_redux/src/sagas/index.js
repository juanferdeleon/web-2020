import { fork, all } from "redux-saga/effects";

import { watchLoginStarted } from "./auth";
import { watchSayHappyBirthday } from "./happyBirthday";
import {
  watchFetchOwners,
  watchAddPetOwner,
  watchRemovePetOwner,
} from "./petOwners";

function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchFetchOwners),
    fork(watchAddPetOwner),
    fork(watchRemovePetOwner),
  ]);
}

export default mainSaga;
