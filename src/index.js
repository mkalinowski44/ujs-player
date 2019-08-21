import './main.scss'
import Hammer from 'hammerjs'

class ujsPlayer {
   constructor(element) {
      this.playerStr = element
      this.playerEl = document.querySelector(element)
      this.createPlayer()
      this.movies = new Array()

      this.elements = {
         video: document.querySelector(element + ' video'),
         controls: document.querySelector(element + ' .controls'),
         title: document.querySelector(element + ' .title'),
         titleText: document.querySelector(element + ' .title .text'),
         loading: document.querySelector(element + ' .loading'),
         bigPlay: document.querySelector(element + ' .big-play'),
         info: document.querySelector(element + ' .info'),
         trapFocus: document.querySelector(element + ' .trap-focus'),

         playBtn: document.querySelector(element + ' .icon[data-input="play/pause"]'),
         playIco: document.querySelector(element + ' .icon[data-input="play/pause"] i'),

         fullscreenBtn: document.querySelector(element + ' .icon[data-input="fullscreen"]'),
         fullscreenIco: document.querySelector(element + ' .icon[data-input="fullscreen"] i'),

         volume: document.querySelector(element + ' .volume'),
         volumeBtn: document.querySelector(element + ' .icon[data-input="sound"]'),
         volumeIco: document.querySelector(element + ' .icon[data-input="sound"] i'),
         volumeContainer: document.querySelector(element + ' .volume-container'),
         volumeConterContainer: document.querySelector(element + ' .volume .counter-container'),
         volumeNumber: document.querySelector(element + ' .volume .counter'),
         volumeFill: document.querySelector(element + ' .volume .fill'),
         volumeThumb: document.querySelector(element + ' .volume .thumb'),

         help: document.querySelector(element + ' .help'),
         helpContent: document.querySelector(element + ' .help .content'),
         helpBtn: document.querySelector(element + ' .title .icon'),
         helpCloseBtn: document.querySelector(element + ' .help .icon'),

         settingsBtn: document.querySelector(element + ' .icon[data-input="settings"]'),
         settings: document.querySelector(element + ' .settings'),
         qualityList: document.querySelector(element + ' .settings .quality-list'),
         speedList: document.querySelector(element + ' .settings .speed'),
         speedMark: document.querySelector(element + ' .settings .speed .mark'),

         currentTime: document.querySelector(element + ' .current-time'),
         duration: document.querySelector(element + ' .duration'),

         timeline: document.querySelector(element + ' .timeline'),
         timelineFill: document.querySelector(element + ' .timeline .fill'),
         timelineBuffer: document.querySelector(element + ' .timeline .buffer'),
         timelineThumb: document.querySelector(element + ' .timeline .thumb'),
         timelineTimeThumbContainer: document.querySelector(element + ' .timeline .time-thumb-container'),
         timelineTimeThumb: document.querySelector(element + ' .timeline .time-thumb'),
      }

      this.callbacks = {
         play: null,
         pause: null,
         forward: null,
         backward: null,
         setTime: null,
         setQuality: null,
         setVolume: null,
         setSpeed: null,
         load: null,
         fullscreen: null,
         fullscreenOut: null
      }

      this.speedList = [0.25, 0.5, 1, 1.5, 2]

      this.status = {
         movieUrl: null,
         play: false,
         lastPlay: false,
         fullscreen: false,
         volume: 100,
         lastVolume: 100,
         duration: {s: 0, m: 0, h: 0, time: 0},
         time: {s: 0, m: 0, h: 0, time: 0},
         quality: null,
         speed: 1,
         showControls: false
      }

      this.rewindTime = 5
      this.volumeChanging = false
      this.isQualityChanging = false
      this.showTimeThumb = false
      this.loading = true
      this.controlsTimeout = null
      this.controlsIsHover = false
      this.showSettings = false
      this.canScroll = true
      this.startOnload = false
      this.resizeTimeout = null
      this.setTimeTimeout = null
      this.disableHover = false
      this.disableVideoTimeUpdate = false
      this.isTimelineChanging = false
      this.isHelpShow = false
      this.showInfoTimeout = null

      // this.checkInterval = 50.0
      this.lastPlayPos = 0
      this.lastPlayTime = 0
      this.currentPlayPos = 0
      this.currentPlayTime = 0
      this.bufferingDetected = false
      window.requestAnimationFrame(this.checkBuffering.bind(this))

      this.updateRewindTexts()
      this.addEvents()
      this.setVolume()
   }

