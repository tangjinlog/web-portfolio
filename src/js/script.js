(()=> {
  
  let yOffset = 0; // pageYOffset
  let currentScene = 0;
  let prevScrollHeight = 0; // yOffset이 있는 currentScene 보다 이전의 scene들의 높이 합
  let delayedYOffset = 0;
  let acc = 0.1;
  let rafId;
  let rafState;
  const mousePos = { x: 0, y: 0 };
  

  const sceneInfo = [
    { 
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('.main-message.a'),
        messageB: document.querySelector('.main-message.b'),
        mainLogo: document.querySelector('.main-logo'),
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
        mainLogo_width_in: [2000, 100, { start: 0.5, end: 0.7 }],
        mainLogo_width_out: [100, 80, { start: 0.7, end: 0.75 }],
        mainLogo_translateX_in: [-15, -50, { start: 0.6, end: 0.75 }],
        mainLogo_translateY_in: [-45, -50, { start: 0.6, end: 0.75 }],
        mainLogo_opacity_out: [1, 0, { start: 0.8, end: 0.86 }],
        svgStartY: 0,
      } 
    },
    { 
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
        rocket: document.querySelector('.rocket-svg'),
        moveRocketCon: document.querySelector('.rocket-con'),
        // rocketMsg: document.querySelector('.rocket-msg'),
      
      },
      values: {
        rocket_left_in: [110, -130, { start: 0.3, end: 0.6 }],
      } 
    },
    { 
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        listRocket: document.querySelector('.list-rocket-con'),
        leftBox: document.querySelector('.left-box'),
        rightBox: document.querySelector('.right-box'),
        leftBoxMsg : document.querySelector('.left-box-msg'),
        rightBoxMsg : document.querySelector('.right-box-msg'),
        list: document.querySelector('.l-list'),
        
      },
      values: {
        listRocket_rotateY_in: [75, 0, { start: 0.01, end: 0.5 }],
        listRocket_opacity_in: [0, 1, { start: 0.01, end: 0.05 }],
        listRocket_width_in: [0, 160, { start: 0.01, end: 0.5 }],
        leftBox_width_in: [0, 30, { start: 0.01, end: 0.5 }],
        rightBox_width_in: [0, 30, { start: 0.01, end: 0.5 }],
        leftBox_height_in: [0, 120, { start: 0.01, end: 0.5 }],
        rightBox_height_in: [0, 120, { start: 0.01, end: 0.5 }],
        leftBoxMsg_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
        rightBoxMsg_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
        leftBox_left_in: [0, 55, { start: 0.55, end: 0.65 }],
        rightBox_right_in: [0, 55, { start: 0.55, end: 0.65 }],
        list_opacity_in: [0, 1, { start: 0.58, end: 0.65 }],
        list_scale_in: [0.5, 1, { start: 0.58, end: 0.65 }],
        list_opacity_out: [1, 0, { start: 0.73, end: 0.77 }],
        list_scale_out: [1, 0.5, { start: 0.73, end: 0.77 }],
        leftBox_left_out: [55, 0, { start: 0.73, end: 0.8 }],
        rightBox_right_out: [55, 0, { start: 0.73, end: 0.8 }],

        // svgStartY: 0,
        // listRocket_rotateY_in: [75, 0, { start: 0.01, end: 0 }],
        // listRocket_opacity_in: [0, 1, { start: 0.01, end: 0 }],
        // listRocket_width_in: [10, 160, { start: 0.01, end: 0 }],
        // leftBox_width_in: [0, 30, { start: 0.01, end: 0 }],
        // rightBox_width_in: [0, 30, { start: 0.01, end: 0 }],
        // leftBox_height_in: [0, 120, { start: 0.01, end: 0 }],
        // rightBox_height_in: [0, 120, { start: 0.01, end: 0 }],
        // leftBox_left_in: [0, 49, { start: 0.35, end: 0.45 }],
        // rightBox_right_in: [0, 49, { start: 0.35, end: 0.45 }],
        // svgStartY: 0,
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
    }
    /* currentScene 판별 */
    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for( let i = 0; i < sceneInfo.length; i++ ) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if( totalScrollHeight >= yOffset ) {
        currentScene = i;
        console.log(currentScene);
        break
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function checkMenu() {
    const objs = sceneInfo[currentScene].objs;
    const currentYOffset =  yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    // progress bar`
    const progressBar = document.querySelector('.progress-bar' ); 
    window.addEventListener('scroll', function() {
      // console.log(window.pageYOffset / document.body. offsetHeight);
      progressBar.style.width = `${(window.pageYOffset / (document.body.offsetHeight - window.innerHeight))* 100}%`
    })
    // nav
    if(currentScene === 0) {
      if( scrollRatio > 0.77 ) {
        objs.headerElem.style.top = 0;
      } else {
        objs.headerElem.style.top = `-15%`;
      }
    } else {
      sceneInfo[0].objs.headerElem.style.top = 0;
    }
  }

  function scrollLoop() {
    /* currentScene 판별 */
    prevScrollHeight = 0;
    enterNewScene = false;
    /* prevScrollHeigt 세팅 */
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    /* 스크롤 내릴 때 */
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    /* 스크롤 올릴 때 */
    if (yOffset < prevScrollHeight) {
      if(currentScene === 0) return
      enterNewScene = true;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
3
    if (enterNewScene) return;
    
    playAnimation();
  }

  // function loop() {
  //   delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

  //   rafId = requestAnimationFrame(loop);

  //   if( Math.abs(window.pageYOffset - delayedYOffset) < 1 ) {
  //     cancelAnimationFrame(loop);
  //     rafState = false;
  //   }
  // }


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
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset =  yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    
    switch(currentScene) {
      case 0: {
        if(scrollRatio < 0.2) {
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in ,currentYOffset)}%, 0)`;
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in ,currentYOffset);
        } else {
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out ,currentYOffset)}%, 0)`;
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out ,currentYOffset);
        }
        if(scrollRatio < 0.4) {
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in ,currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in ,currentYOffset);
        } else {
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out ,currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out ,currentYOffset);
        }
        if(scrollRatio <= 0.7) {
          if( !values.svgStartY ) {
            values.svgStartY = objs.mainLogo.offsetTop; //fixed로 현재 창 에 맞춰져 있어서 작음
            values.mainLogo_width_out[2].end = values.svgStartY / scrollHeight + 0.649;
            values.mainLogo_translateX_in[2].end = values.svgStartY / scrollHeight + 0.599;
            values.mainLogo_translateY_in[2].end = values.svgStartY / scrollHeight + 0.599;
            console.log(values.mainLogo_translateY_in)
          }
          objs.mainLogo.style.width = `${calcValues(values.mainLogo_width_in ,currentYOffset)}vw`;
          objs.mainLogo.style.transform = `translate3d(${calcValues(values.mainLogo_translateX_in ,currentYOffset)}%,${calcValues(values.mainLogo_translateY_in ,currentYOffset)}%, 0)`;
        } else {
          // if( !values.svgStartY ) {
          //   values.svgStartY = objs.mainLogo.offsetTop; //fixed로 현재 창 에 맞춰져 있어서 작음
          //   values.mainLogo_width_out[2].end = values.svgStartY / scrollHeight + 0.649;
          //   console.log(values.mainLogo_width_in)
          // }
          objs.mainLogo.style.width = `${calcValues(values.mainLogo_width_out ,currentYOffset)}vw`;
          objs.mainLogo.style.opacity = calcValues(values.mainLogo_opacity_out, currentYOffset);
        }
        
      }
      break;
      case 1: {
        if( scrollRatio <= 0.6) {
          objs.rocket.style.transform = `rotate(-90deg)`;
          objs.moveRocketCon.style.left = `${calcValues(values.rocket_left_in, currentYOffset)}%`;
        }
      }
      break;
      case 2: {
        // if( !values.svgStartY ) {
        //   values.svgStartY = objs.yPosition.offsetTop;
        //   values.listRocket_width_in[2].start = (window.innerHeight / 2) / scrollHeight;
        //   values.listRocket_rotateY_in[2].start = (window.innerHeight / 2) / scrollHeight;
        //   values.listRocket_width_in[2].end = values.svgStartY / scrollHeight + 0.2;
        //   values.listRocket_rotateY_in[2].end = values.svgStartY / scrollHeight + 0.2;
        //   values.leftBox_width_in[2].end = values.svgStartY / scrollHeight + 0.2;
        //   values.rightBox_width_in[2].end = values.svgStartY / scrollHeight + 0.2;
        //   values.leftBox_height_in[2].end = values.svgStartY / scrollHeight + 0.2;
        //   values.rightBox_height_in[2].end = values.svgStartY / scrollHeight + 0.2;
        //   values.leftBox_left_in[2].end = values.svgStartY / scrollHeight + 0.35;
        //   values.rightBox_right_in[2].end = values.svgStartY / scrollHeight + 0.35;
        //   values.listRocket_opacity_in[2].end = values.svgStartY / scrollHeight;
        // }
        // console.log(values.listRocket_opacity_in[2].end)

        if( scrollRatio <= 0.53) {
          objs.listRocket.style.opacity = `${calcValues(values.listRocket_opacity_in, currentYOffset)}`;
          objs.listRocket.style.width = `${calcValues(values.listRocket_width_in, currentYOffset)}vw`;
          objs.listRocket.style.transform = `rotateX(${calcValues(values.listRocket_rotateY_in, currentYOffset)}deg) translate3d(-50%, -50%, 0)`;
          objs.leftBox.style.width = `${calcValues(values.leftBox_width_in, currentYOffset)}vw`;
          objs.leftBox.style.height = `${calcValues(values.leftBox_height_in, currentYOffset)}vh`;
          objs.rightBox.style.width = `${calcValues(values.rightBox_width_in, currentYOffset)}vw`;
          objs.rightBox.style.height = `${calcValues(values.rightBox_height_in, currentYOffset)}vh`;
          objs.leftBoxMsg.style.opacity = `${calcValues(values.leftBoxMsg_opacity_in, currentYOffset)}`;
          objs.rightBoxMsg.style.opacity = `${calcValues(values.rightBoxMsg_opacity_in, currentYOffset)}`;
        } 
        if( scrollRatio <= 0.65 ) {
          objs.leftBoxMsg.style.display = 'block';
          objs.rightBoxMsg.style.display = 'block';
          objs.leftBox.style.left = `${calcValues(values.leftBox_left_in, currentYOffset)}vw`;
          objs.rightBox.style.right = `${calcValues(values.rightBox_right_in, currentYOffset)}vw`;
          objs.list.style.opacity = `${calcValues(values.list_opacity_in, currentYOffset)}`;
          objs.list.style.transform = `scale(${calcValues(values.list_scale_in, currentYOffset)})`;
          window.addEventListener('mousemove', (e)=> {
            mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
            mousePos.y = 1 - (e.clientY / window.innerHeight) * 2;
            objs.list.style.transform = `rotateX( ${mousePos.y * 20}deg) rotateY( ${mousePos.x * 20}deg)`;
          })
          
        } else {
          objs.leftBoxMsg.style.display = 'none';
          objs.rightBoxMsg.style.display = 'none';
          objs.leftBox.style.left = `${calcValues(values.leftBox_left_out, currentYOffset)}vw`;
          objs.rightBox.style.right = `${calcValues(values.rightBox_right_out, currentYOffset)}vw`;
          objs.list.style.opacity = `${calcValues(values.list_opacity_out, currentYOffset)}`;
          objs.list.style.transform = `scale(${calcValues(values.list_scale_out, currentYOffset)})`;
        }
        if( scrollRatio <= 0.78) {
          objs.list.style.display = 'grid';
        } else {
          objs.list.style.display = 'none';
        }
        if( scrollRatio <= 0.82 ) {
          objs.listRocket.style.position = 'fixed';
          objs.listRocket.style.top = `0%`;
        } else {
          objs.listRocket.style.position = 'absolute';
          objs.listRocket.style.top = '82%';
        }
      }
    }

  }



  window.addEventListener('load', ()=> {
    setLayout();
    
    /* 시작하고 자동으로 조금 스크롤 */
    let tempYOffset = yOffset;
    let tempScrollCount = 0;
    if( yOffset > 0) {
      let siId = setInterval(()=> {
        window.scrollTo(0, tempYOffset);
        tempYOffset += 3

        if(tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      },20)
    }

    window.addEventListener('scroll', function() {
      yOffset = window.pageYOffset;
      checkMenu();
      scrollLoop();
  
      // if( !rafState ) {
      //   rafId = requestAnimationFrame(loop);
      //   rafState = true;
      // }
    })

    window.addEventListener('resize', ()=> {
      setLayout();
    })

  })




  //test

  // const messageA = document.querySelector('.main-message.a');
  // messageA.addEventListener('click', ()=> {
  //   messageA.style.transform = 'matrix(1,2,-1,1,20,82)';
  // })
})();