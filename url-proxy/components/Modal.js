import { useEffect } from "react";
import ReactDOM from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import cx from "clsx";

import { CheckSVG, CloseSVG } from "@/icons";
import {
	addRedirect,
	setModalOpen,
	setSelectedRedirect,
	updateRedirect,
} from "@/store";
import { useFieldArray, useFormContext, FormProvider } from "react-hook-form";

function useDestinationsFormField() {
	const { control, register } = useFormContext();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "destinations",
	});

	const addNewDestination = () => {
		append({
			url: "",
		});
	};

	const removeDestination = (destinationIndex) => () => {
		remove(destinationIndex);
	};

	return {
		fields,
		register,
		addNewDestination,
		removeDestination,
	};
}

function ModalComponent({
	reset,
	errors,
	setValue,
	handleSubmit,
	register,
	control,
}) {
	const state = useSelector((state) => state.redirect);

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "destinations",
	});

	const dispatch = useDispatch();

	const closeModal = () => {
		reset();
		dispatch(setModalOpen(false));
		dispatch(setSelectedRedirect(undefined));
	};

	const onSubmitHandler = (data) => {
		if (data) {
			closeModal();
		}
		if (state.selectedRedirect) {
			dispatch(
				updateRedirect({
					id: state.selectedRedirect.id,
					...data,
				})
			);
		} else {
			dispatch(addRedirect(data));
		}
	};

	useEffect(() => {
		if (state.selectedRedirect) {
			setValue("source", state.selectedRedirect.source);
			setValue("destinations", state.selectedRedirect.destinations);
		}
	}, [state.selectedRedirect]);

	return (
		<div className="modal">
			<div className="modal__content">
				<header className="header modal__header">
					<h1 className="header__h2">
						{state.selectedRedirect ? (
							<>
								Edit <span>Redirect</span>
							</>
						) : (
							<>
								Add <span>Redirect</span>
							</>
						)}
					</h1>
					<button className="btn btn__compact btn__close" onClick={closeModal}>
						<CloseSVG />
					</button>
				</header>

				<form
					className="form modal__form"
					onSubmit={handleSubmit(onSubmitHandler)}
					noValidate
				>
					<div className="form__element">
						<label
							htmlFor="sourceInput"
							className={cx("label", errors.source && "label--error")}
						>
							{errors.source ? (
								"Source is required!"
							) : (
								<>
									Source Url&nbsp;<span className="label__required">*</span>
								</>
							)}
						</label>
						<input
							type="text"
							id="sourceInput"
							name="source"
							placeholder="Source Url"
							className={cx("input", errors.source && "input--error")}
							ref={register({ required: true })}
						/>
					</div>

					<div className="form__element">
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "end",
							}}
						>
							<button
								type="button"
								onClick={() => {
									append({
										url: "",
									});
								}}
								className=""
								style={{
									backgroundColor: "darkGreen",
									color: "white",
									padding: 5,
								}}
							>
								+ Add Destinations
							</button>
						</div>
						{fields.map((field, index) => {
							const fielId = `destinations.${index}.url`;
							console.log({ field });
							return (
								<div
									key={field.id}
									className=""
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<label
										htmlFor={fielId}
										className={cx("label", errors[fielId] && "label--error")}
									>
										{errors[fielId] ? (
											"Destination Url is required!"
										) : (
											<>
												Desination Url {index + 1}&nbsp;
												<span className="label__required">*</span>
											</>
										)}
									</label>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<button
											type="button"
											onClick={() => {
												remove(index);
											}}
											className=""
											style={{
												backgroundColor: "darkred",
												color: "white",
												width: "30%",
											}}
										>
											Remove
										</button>
										<input
											id={field.id}
											name={fielId}
											defaultValue={field.url}
											placeholder="Destination"
											className={cx("input", errors[fielId] && "input--error")}
											ref={register({ required: true })}
										/>
									</div>
								</div>
							);
						})}
					</div>

					<div className="form__action">
						<button
							className="btn btn__icon btn__cancel"
							type="button"
							onClick={closeModal}
						>
							<CloseSVG /> Cancel
						</button>
						<button className="btn btn__primary btn__icon" type="submit">
							<CheckSVG /> {state.selectedRedirect ? "Update" : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export function Modal() {
	const useFormProps = useForm();
	const state = useSelector((state) => state.redirect);

	return state.isModalOpen
		? ReactDOM.createPortal(<ModalComponent {...useFormProps} />, document.body)
		: null;
}