   createPlayer() {
      this.playerEl.setAttribute("tabindex", "0")
      this.playerEl.innerHTML = `
      <div class="title">
         <div class="text"></div>
         <div class="icon" data-color="before-background">
            <i class="material-icons">help_outline</i>
         </div>
      </div>
      <video></video>

      <div class="help">
         <div class="icon" data-color="before-background">
            <i class="material-icons">close</i>
         </div>

         <div class="content">
            <div class="desktop">
               <table>
                  <tr>
                     <td><span class="negative">Click</span></td>
                     <td>Pause / Play</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Space</span></td>
                     <td>Pause / Play</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Arrow left</span></td>
                     <td>Backwards <span data-rewind-time></span>s</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Arrow right</span></td>
                     <td>Forwards <span data-rewind-time></span>s</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Arrow up</span></td>
                     <td>Volume up</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Arrow down</span></td>
                     <td>Volume down</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Scroll</span></td>
                     <td>Set volume</td>
                  </tr>
                  <tr>
                     <td><span class="negative">M</span></td>
                     <td>Mute</td>
                  </tr>
                  <tr>
                     <td><span class="negative">F</span></td>
                     <td>Fullscreen</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Double Click</span></td>
                     <td>Fullscreen</td>
                  </tr>
               </table>
            </div>
            <div class="mobile">
               <table>
                  <tr>
                     <td><span class="negative">Tap</span></td>
                     <td>Show Controls > Pause / Play</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Swipe left</span></td>
                     <td>Backwards <span data-rewind-time></span>s</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Swipe right</span></td>
                     <td>Forwards <span data-rewind-time></span>s</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Swipe up / down</span></td>
                     <td>Set volume</td>
                  </tr>
                  <tr>
                     <td><span class="negative">Double Tap</span></td>
                     <td>Fullscreen</td>
                  </tr>
               </table>
            </div>
         </div>
      </div>

      <div class="loading">
         <div class="circle1"></div>
         <div class="circle2" data-color="border-left"></div>
      </div>

      <div class="info"></div>

      <div class="big-play">
         <i class="material-icons">play_arrow</i>
      </div>


      <div class="controls">
         <div class="background"></div>
         <div class="icon" data-input="play/pause" data-color="before-background">
            <i class="material-icons">play_arrow</i>
         </div>
         <div class="icon" data-input="sound" data-color="before-background">
            <i class="material-icons">volume_up</i>
         </div>
         <div class="icon" data-input="settings" data-color="before-background">
            <i class="material-icons">settings</i>
         </div>
         <div class="icon" data-input="fullscreen" data-color="before-background">
            <i class="material-icons">fullscreen</i>
         </div>

         <div class="volume-container">
            <div class="volume active">
               <div class="track">
                  <div class="fill" data-color="background"></div>
               </div>
               <div class="thumb"></div>
               <div class="counter-container">
                  <div class="counter"></div>
               </div>
            </div>
         </div>

         <div class="timeline-container">
            <div class="timeline">
               <div class="track">
                  <div class="buffer"></div>
                  <div class="fill" data-color="background"></div>
               </div>
               <div class="thumb"></div>
               <div class="time-thumb-container">
                  <div class="time-thumb">00:00</div>
               </div>
            </div>
         </div>


         <div class="settings">
            <div class="speed">
               <div class="mark p2" data-color="background"></div>
               <div class="speed-item" data-speed="0.25">0.25</div>
               <div class="speed-item" data-speed="0.5">0.5</div>
               <div class="speed-item" data-speed="1">1</div>
               <div class="speed-item" data-speed="1.5">1.5</div>
               <div class="speed-item" data-speed="2">2</div>
            </div>
            <div class="separator"></div>
            <div class="quality-list" data-color="scrollbar"></div>
         </div>

         <div class="time"><span class="current-time">00:00</span> / <span class="duration">00:00</span></div>
      </div>
      `
   }

