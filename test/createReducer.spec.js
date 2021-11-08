import {createDispatcher, createReducer, dispatcherMiddleware} from "../dist"
import mockStore from "./mockStore"

beforeAll(() => {
	mockStore({})
})

test("createReducer: create reducer", () => {
	const initialState = {count: 1}
	const mapActionToReducer = {}
	const reducer = createReducer(initialState, mapActionToReducer)

	expect(reducer.initialState).toBe(initialState)

	expect(() => {
		reducer.initialState.count = 2
	}).toThrow()
})

test("createReducer: handle action and return new state", () => {
	mockStore()

	const mapDispatchToAC = {
		resetCount: {},
		increaseCount: (amount) => ({amount}),
		decreaseCount: (amount) => ({amount: -amount}),
		setName: name => ({name}),
	}
	const key = "test"
	const dispatcher = createDispatcher(key, mapDispatchToAC)

	const initialState = {
		count: 10,
		name: ""
	}

	const mapActionToReducer = () => {
		return {
			[dispatcher.resetCount]: {count: 0},

			[dispatcher.setName]: (state, payload) => payload,

			[[dispatcher.increaseCount, dispatcher.decreaseCount]]: (state, payload) => {
				const count = state.count + payload.amount
				return {count}
			}
		}
	}

	const reducer = createReducer(initialState, mapActionToReducer)

	let currentState = initialState
	let nextState = reducer(currentState, dispatcher.resetCount())
	expect(nextState).toEqual({count: 0, name: ""})
	expect(nextState).not.toBe(currentState)

	currentState = nextState
	nextState = reducer(currentState, dispatcher.increaseCount(3))
	expect(nextState).toEqual({count: 3, name: ""})
	expect(nextState).not.toBe(currentState)

	currentState = nextState
	nextState = reducer(currentState, dispatcher.decreaseCount(2))
	expect(nextState).toEqual({count: 1, name: ""})
	expect(nextState).not.toBe(currentState)

	currentState = nextState
	nextState = reducer(currentState, dispatcher.setName("Emily"))
	expect(nextState).toEqual({count: 1, name: "Emily"})
	expect(nextState).not.toBe(currentState)
})
