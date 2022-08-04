import * as t from "../types";

export const setModalOpen = (isModalOpen) => {
	return {
		type: t.MODAL_OPEN,
		payload: isModalOpen,
	};
};

export const fetchRedirects = () => {
	return {
		type: t.REDIRECT_FETCH_REQUESTED,
	};
};

export const addRedirect = (redirect) => {
	return {
		type: t.REDIRECT_ADD_REQUESTED,
		payload: redirect,
	};
};

export const updateRedirect = (redirect) => {
	return {
		type: t.REDIRECT_UPDATE_REQUESTED,
		payload: redirect,
	};
};

export const deleteRedirect = (id) => {
	return {
		type: t.REDIRECT_DELETE_REQUESTED,
		payload: id,
	};
};

export const setSelectedRedirect = (id) => {
	return {
		type: t.REDIRECT_SELECTED,
		payload: id,
	};
};