   addEvents() {
      this.elements.playBtn.addEventListener('click', this.playPause.bind(this))
      this.elements.helpCloseBtn.addEventListener('click', this.hideHelp.bind(this))
      this.elements.settingsBtn.addEventListener('click', this.showHideSettings.bind(this))
      this.elements.video.addEventListener('ended', this.playPause.bind(this))
      this.elements.fullscreenBtn.addEventListener('click', this.fullscreen.bind(this))
      this.elements.volumeBtn.addEventListener('click', this.mute.bind(this))
      this.elements.volumeContainer.addEventListener('mousedown', this.volumeMouseDown.bind(this))
      this.elements.timeline.addEventListener('mousedown', this.timelineMouseDown.bind(this))
      this.elements.timeline.addEventListener('mouseup', this.timelineMouseUp.bind(this))
      this.elements.timeline.addEventListener('mousemove', this.timelineMouseMove.bind(this))
      this.elements.timeline.addEventListener('mouseenter', this.showTime.bind(this))
      this.elements.timeline.addEventListener('mouseleave', this.hideTime.bind(this))
      window.addEventListener('mousemove', this.mouseMove.bind(this))
      this.playerEl.addEventListener('mousemove', this.showControls.bind(this))
      this.playerEl.addEventListener('keydown', this.keyDown.bind(this))
      this.playerEl.addEventListener('wheel', this.scroll.bind(this))
      window.addEventListener('mouseup', this.mouseUp.bind(this))
      window.addEventListener('resize', this.resizeEvent.bind(this))
      this.elements.video.addEventListener('loadeddata', this.videoOnLoad.bind(this), false)
      this.elements.video.addEventListener('timeupdate', this.videoTimeUpdate.bind(this))
      this.elements.video.addEventListener('progress', this.videoProgress.bind(this))
      this.elements.controls.addEventListener('mouseenter', this.controlsHover.bind(this))
      this.elements.controls.addEventListener('mouseleave', this.controlsHoverOut.bind(this))
      this.elements.qualityList.addEventListener('mouseenter', this.disableScroll.bind(this))
      this.elements.qualityList.addEventListener('mouseleave', this.eneableScroll.bind(this))
      this.elements.speedList.addEventListener('click', this.speedClick.bind(this))
      this.elements.qualityList.addEventListener('click', this.qualityClick.bind(this))

      this.swipeHelp = new Hammer(this.elements.helpBtn)
      this.swipe = new Hammer(this.elements.video)
      this.hammerGeneral = new Hammer(this.playerEl)
      this.timelineSwipe = new Hammer(this.elements.timeline)

      this.swipe.get('pan').set({
         direction: Hammer.DIRECTION_VERTICAL
      })
      this.swipe.get('tap').set({
         posThreshold: 80
      })

      this.swipe.on('pan', this.panEvent.bind(this))
      this.timelineSwipe.on('pan', this.timelinePanEvent.bind(this))
      this.swipe.on('swipe', this.swipeEvent.bind(this))
      this.swipe.on('tap', this.tapEvent.bind(this))
      this.swipeHelp.on('tap', this.showHelp.bind(this))
      this.hammerGeneral.on('tap', this.tapGeneral.bind(this))

   }

   timelineMouseDown() {
      this.isTimelineChanging = true
   }

   tapGeneral(e) {
      if(e.pointerType == 'touch') {
         this.disableHover = true
      }
      else {
         this.disableHover = false
      }
   }

   resizeEvent() {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(() => {
         if(this.playerEl.offsetWidth < 420) {
            this.playerEl.classList.add('mobile')
         } else {
            this.playerEl.classList.remove('mobile')
         }
         this.updateTimeline()
      }, 100)
   }

