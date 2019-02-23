import React from 'react';
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "Dashboard" */ './Dashboard'),
  loading: ()=><div></div>,
});
