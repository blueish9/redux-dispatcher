import createFacade from './createFacade';
import {camelCaseToActionType} from './utils';


/**
 * @param: mapDispatchToAC: Object<string: function or object>
 * @param: mapActionToDispatch: Object<string: function>
 */
export default function synthesize(key, mapDispatchToAC, enhancer) {
  /*enhancer = mapEnhance[enhancer];
  if (enhancer)
    mapDispatchToAC = enhancer.injectAction(mapDispatchToAC);*/

  const mapDispatchToAction = {};   // Object<string: function or object>
  for (const dispatch in mapDispatchToAC)
    if (mapDispatchToAC.hasOwnProperty(dispatch)) {
      const actionType = key + '/' + camelCaseToActionType(dispatch);
      mapDispatchToAction[dispatch] = {type: actionType, creator: mapDispatchToAC[dispatch]};
    }

  return createFacade(key, mapDispatchToAction, enhancer);
}
