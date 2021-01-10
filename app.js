document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let isGameOver = false
    let doodlerLeftSpace = 300
    let startPoint = 100
    let doodlerBottomSpace = startPoint
    let platformCount = 7
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId 
    let rightTimerId
    let score = 0

    class Platform {
        constructor(newPlatBottom) {
            this.left = Math.random() * 600
            this.bottom = newPlatBottom
            this.visual = document.createElement('div')
            
            const visual = this.visual 
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'  
            grid.appendChild(visual)  
        }
    }


    function createPlatforms() {
        for(let i=0; i < platformCount; i++) {
            let platGap = 1500 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push (newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 5
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(900)
                    platforms.push(newPlatform)
                }
            })
        }
    }
    
    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }
    
    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 175
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        }, 30)
    }

    function fall() {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 6
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 200) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 200)) &&
                    !isJumping
                    ) {
                        console.log('landed')
                        startPoint = doodlerBottomSpace
                        jump()
                        console.log('start', startPoint)
                        isJumping = true
                    }
            })
        },30)
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true  
        while (grid.firstElementChild) {
            grid.removeChild(grid.firstChild)
        } 
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    window.addEventListener('mousedown', e => {
        let x = e.offsetX;
        if (x < window.innerWidth / 2) {
            console.log("click left")
            moveLeft()
        } else {
            console.log("click right")
            moveRight()
        }
      });
    

    function moveLeft() {
        console.log("left")
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        clearInterval(leftTimerId)
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 7
                doodler.style.left = doodlerLeftSpace + 'px'
            } //else moveRight()
        },30)
    }

    function moveRight() {
        console.log("right")
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        clearInterval(rightTimerId)
        isGoingRight = true 
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 472.5) {
                doodlerLeftSpace += 7
                doodler.style.left = doodlerLeftSpace + 'px'
            } //else moveLeft()
        },30)
    }

    function moveStraight() {
        isGoingRight = false 
        isGoingLeft = false 
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            //document.getElementById("leftbutton").addEventListener("click", moveLeft)
            //document.getElementById("rightbutton").addEventListener("click", moveRight)
            
        }
    }
    document.getElementById("startbutton").addEventListener("click", start)
})
