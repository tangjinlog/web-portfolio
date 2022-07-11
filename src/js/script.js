(()=> {
  
  let yOffset = 0; // pageYOffset
  let currentScene = 0;
  let prevScrollHeight = 0; // yOffset이 있는 currentScene 보다 이전의 scene들의 높이 합
  

  const sceneInfo = [
    { 
      type: 'sticky',
      heightNum: 3,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('.main-message.a'),
        messageB: document.querySelector('.main-message.b'),
        main_logo: document.querySelector('.main-logo'),
        headerElem: document.querySelector('.header-elem'),
      },
      values: {
        messageA_translateY_in: [40, 0, { start: 0.04, end: 0.1 }],
        messageB_translateY_in: [40, 0, { start: 0.27, end: 0.33 }],
        messageA_translateY_out: [0, -40, { start: 0.25, end: 0.31 }],
        messageB_translateY_out: [0, -40, { start: 0.43, end: 0.49 }],
        messageA_opacity_in: [0, 1, { start: 0.04, end: 0.1}],
        messageB_opacity_in: [0, 1, { start: 0.27, end: 0.33 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.31 }],
        messageB_opacity_out: [1, 0, { start: 0.43, end: 0.49 }],
        mainLogo_width_in: [2000, 80, { start: 0.5, end: 0.7 }],
        mainLogo_width_out: [200, 30, { start: 0, end: 0 }],
        mainLogo_translateX_in: [-15, -50, { start: 0.6, end: 0.7 }],
        mainLogo_translateY_in: [-45, -50, { start: 0.6, end: 0.7 }],
        mainLogo_opacity_out: [1, 0, { start: 0.72, end: 0.8 }],
        header_translateY_in: [-15, -50, { start: 0.77, end: 0.8 }],
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

  /* ------------------- */
  /*      Layout         */
  /* ------------------- */
  function setLayout() {
    for(let i=0; i< sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
      // yOffset = window.pageYOffset;
    }
  }

  function checkMenu() {
    const objs = sceneInfo[currentScene].objs;
    const currentYOffset =  yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    // progress bar
    const progressBar = document.querySelector('.progress-bar' ); 
    window.addEventListener('scroll', function() {
      // console.log(window.pageYOffset / document.body. offsetHeight);
      progressBar.style.width = `${(window.pageYOffset / (document.body.offsetHeight - window.innerHeight))* 100}%`
    })
    // nav
    if(currentScene === 0) {
      if( scrollRatio > 0.77 ) {
        console.log('start');
        objs.headerElem.style.top = 0;
      } else {
        objs.headerElem.style.top = `-15%`;
      }

    }
  }

  function scrollLoop() {
    
    checkMenu();
    playAnimation();
  }



  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    
    if(values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      }
      else if(currentYOffset < partScrollStart) {
        rv = values[0]; 
      }
      else if(currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    }
    else {
      rv = scrollRatio * (values[1] - values[0]) + values[0]; // 비율을 곱해서 범위를 설정 + 초기 값 더함 = 시작점
    }
    return rv;
  }

  function playAnimation() {
    console.log(sceneInfo[0].scrollHeight);
    // console.log(yOffset);
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset =  yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    
    switch(currentScene) {
      case 0: {
        if(scrollRatio < 0.2) {
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in ,currentYOffset)}%)`;
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in ,currentYOffset);
        } else {
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out ,currentYOffset)}%)`;
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out ,currentYOffset);
        }
        if(scrollRatio < 0.4) {
          objs.messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_in ,currentYOffset)}%)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in ,currentYOffset);
        } else {
          objs.messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_out ,currentYOffset)}%)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out ,currentYOffset);
        }
        if(scrollRatio < 0.71) {
          objs.main_logo.style.width = `${calcValues(values.mainLogo_width_in ,currentYOffset)}vw`;
          objs.main_logo.style.transform = `translate(${calcValues(values.mainLogo_translateX_in ,currentYOffset)}%,${calcValues(values.mainLogo_translateY_in ,currentYOffset)}%)`;
        } else {
          objs.main_logo.style.opacity = calcValues(values.mainLogo_opacity_out, currentYOffset);
        }
        
      }
    }

  }



  window.addEventListener('load', ()=> {
    setLayout();
  })

  window.addEventListener('resize', ()=> {
    setLayout();
  })

  window.addEventListener('scroll', function() {
    yOffset = window.pageYOffset;
    scrollLoop();
  })


  //test

  // const messageA = document.querySelector('.main-message.a');
  // messageA.addEventListener('click', ()=> {
  //   messageA.style.transform = 'matrix(1,2,-1,1,20,82)';
  // })
})();