   panEvent(e) {
      if(e.pointerType === 'touch') {
         if(e.velocityX < 0.1 && e.velocityX > -0.1) {
            let velocity = e.velocityY * 10
            if(velocity > 0) velocity = Math.ceil(velocity)
            if(velocity < 0) velocity = Math.floor(velocity)
            velocity *= -1
            let newVolume =this.status.volume + velocity
            if(newVolume > 100) newVolume = 100
            if(newVolume < 0) newVolume = 0
            this.setVolume(newVolume)
            this.showInfo('volume')
         }
      }
   }

   swipeEvent(e) {
      if(e.pointerType === 'touch') {
         if(e.deltaX > 0 ) {
            this.timeForward()
         } else {
            this.timeBackwards()
         }
      }
   }

   tapEvent(e) {
      if(e.pointerType === 'mouse') {
         this.playPause()

         if(e.tapCount === 2) {
            this.fullscreen()
         }
      } else {
         if(e.tapCount === 2) {
            this.fullscreen()
         }
         else if(this.status.showControls) {
            this.playPause()
         }
      }
   }

   updateRewindTexts() {
      let elements = document.querySelectorAll(this.playerStr + " span[data-rewind-time]")
      elements.forEach(element => {
         element.innerHTML = this.rewindTime
      })
   }

   showHelp(e) {
      if(e.pointerType === 'mouse') {
         this.elements.help.classList.add('show')
         this.elements.helpContent.setAttribute('data-content', 'desktop')
      } else {
         setTimeout(() => {
            this.elements.help.classList.add('show')
         }, 100)
         this.elements.helpContent.setAttribute('data-content', 'mobile')
      }
      this.isHelpShow = true
   }

   setThemeColor(color) {
      let beforeStyle = document.querySelector('style[data-theme-style]')
      if(beforeStyle) beforeStyle.remove()

      if(color != 'default') {
         let css = `
         ${this.playerStr} *[data-color=background] { background-color: ${color} !important; }
         ${this.playerStr} *[data-color=before-background]:before { background-color: ${color} !important; }
         ${this.playerStr} *[data-color=border-left] { border-left-color: ${color} !important; }
         ${this.playerStr} *[data-color=scrollbar]::-webkit-scrollbar-thumb { background-color: ${color} !important; }
         `
         let head = document.head || document.getElementsByTagName('head')[0]
         let style = document.createElement('style')

         head.appendChild(style)

         style.type = 'text/css'
         style.setAttribute('data-theme-style', color)
         if (style.styleSheet){
            style.styleSheet.cssText = css;
         } else {
            style.appendChild(document.createTextNode(css));
         }
      }
   }

   checkBuffering() {
      let date = new Date()
      this.currentPlayPos = this.elements.video.currentTime
      this.currentPlayTime = date.getTime()
      let deltaTime = this.currentPlayTime - this.lastPlayTime
      let offset = ((deltaTime - 5) / 1000) * this.status.speed
      let time = this.currentPlayPos - (this.lastPlayPos + offset)

      if(this.status.time.time < this.status.duration.time - 1) {
         if (
            !this.bufferingDetected
            && time < 0
            && this.status.play
         ) {
            this.showLoading()
            this.bufferingDetected = true
         }
         else if (
            this.bufferingDetected
            && time > 0
            && this.status.play
         ) {
            this.hideLoading()
            this.bufferingDetected = false
         }
      } else {
         this.hideLoading()
         this.bufferingDetected = false
      }

      this.lastPlayPos = this.currentPlayPos
      this.lastPlayTime = this.currentPlayTime
      window.requestAnimationFrame(this.checkBuffering.bind(this))
   }

   hideHelp() {
      this.elements.help.classList.remove('show')
      this.isHelpShow = false
   }

   speedClick(e) {
      let speed = Number(e.target.getAttribute('data-speed'))
      if(speed !== 0) {
         this.setTimeSpeed(speed)
      }
   }

   qualityClick(e) {
      let quality = e.target.innerHTML
      this.setQuality(quality)
   }

