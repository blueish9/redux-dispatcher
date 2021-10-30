import createReducer from "./createReducer"

const buildReducer = (initialState) => {
	const mapActionToReducer = {}

	const buildCase = (type, reducer) => {
		mapActionToReducer[type] = reducer
		return builder
	}
	const builder = {
		case: buildCase,
		reducer: () => {
			return createReducer(initialState, mapActionToReducer)
		},
	}
	return builder
}

export default buildReducer
