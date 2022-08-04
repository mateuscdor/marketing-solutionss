import { useSelector, useDispatch } from "react-redux";
import { PencilSVG, TrashSVG } from "@/icons";
import {
	deleteRedirect,
	fetchRedirects,
	setModalOpen,
	setSelectedRedirect,
} from "@/store";
import { useEffect } from "react";

export function Table() {
	const state = useSelector((state) => state.redirect);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchRedirects());
	}, [dispatch]);

	return (
		<table className="table">
			<thead className="table__head">
				<tr>
					<th>Origem</th>
					<th>Destino</th>
				</tr>
			</thead>

			<tbody className="table__body">
				{state.redirectList.map(({ id, source, destinations }) => (
					<tr key={id}>
						<td>{source}</td>
						<td>{destinations.length}</td>

						<td>
							<button
								className="btn btn__compact btn__edit"
								onClick={() => {
									dispatch(setSelectedRedirect(id));
									dispatch(setModalOpen(true));
								}}
							>
								<PencilSVG />
							</button>
							<button
								className="btn btn__compact btn__delete"
								onClick={() => {
									dispatch(deleteRedirect(id));
								}}
							>
								<TrashSVG />
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