   setQuality(quality) {
      let movieIndex = this.movies.map(function(e) { return e.quality }).indexOf(quality)
      if(this.movieIndex !== -1) {
         this.playerEl.style.width = this.playerEl.offsetWidth + "px"
         this.playerEl.style.height = this.playerEl.offsetHeight + "px"
         this.showLoading()
         let movie = this.movies[movieIndex]
         let start = this.status.play
         if(start) {
            this.playPause()
            this.startOnload = true
         }
         this.elements.video.src = movie.src
         this.elements.video.currentTime = this.status.time.time
         this.status.quality = quality
         this.status.movieUrl = movie.src
         this.updateQualityList()

         if(this.callbacks.setQuality) {
            this.callbacks.setQuality(this.status)
         }

         this.isQualityChanging = true
      }
   }

   setTimeSpeed(speed) {
      let position = this.speedList.indexOf(speed)
      this.elements.speedMark.classList.remove(this.elements.speedMark.classList[1])
      this.elements.speedMark.classList.add('p' + position)
      this.status.speed = speed
      this.elements.video.playbackRate = speed

      if(this.callbacks.setSpeed) {
         this.callbacks.setSpeed(this.status)
      }
   }

   disableScroll() {
      this.canScroll = false
   }

   eneableScroll() {
      this.canScroll = true
   }

   showHideSettings() {
      if(this.showSettings) {
         this.hideSettings()
      } else {
         this.elements.settings.classList.add('show')
         this.showSettings = true
      }
   }

   hideSettings() {
      this.elements.settings.classList.remove('show')
      this.showSettings = false
   }

   controlsHover() {
      if(!this.disableHover) {
         this.controlsIsHover = true
      }
   }

   controlsHoverOut() {
      this.controlsIsHover = false
      this.showControls()
   }

   showLoading() {
      this.elements.loading.classList.add('show')
      this.loading = true
   }

   hideLoading() {
      this.elements.loading.classList.remove('show')
      this.loading = false
   }

   showBigPlay() {
      this.elements.bigPlay.classList.add('show')
   }

   hideBigPlay() {
      this.elements.bigPlay.classList.remove('show')
   }

   showTime() {
      this.elements.timelineTimeThumbContainer.classList.add('active')
      this.showTimeThumb = true
   }

   hideTime() {
      this.elements.timelineTimeThumbContainer.classList.remove('active')
      this.showTimeThumb = false
   }

   videoTimeUpdate() {
      if(!this.disableVideoTimeUpdate) {
         this.status.time = this.convertTime(this.elements.video.currentTime)
         this.updateTimeline()

         if(!this.isQualityChanging && !this.status.play) {
            this.hideLoading()
         }
      } else {
         if(this.status.play) {
            this.playPause(true)
            this.status.lastPlay = true
         }
      }
   }

   videoProgress() {
      let buffered = this.elements.video.buffered
      if (this.status.duration.time > 0) {
         for (let i = 0; i < buffered.length; i++) {
            if (buffered.start(buffered.length - 1 - i) < this.status.time.time) {
               let value = buffered.end(buffered.length - 1 - i) / this.status.duration.time
               this.elements.timelineBuffer.style.transform = `scaleX(${value})`
               break;
            }
         }
      }
   }

   showInfo(type, text) {
      switch(type) {
         case 'volume': {
            let icon = ''
            if(this.status.volume > 60) {
               icon = 'volume_up'
            }
            else if(this.status.volume > 30) {
               icon = 'volume_down'
            }
            else if(this.status.volume !== 0) {
               icon = 'volume_mute'
            }
            else {
               icon = 'volume_off'
            }

            this.elements.info.innerHTML = `
               <div class="circle">
                  <i class="material-icons small-icon">${icon}</i>
                  <div class="text">${this.status.volume}%</div>
               </div>
            `
            break;
         }

         case 'time': {
            let icon = text === '+' ? 'forward_' + this.rewindTime : 'replay_' + this.rewindTime
            this.elements.info.innerHTML = `
               <div class="circle">
                  <i class="material-icons big-icon">${icon}</i>
               </div>
            `
            break;
         }

         case 'play': {
            this.elements.info.innerHTML = `
               <div class="circle">
                  <i class="material-icons big-icon">play_arrow</i>
               </div>
            `
            break;
         }

         case 'pause': {
            this.elements.info.innerHTML = `
               <div class="circle">
                  <i class="material-icons big-icon">pause</i>
               </div>
            `
            break;
         }
      }
      this.elements.info.classList.add('show')

      clearTimeout(this.showInfoTimeout)
      this.showInfoTimeout = setTimeout(() => {
         this.elements.info.classList.remove('show')
      }, 500)

   }

