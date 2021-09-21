document.addEventListener('DOMContentLoaded',() => {
    // grid の div エレメントをループ処理で作成
    const width = 10
    const height = 20
    const grid_size = width * height
    const grid = document.querySelector('.grid')

    for (let i = 0; i < grid_size; i++) {
        const square = document.createElement('div')
        grid.appendChild(square)
    }

    for (let i = 0; i < width; i++) {
        const square = document.createElement('div')
        square.setAttribute('class','taken')
        grid.appendChild(square)
    }
    let squares = Array.from(document.querySelectorAll('.grid div'))


    // テトロミノの定義
    const lTetromino = [
        [1,width + 1,width * 2 + 1,2],
        [width,width + 1,width + 2,width * 2 + 2],
        [1,width + 1,width * 2 + 1,width * 2],
        [width,width * 2,width * 2 + 1,width * 2 + 2]
    ]

    const zTetromino = [
        [0,width,width + 1,width * 2 + 1],
        [width + 1,width + 2,width * 2,width * 2 + 1],
        [0,width,width + 1,width * 2 + 1],
        [width + 1,width + 2,width * 2,width * 2 + 1]
    ]

    const tTetromino = [
        [1,width,width + 1,width + 2],
        [1,width + 1,width + 2,width * 2 + 1],
        [width,width + 1,width + 2,width * 2 + 1],
        [1,width,width + 1,width * 2 + 1]
    ]

    const oTetromino = [
        [0,1,width,width + 1],
        [0,1,width,width + 1],
        [0,1,width,width + 1],
        [0,1,width,width + 1]
    ]

    const iTetromino = [
        [1,width + 1,width * 2 + 1,width * 3 + 1],
        [width,width + 1,width + 2,width + 3],
        [1,width + 1,width * 2 + 1,width * 3 + 1],
        [width,width + 1,width + 2,width + 3]
    ]

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    // テトロミノの２次元配列
    const Tetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

    // 定数
    const scoreDisplay = document.querySelector('.score')
    const startBtn = document.querySelector('.button')

    // 変数
    let nextRandom = 0
    let currentRotation = 0
    let random = Math.floor(Math.random() * Tetrominoes.length)
    let current = Tetrominoes[random][currentRotation]

    let currentPosition = 4
    let score = 0
    let timerId

    //////////////////////////////////////

    // ボタンクリックで動き処理スタート
    startBtn.addEventListener('click',() => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            timerId = setInterval(moveDown,1000)
            nextRandom = Math.floor(Math.random() * Tetrominoes.length)
            displayNext()
        }
    })

    // テトロミノを下に移動
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // テトロミノを表示
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // テトロミノを非表示
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = null
        })
    }

    // テトロミノを固定する
    function freeze() {
        if (current.some(index =>
            squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            random = nextRandom
            nextRandom = Math.floor(Math.random() * Tetrominoes.length)
            current = Tetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayNext()
            addScore()
            gameOver()
        }
    }

    // テトロミノを動かす
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup',control)

    // テトロミノを左に移動
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }


    // テトロミノを右に移動
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }


    // テトロミノを回転
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = Tetrominoes[random][currentRotation]
        checkRotatePosition()
        draw()
    }


    // テトロミノが右端にはみ出るかチェック
    function atRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }
    // テトロミノが左端にはみ出るかチェック
    function atLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    // 画面橋でテトロミノの回転を制御
    function checkRotatePosition(P) {
        Pos = P || currentPosition // 変数 'Pos' に 引数 'P" か 今の場所を代入

        if ((Pos + 1) % width < 4) { // テトロミノが左側にある場合
            if (atRight()) { // 右端にはみ出したら
                currentPosition += 1 // 左に１グリッド移動
                checkRotatePosition(Pos) // 再度位置を確認（長いブロック用）
            }
        }
        else if (Pos % width > 5) { // テトロミノが右側にある場合
            if (atLeft()) { // 左端にはみ出したら
                currentPosition -= 1 // 右に１グリッド移動
                checkRotatePosition(Pos) // 再度位置を確認（長いブロック用）
            }
        }
    }


    ////////////////////////////

    // mini-grid の div エレメントをループ処理で作成
    const miniIndex = 0
    const mini_width = 4
    const mini_height = 4
    const mini_grid_size = mini_width * mini_height
    const mini_grid = document.querySelector('.mini-grid')

    for (let i = 0; i < mini_grid_size; i++) {
        const square = document.createElement('div')
        mini_grid.appendChild(square)
    }
    const mini_squares = Array.from(document.querySelectorAll('.mini-grid div'))

    // 回転していない状態のテトロミノを定義
    const NextTetrominoes = [
        [1,mini_width + 1,mini_width * 2 + 1,2], //lTetromino
        [0,mini_width,mini_width + 1,mini_width * 2 + 1], //zTetromino
        [1,mini_width,mini_width + 1,mini_width + 2], //tTetromino
        [0,1,mini_width,mini_width + 1], //oTetromino
        [1,mini_width + 1,mini_width * 2 + 1,mini_width * 3 + 1] //iTetromino
    ]

    // 次のテトロミノを表示
    function displayNext() {
        mini_squares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        NextTetrominoes[nextRandom].forEach(index => {
            mini_squares[miniIndex + index].classList.add('tetromino')
            mini_squares[miniIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    ////////////////////////////

    // 一列並んだ時の処理
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i,i + 1,i + 2,i + 3,i + 4,i + 5,i + 6,i + 7,i + 8,i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score

                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squareRemoved = squares.splice(i,width)
                squares = squareRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Game Over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
            document.removeEventListener('keyup',control)
        }
    }

})