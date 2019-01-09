/**
 * Author: Quan Vo
 * Date: 11/7/18
 */

import createFacade from "./createFacade";
import {camelCaseToActionType} from "./utils";


/**
 * @param: mapDispatchToAC: Object<string: function or object>
 * @param: mapActionToDispatch: Object<string: function>
 */
export default function synthesize(key, mapDispatchToAC) {
  /**
   * mapDispatchToAction: Object<string: function or object>
   */
  const mapDispatchToAction = {};
  for (const dispatch in mapDispatchToAC)
    if (mapDispatchToAC.hasOwnProperty(dispatch)) {
      const actionType = key + '/' + camelCaseToActionType(dispatch);
      mapDispatchToAction[dispatch] = {type: actionType, creator: mapDispatchToAC[dispatch]};
    }

  return createFacade(key, mapDispatchToAction);
}