   setRewindTime(time) {
      if(time === 5 || time === 10 || time === 30) {
         this.rewindTime = time
         this.updateRewindTexts()
      } else {
         console.warn('Posible rewind times: 5; 10; 30')
      }
   }

   updateTimeline() {
      this.elements.currentTime.innerHTML = this.timeToStr(this.status.time)
      let timePercent = this.status.time.time / this.status.duration.time
      if(isNaN(timePercent)) timePercent = 0
      let thumbPos = this.elements.timeline.offsetWidth * timePercent
      this.elements.timelineFill.style.transform = `scaleX(${timePercent})`
      this.elements.timelineThumb.style.transform = `translateX(${thumbPos}px)`
   }

   scroll(e) {
      if(this.canScroll) {
         if(e.deltaY > 0 ) this.volumeDown()
         else this.volumeUp()
      }
   }

   keyDown(e) {
      switch(e.code) {
         case 'Space': this.playPause(); break
         case 'ArrowUp': this.volumeUp(); this.showInfo('volume'); break
         case 'ArrowDown': this.volumeDown(); this.showInfo('volume'); break
         case 'ArrowLeft': this.timeBackwards(); break
         case 'ArrowRight': this.timeForward(); break
         case 'KeyF': this.fullscreen(); break
         case 'KeyM': this.mute(); this.showInfo('volume'); break
      }
   }

   volumeUp() {
      let volume = this.status.volume + 10
      if(volume > 100) volume = 100
      this.setVolume(volume)
      this.showInfo('volume')
   }
   volumeDown() {
      let volume = this.status.volume - 10
      if(volume < 0) volume = 0
      this.setVolume(volume)
      this.showInfo('volume')
   }

   getStatus() {
      return this.status
   }

   videoOnLoad() {
      this.status.duration = this.convertTime(this.elements.video.duration)
      this.elements.duration.innerHTML = this.timeToStr(this.status.duration)
      this.resizeEvent()
      if(this.startOnload) {
         this.playPause()
         this.startOnload = false
      } else {
         this.showBigPlay()
      }
      this.playerEl.removeAttribute('style')

      this.hideLoading()
      this.isQualityChanging = false
      this.setTimeSpeed(this.status.speed)
   }

   volumeMouseDown(e) {
      this.volumeChanging = true;
      this.elements.volumeConterContainer.classList.add('active')

      this.setVolume(this.getVolumeFromEvent(e))
   }

   timelineMouseMove(e) {
      if(this.isTimelineChanging) {
         this.setTime(this.getTimeFromEvent(e))
      }
   }

   timelinePanEvent(e) {
      this.setTime((this.getTimeFromEvent(e.srcEvent)))
      this.showControls()
   }

   timelineMouseUp(e) {
      this.setTime(this.getTimeFromEvent(e))
   }

   mouseMove(e) {
      if(this.volumeChanging) {
         this.setVolume(this.getVolumeFromEvent(e))
      }

      if(this.showTimeThumb) {
         this.updateTimeThumb(e)
      }
   }

   showControls() {
      this.elements.controls.classList.add('show')
      this.elements.title.classList.add('show')
      this.playerEl.classList.add('show-cursor')
      this.status.showControls = true

      clearTimeout(this.controlsTimeout)
      this.controlsTimeout = setTimeout(this.hideControls.bind(this), 1000)
   }

