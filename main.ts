let player : game.LedSprite = null
let shoot : game.LedSprite = null
let Enemy : game.LedSprite = null
function showGame(type: number) {
    basic.showString("" + Games[type])
}

function drawDice(type: number, num: number) {
    if (type == 6) {
        if (num == 1) {
            basic.showLeds(`
                . . . . .
                . . . . .
                . . # . .
                . . . . .
                . . . . .
            `)
        } else if (num == 2) {
            basic.showLeds(`
                # . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . #
            `)
        } else if (num == 3) {
            basic.showLeds(`
                . . . . #
                . . . . .
                . . # . .
                . . . . .
                # . . . .
            `)
        } else if (num == 4) {
            basic.showLeds(`
                # . . . #
                . . . . .
                . . . . .
                . . . . .
                # . . . #
            `)
        } else if (num == 5) {
            basic.showLeds(`
                # . . . #
                . . . . .
                . . # . .
                . . . . .
                # . . . #
            `)
        } else if (num == 6) {
            basic.showLeds(`
                # . . . #
                . . . . .
                # . . . #
                . . . . .
                # . . . #
            `)
        } else {
            
        }
        
    } else if (type == 10) {
        basic.showNumber(num - 1)
    } else if (type == 100) {
        basic.showNumber(num % 10 * 10)
    } else {
        basic.showNumber(num)
    }
    
}

function setDiceType() {
    
    led.stopAnimation()
    basic.clearScreen()
    if (Type < 6) {
        Type = 6
    } else if (Type < 8) {
        Type = 8
    } else if (Type < 10) {
        Type = 10
    } else if (Type < 12) {
        Type = 12
    } else if (Type < 20) {
        Type = 20
    } else if (Type < 100) {
        Type = 100
    } else {
        Type = 4
    }
    
    basic.showNumber(Type)
}

function playPong() {
    
    point = 0
    interval = 500
    interval_step = 10
    ball_x = 3
    ball_y = 4
    ball_dx = -1
    ball_dy = -1
    bar_x = 0
    basic.showString("GO!")
    led.plot(ball_x, ball_y)
    led.plot(bar_x, 4)
    led.plot(bar_x + 1, 4)
    in_game = true
    while (in_game) {
        if (ball_x + ball_dx > 4) {
            ball_dx = ball_dx * -1
        } else if (ball_x + ball_dx < 0) {
            ball_dx = ball_dx * -1
        }
        
        if (ball_y + ball_dy < 0) {
            ball_dy = ball_dy * -1
        } else if (ball_y + ball_dy > 3) {
            if (led.point(ball_x + ball_dx, ball_y + ball_dy)) {
                ball_dy = ball_dy * -1
                point = point + 1
                if (interval - interval_step >= 0) {
                    interval = interval - interval_step
                }
                
            } else {
                in_game = false
            }
            
        }
        
        if (in_game) {
            led.plot(ball_x + ball_dx, ball_y + ball_dy)
            led.unplot(ball_x, ball_y)
            ball_x = ball_x + ball_dx
            ball_y = ball_y + ball_dy
            basic.pause(interval)
        } else {
            game.setScore(point)
            game.gameOver()
        }
        
    }
}

input.onLogoEvent(TouchButtonEvent.Touched, function on_logo_touched() {
    
    if (GameType == 2) {
        player.delete()
    }
    
    in_game = false
    led.stopAnimation()
    basic.clearScreen()
    GameType = (GameType + 1) % 3
    showGame(GameType)
    if (GameType == 2) {
        player = game.createSprite(2, 4)
    }
    
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (GameType == 0) {
        setDiceType()
    } else if (GameType == 1) {
        if (bar_x > 0) {
            led.unplot(bar_x + 1, 4)
            bar_x = bar_x - 1
            led.plot(bar_x, 4)
        }
        
    } else if (GameType == 2) {
        player.move(-1)
    }
    
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (GameType == 2) {
        shoot = game.createSprite(player.get(LedSpriteProperty.X), player.get(LedSpriteProperty.Y))
        for (let index = 0; index < 4; index++) {
            shoot.change(LedSpriteProperty.Y, -1)
            basic.pause(10)
            if (Enemy.isTouching(shoot)) {
                Enemy.delete()
                game.addScore(1)
            }
            
        }
        shoot.delete()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (GameType == 0) {
        led.stopAnimation()
        basic.clearScreen()
        Roll = 1
    } else if (GameType == 1) {
        if (bar_x < 3) {
            led.unplot(bar_x, 4)
            bar_x = bar_x + 1
            led.plot(bar_x + 1, 4)
        }
        
    } else if (GameType == 2) {
        player.move(1)
    }
    
})
input.onGesture(Gesture.Shake, function on_gesture_shake() {
    
    if (GameType == 0) {
        led.stopAnimation()
        basic.clearScreen()
        Roll = 1
    }
    
})
basic.forever(function on_forever() {
    
    if (GameType == 0) {
        while (Roll > 0) {
            Roll = Roll - 1
            Dice = randint(1, Type)
            drawDice(Type, Dice)
        }
    } else if (GameType == 1) {
        playPong()
    } else if (GameType == 2) {
        Enemy = game.createSprite(randint(0, 4), 0)
        basic.pause(500)
        for (let index2 = 0; index2 < 4; index2++) {
            Enemy.change(LedSpriteProperty.Y, 1)
            basic.pause(500)
        }
        basic.pause(10)
        Enemy.delete()
    }
    
})
basic.forever(function on_forever2() {
    
    if (GameType == 2) {
        if (player != game.invalidSprite()) {
            if (Enemy.isTouching(player)) {
                player.delete()
                game.gameOver()
            }
            
        }
        
    }
    
})
basic.showString("JVSoft")
//  Dice
let Roll = 0
let Dice = 0
let Type = 6
//  Pong
let bar_x = 0
let point = 0
let interval = 0
let interval_step = 0
let ball_x = 0
let ball_y = 0
let ball_dx = 0
let ball_dy = 0
let in_game = false
//  Games
let GameType = 0
let Games : string[] = []
Games = ["Dice", "Pong", "Invaders"]
GameType = 0
showGame(GameType)
basic.showArrow(ArrowNames.West)
