export const utils = {
  getElmFromEvent:  function (cy, evt) {
    if (!evt.target) {
      return null;
    }
  
    if (evt.target === cy) {
      return null;
    }
  
    if(evt.target.data) {
      return evt.target;
    }
    return null;
  },

 
}