import {dispatcherMiddleware} from "../dist"

const mockStore = (state) => {
	const store = {
		getState: jest.fn(() => state),
		dispatch: jest.fn()
	}
	const next = jest.fn()
	dispatcherMiddleware(store)(next)
}

export default mockStore