   hideControls() {
      if(this.controlsIsHover === false && this.showSettings === false && !this.isHelpShow) {
         this.elements.controls.classList.remove('show')
         this.elements.title.classList.remove('show')
         this.playerEl.classList.remove('show-cursor')
         this.status.showControls = false
      }
   }

   mouseUp() {
      this.volumeChanging = false;
      this.isTimelineChanging = false;
      this.elements.volumeConterContainer.classList.remove('active')
   }

   updateTimeThumb(e) {
      let offset = this.elements.timeline.getBoundingClientRect().x
      let thumbWidth = this.elements.timelineTimeThumb.offsetWidth
      let max = this.elements.timeline.offsetWidth
      let x = e.clientX - offset - (thumbWidth / 2)
      let time = this.timeToStr(this.convertTime(this.getTimeFromEvent(e)))
      if(x < 0) x = 0;
      if(x > max - thumbWidth) x = max - thumbWidth

      this.elements.timelineTimeThumb.style.transform = `translateX(${x}px)`
      this.elements.timelineTimeThumb.innerHTML = time

   }

   getVolumeFromEvent(e) {
      let offset = this.elements.volume.getBoundingClientRect().x
      let x = e.clientX - offset
      if(x > 100) x = 100
      if(x < 0) x = 0
      return x
   }

   getTimeFromEvent(e) {
      let offset = this.elements.timeline.getBoundingClientRect().x
      let max = this.elements.timeline.offsetWidth
      let x = e.clientX - offset
      if(x > max) x = max
      if(x < 0) x = 0

      let percent = x / max
      let time = this.status.duration.time * percent

      return time
   }

   setVolume(value) {
      if(value !== undefined) {
         if(value === 0 && this.status.volume !== 0) {
            this.status.lastVolume = this.status.volume
         }

         this.status.volume = value
      }

      this.elements.volumeNumber.innerHTML = this.status.volume
      this.elements.volumeNumber.style.transform = `translateX(${this.status.volume}px)`
      this.elements.volumeThumb.style.transform = `translateX(${this.status.volume}px)`
      this.elements.volumeFill.style.transform = `scaleX(${this.status.volume / 100})`
      this.elements.video.volume = this.status.volume / 100;

      if(this.status.volume > 60) {
         this.elements.volumeIco.innerHTML = 'volume_up'
      }
      else if(this.status.volume > 30) {
         this.elements.volumeIco.innerHTML = 'volume_down'
      }
      else if(this.status.volume !== 0) {
         this.elements.volumeIco.innerHTML = 'volume_mute'
      }
      else {
         this.elements.volumeIco.innerHTML = 'volume_off'
      }

      if(this.callbacks.setVolume) {
         this.callbacks.setVolume(this.status)
      }
   }

   setTime(time) {
      this.status.time = this.convertTime(time)
      this.updateTimeline()
      if(!this.status.play) {
         this.showLoading()
      }

      if(this.setTimeTimeout === null) {
         this.elements.video.currentTime = time
         if(this.callbacks.setTime) {
            this.callbacks.setTime(this.status)
         }

         this.setTimeTimeout = setTimeout(() => {
            this.setTimeTimeout = null
         }, 400)
      } else {
         this.showControls()
         clearTimeout(this.setTimeTimeout)
         this.disableVideoTimeUpdate = true
         this.setTimeTimeout = setTimeout(() => {
            this.elements.video.currentTime = time
            if(this.callbacks.setTime) {
               this.callbacks.setTime(this.status)
            }

            this.setTimeTimeout = null
            this.disableVideoTimeUpdate = false
            if(this.status.lastPlay) {
               this.playPause(true)
               this.status.lastPlay = false
            }
         }, 400)
      }
   }

   timeForward() {
      let time = this.status.time.time
      time += this.rewindTime;
      if(time > this.status.duration.time) time = this.status.duration.time
      this.setTime(time)
      this.showInfo('time', '+')

      if(this.callbacks.forward) {
         this.callbacks.forward(this.status)
      }
   }

