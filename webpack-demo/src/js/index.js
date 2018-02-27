import './../css/index.css';

require(['./common.js'],common => {
  common.initIndex();
})

// require(['./common.js','jquery'],(common,$) => {
//   common.initIndex();
//   $(function () {
//     console.log("this is a jquery");
//   })
// })