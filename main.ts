function showGame () {
    basic.showString("" + (Games[Game]))
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    led.stopAnimation()
    basic.clearScreen()
    Game = (Game + 1) % 3
    showGame()
})
let Game = 0
let Games: string[] = []
Games = ["Dice", "Pong", "Invaders"]
Game = 0
showGame()