   timeBackwards() {
      let time = this.status.time.time
      time -= this.rewindTime;
      if(time < 0) time = 0
      this.setTime(time)
      this.showInfo('time', '-')

      if(this.callbacks.backward) {
         this.callbacks.backward(this.status)
      }
   }

   mute() {
      if(this.status.volume === 0) {
         this.setVolume(this.status.lastVolume)
      } else {
         this.setVolume(0)
      }
   }

   playPause(noinfo) {
      if(this.status.play) {
         this.elements.video.pause()
         this.elements.playIco.innerHTML = 'play_arrow'
         this.status.play = false
         this.showBigPlay()
         if(!noinfo) this.showInfo('pause')
         if(this.callbacks.pause) {
            this.callbacks.pause(this.status)
         }
      } else {
         this.elements.video.play()
         this.elements.playIco.innerHTML = 'pause'
         this.status.play = true
         this.hideBigPlay()
         if(!noinfo) this.showInfo('play')
         this.hideSettings()
         if(this.callbacks.play) {
            this.callbacks.play(this.status)
         }
      }
   }

   fullscreen() {
      if(this.status.fullscreen) {
         if (document.exitFullscreen) {
            document.exitFullscreen()
         } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
         } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
         } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
         }

         this.elements.fullscreenIco.innerHTML = 'fullscreen'
         this.status.fullscreen = false

         if(this.callbacks.fullscreenout) {
            this.callbacks.fullscreenout(this.status)
         }
      } else {

         if (this.playerEl.requestFullscreen) {
            this.playerEl.requestFullscreen()
         } else if (this.playerEl.mozRequestFullScreen) {
            this.playerEl.mozRequestFullScreen()
         } else if (this.playerEl.webkitRequestFullscreen) {
            this.playerEl.webkitRequestFullscreen()
         } else if (this.playerEl.msRequestFullscreen) {
            this.playerEl.msRequestFullscreen()
         }
         this.elements.fullscreenIco.innerHTML = 'fullscreen_exit'
         this.status.fullscreen = true

         if(this.callbacks.fullscreen) {
            this.callbacks.fullscreen(this.status)
         }
      }

      this.updateTimeline()
   }

   on(event, callback) {
      if(this.callbacks[event] !== undefined && this.isFunction(callback)) {
         this.callbacks[event] = callback
      } else {
         console.warn('Incorrect event or callback: ' + event)
      }
   }

   isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
   }

   load(options) {
      if(!options) {
         console.error('No configuration defined')
         return
      }
      if(!options.movies) {
         console.error('No movies list defined')
         return
      }

      this.movies = options.movies

      let defaultMovie = this.movies.map(function(e) { return e.default }).indexOf(true);

      if(defaultMovie === -1) {
         defaultMovie = this.movies[0]
      } else {
         defaultMovie = this.movies[defaultMovie]
      }

      this.status.movieUrl = defaultMovie.src
      this.elements.video.src = defaultMovie.src
      this.status.quality = defaultMovie.quality
      // this.showLoading()

      if(options.title) {
         this.elements.titleText.innerHTML = options.title
      } else {
         this.elements.titleText.innerHTML = ''
      }

      this.updateQualityList()

      if(this.callbacks.load) {
         this.callbacks.load(this.status)
      }

      this.showLoading()
   }

   updateQualityList() {
      let qualityItems = ''
      this.movies.forEach(element => {
         let active = ''
         if(element.quality === this.status.quality) active = ' active'
         qualityItems += `<div class="quality-item${active}" data-color="before-background">${element.quality}</div>`
      })

      this.elements.qualityList.innerHTML = qualityItems
   }

   convertTime(time) {
      let seconds = Math.floor(time % 60)
      let minutes = Math.floor(time / 60)
      let hours = Math.floor(minutes / 60)

      return {
         s: seconds,
         m: minutes,
         h: hours,
         time: time
      }
   }

   timeToStr(time) {
      let result = ''
      if(time.h !== 0) result += time.h + ':'
      if(time.m < 10) result += '0'
      result += time.m + ':'
      if(time.s < 10) result += '0'
      result += time.s

      return result
   }
}

window.UjsPlayer = ujsPlayer