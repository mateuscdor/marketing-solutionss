import { all, put, takeLatest } from "redux-saga/effects";
import * as t from "../types";

function* fetchRedirects() {
	try {
		const response = yield fetch("/api/redirects");

		const redirectList = yield response.json();

		yield put({
			type: t.REDIRECT_FETCH_SUCCEEDED,
			payload: redirectList.data,
		});
	} catch (error) {
		yield put({
			type: t.REDIRECT_FETCH_FAILED,
			payload: error.message,
		});
	}
}

function* watchFetchRedirects() {
	yield takeLatest(t.REDIRECT_FETCH_REQUESTED, fetchRedirects);
}

function* addRedirect(action) {
	try {
		const response = yield fetch("/api/redirects", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(action.payload),
		});

		const newRedirect = yield response.json();

		yield put({
			type: t.REDIRECT_ADD_SUCCEEDED,
			payload: newRedirect.data,
		});
	} catch (error) {
		yield put({
			type: t.REDIRECT_ADD_FAILED,
			payload: error.message,
		});
	}
}

function* watchAddRedirect() {
	yield takeLatest(t.REDIRECT_ADD_REQUESTED, addRedirect);
}

function* deleteRedirect(action) {
	try {
		const response = yield fetch("/api/redirects/" + action.payload, {
			method: "DELETE",
		});

		const deletedRedirect = yield response.json();

		yield put({
			type: t.REDIRECT_DELETE_SUCCEEDED,
			payload: deletedRedirect.data.id,
		});
	} catch (error) {
		yield put({
			type: t.REDIRECT_DELETE_FAILED,
			payload: error.message,
		});
	}
}

function* watchRemoveRedirect() {
	yield takeLatest(t.REDIRECT_DELETE_REQUESTED, deleteRedirect);
}

function* updateRedirect(action) {
	try {
		const response = yield fetch("/api/redirects/" + action.payload.id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(action.payload),
		});

		const updatedRedirect = yield response.json();

		yield put({
			type: t.REDIRECT_UPDATE_SUCCEEDED,
			payload: updatedRedirect.data,
		});
	} catch (error) {
		yield put({
			type: t.REDIRECT_UPDATE_FAILED,
			payload: error.message,
		});
	}
}

function* watchUpdateRedirect() {
	yield takeLatest(t.REDIRECT_UPDATE_REQUESTED, updateRedirect);
}

export default function* rootSaga() {
	yield all([
		watchFetchRedirects(),
		watchAddRedirect(),
		watchRemoveRedirect(),
		watchUpdateRedirect(),
	]);
}
