import {createDispatcher, dispatcherMiddleware} from "../dist"
import mockStore from "./mockStore"

const initialState = {count: 1}

beforeAll(() => {
	mockStore(initialState)
})

test("createDispatcher: create dispatcher", () => {
	const mapDispatchToAC = {
		doSomething: {}
	}
	const key = "test"
	const dispatcher = createDispatcher(key, mapDispatchToAC)

	expect(dispatcher.key).toEqual(key)
	expect(dispatcher.doSomething.toString()).toEqual(key + "/DO_SOMETHING")
	expect(dispatcher.doSomething.type).toEqual(key + "/DO_SOMETHING")
})

test("createDispatcher: dispatch action", () => {
	const mapDispatchToAC = {
		resetCount: {count: 0},
		fetchSomething: url => ({url})
	}
	const key = "test"
	const dispatcher = createDispatcher(key, mapDispatchToAC)

	expect(dispatcher.resetCount()).toEqual({type: key + "/RESET_COUNT", count: 0})
	expect(dispatcher.fetchSomething("abc.com")).toEqual({type: key + "/FETCH_SOMETHING", url: "abc.com"})
})

test("createDispatcher: thunk", async () => {
	expect.assertions(2);

	const mapDispatchToAC = {
		doSomething: () => ({getState}) => {
			const state = getState()
			expect(state).toEqual(initialState)
		},
		setCountAsync: count => async () => {
			return {count}
		}
	}
	const dispatcher = createDispatcher("test", mapDispatchToAC)

	dispatcher.doSomething()

	const count = 10
	const data = await dispatcher.setCountAsync(count)
	expect(data).toEqual({count})
})
