/**
 * Author: Quan Vo
 * Date: 11/7/18
 */

import createDispatcher from "./createDispatcher";
import {camelCaseToActionType} from "./utils";


/**
 * @param: mapDispatchToAC: Object<string: function or object>
 * @param: mapActionToDispatch: Object<string: function>
 */
export default function synthesize(reducer, mapDispatchToAC) {
  /**
   * mapDispatchToAction: Object<string: function or object>
   */
  const mapDispatchToAction = {};
  for (const dispatch in mapDispatchToAC)
    if (mapDispatchToAC.hasOwnProperty(dispatch)) {
      const actionType = reducer + '/' + camelCaseToActionType(dispatch);
      mapDispatchToAction[dispatch] = {type: actionType, creator: mapDispatchToAC[dispatch]};
    }

  const dispatcher = createDispatcher(mapDispatchToAction);
  dispatcher.key = reducer;
  return dispatcher;
}