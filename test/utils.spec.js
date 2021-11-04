import {camelCaseToActionType} from "../dist/utils"

test('parse camelCase to ACTION_TYPE', () => {
	expect(camelCaseToActionType('create')).toBe('CREATE');
	expect(camelCaseToActionType('fetchListUser')).toBe('FETCH_LIST_USER');
});
