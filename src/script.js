(()=> {

  const progressBar = document.querySelector('.progress-bar' ); 
  window.addEventListener('scroll', function() {
    console.log(window.pageYOffset / document.body.offsetHeight)
    progressBar.style.width = `${(window.pageYOffset / (document.body.offsetHeight - this.window.innerHeight))* 100}%`

  })


})();