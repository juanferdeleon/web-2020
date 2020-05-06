import { call, takeEvery, put, select } from "redux-saga/effects";

import * as selectors from "../reducers";
import * as actions from "../actions/petOwners";
import * as types from "../types/petOwners";
import { v4 as uuid } from "uuid";

const API_BASE_URL = "http://localhost:8000/api/v1/owners/";

function* fetchOwners() {
  try {
    const isAuth = yield select(selectors.isAuthenticated);

    if (isAuth) {
      const token = yield select(selectors.getAuthToken);
      const response = yield call(fetch, `${API_BASE_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });
      if (response.status === 200) {
        let entities = {};
        let order = [];

        const data = yield response.json();

        data.forEach((owner) => {
          const id = uuid();
          entities = { ...entities, [id]: owner };
          order = [...order, id];
        });

        yield put(actions.completeFetchingPetOwners(entities, order));
      } else {
        throw "Ops! Bad Request.";
      }
    } else {
      throw "Ops! Missing Credentials";
    }
  } catch (e) {
    yield put(actions.failFetchingPetOwners(e.message));
  }
}

function* addPetOwner(action) {
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    if (isAuth) {
      const { oldId, petOwner } = action.payload;
      const token = yield select(selectors.getAuthToken);

      const response = yield call(fetch, `${API_BASE_URL}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({ name: petOwner }),
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });

      if (response.status === 200) {
        const { id, name } = yield response.json();
        yield put(actions.completeAddingPetOwner(oldId, { id, name }));
      } else {
        throw "Ops! Bad Request.";
      }
    } else {
      throw "Ops! Missing Credentials";
    }
  } catch (e) {
    yield put(actions.failAddingPetOwner(oldId, e.message));
  }
}

function* removePetOwner(action) {
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    if (isAuth) {
      const { id } = action.payload;
      const token = yield select(selectors.getAuthToken);

      const response = yield call(fetch, `${API_BASE_URL}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });

      if (response.status === 200) {
        yield put(actions.completeRemovingPetOwner());
      } else {
        throw "Ops! Bad Request.";
      }
    } else {
      throw "Ops! Bad Request.";
    }
  } catch (e) {
    yield put(actions.failRemovingPetOwner(id, e.message));
  }
}

export function* watchFetchOwners() {
  yield takeEvery(types.PET_OWNERS_FETCH_STARTED, fetchOwners);
}

export function* watchAddPetOwner() {
  yield takeEvery(types.PET_OWNER_ADD_STARTED, addPetOwner);
}

export function* watchRemovePetOwner() {
  yield takeEvery(types.PET_OWNER_REMOVE_STARTED, removePetOwner);
}
