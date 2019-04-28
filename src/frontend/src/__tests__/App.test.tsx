// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

it('is run with correct node version', () => {
  expect(process.versions.node).toEqual("10.15.3");
});

// TODO fetch() returns nothing when run from jest? Mockable?
// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

export default undefined