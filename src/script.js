(()=> {

  const sceneInfo = [
    { 
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
      } 
    },
    { 
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      } 
    },
    { 
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      } 
    },
    {
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
      } 
    },
  ]

  const progressBar = document.querySelector('.progress-bar' ); 
  window.addEventListener('scroll', function() {
    console.log(window.pageYOffset / document.body.offsetHeight)
    progressBar.style.width = `${(window.pageYOffset / (document.body.offsetHeight - this.window.innerHeight))* 100}%`

  })


})();