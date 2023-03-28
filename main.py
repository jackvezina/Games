player: game.LedSprite = None
shoot: game.LedSprite = None
Enemy: game.LedSprite = None

def showGame(type: number):
    basic.show_string("" + (Games[type]))

def drawDice(type: number, num: number):
    if type == 6:
        if num == 1:
            basic.show_leds("""
                . . . . .
                . . . . .
                . . # . .
                . . . . .
                . . . . .
            """)
        elif num == 2:
            basic.show_leds("""
                # . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . #
            """)
        elif num == 3:
            basic.show_leds("""
                . . . . #
                . . . . .
                . . # . .
                . . . . .
                # . . . .
            """)
        elif num == 4:
            basic.show_leds("""
                # . . . #
                . . . . .
                . . . . .
                . . . . .
                # . . . #
            """)
        elif num == 5:
            basic.show_leds("""
                # . . . #
                . . . . .
                . . # . .
                . . . . .
                # . . . #
            """)
        elif num == 6:
            basic.show_leds("""
                # . . . #
                . . . . .
                # . . . #
                . . . . .
                # . . . #
            """)
        else:
            pass
    else:
        if type == 10:
            basic.show_number(num - 1)
        elif type == 100:
            basic.show_number(num % 10 * 10)
        else:
            basic.show_number(num)

def setDiceType():
    global Type
    led.stop_animation()
    basic.clear_screen()
    if Type < 6:
        Type = 6
    elif Type < 8:
        Type = 8
    elif Type < 10:
        Type = 10
    elif Type < 12:
        Type = 12
    elif Type < 20:
        Type = 20
    elif Type < 100:
        Type = 100
    else:
        Type = 4
    basic.show_number(Type)


def playPong():
    global point, interval, interval_step, ball_x, ball_y, ball_dx, ball_dy, bar_x, in_game
    point = 0
    interval = 500
    interval_step = 10
    ball_x = 3
    ball_y = 4
    ball_dx = -1
    ball_dy = -1
    bar_x = 0
    basic.show_string("GO!")
    led.plot(ball_x, ball_y)
    led.plot(bar_x, 4)
    led.plot(bar_x + 1, 4)
    in_game = True
    while in_game:
        if ball_x + ball_dx > 4:
            ball_dx = ball_dx * -1
        elif ball_x + ball_dx < 0:
            ball_dx = ball_dx * -1
        if ball_y + ball_dy < 0:
            ball_dy = ball_dy * -1
        elif ball_y + ball_dy > 3:
            if led.point(ball_x + ball_dx, ball_y + ball_dy):
                ball_dy = ball_dy * -1
                point = point + 1
                if interval - interval_step >= 0:
                    interval = interval - interval_step
            else:
                in_game = False
        if in_game:
            led.plot(ball_x + ball_dx, ball_y + ball_dy)
            led.unplot(ball_x, ball_y)
            ball_x = ball_x + ball_dx
            ball_y = ball_y + ball_dy
            basic.pause(interval)
        else:
            game.set_score(point)
            game.game_over()
    
def on_logo_touched():
    global GameType, player, in_game
    if GameType == 2:
        player.delete()
    in_game = False
    led.stop_animation()
    basic.clear_screen()
    GameType = (GameType + 1) % 3
    showGame(GameType)
    if GameType == 2:
        player = game.create_sprite(2, 4)
input.on_logo_event(TouchButtonEvent.TOUCHED, on_logo_touched)

def on_button_pressed_a():
    global bar_x
    if GameType == 0:
        setDiceType()
    elif GameType == 1:
        if bar_x > 0:
            led.unplot(bar_x + 1, 4)
            bar_x = bar_x - 1
            led.plot(bar_x, 4)
    elif GameType == 2:
        player.move(-1)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():
    global shoot
    if GameType == 2:
        shoot = game.create_sprite(player.get(LedSpriteProperty.X),
            player.get(LedSpriteProperty.Y))
        for index in range(4):
            shoot.change(LedSpriteProperty.Y, -1)
            basic.pause(10)
            if Enemy.is_touching(shoot):
                Enemy.delete()
                game.add_score(1)
        shoot.delete()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global Roll, bar_x
    if GameType == 0:
        led.stop_animation()
        basic.clear_screen()
        Roll = 1
    elif GameType == 1:
        if bar_x < 3:
            led.unplot(bar_x, 4)
            bar_x = bar_x + 1
            led.plot(bar_x + 1, 4)
    elif GameType == 2:
        player.move(1)
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_gesture_shake():
    global Roll
    if GameType == 0:
        led.stop_animation()
        basic.clear_screen()
        Roll = 1
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def on_forever():
    global Enemy, Roll, Dice
    if GameType == 0:
        while Roll > 0:
            Roll = Roll - 1
            Dice = randint(1, Type)
            drawDice(Type, Dice)
    elif GameType == 1:
        playPong()
    elif GameType == 2:
        Enemy = game.create_sprite(randint(0, 4), 0)
        basic.pause(500)
        for index2 in range(4):
            Enemy.change(LedSpriteProperty.Y, 1)
            basic.pause(500)
        basic.pause(10)
        Enemy.delete()
basic.forever(on_forever)

def on_forever2():
    global player
    if GameType == 2:
        if player != game.invalid_sprite():
            if Enemy.is_touching(player):
                player.delete()
                game.game_over()
basic.forever(on_forever2)

basic.show_string("JVSoft")
# Dice
Roll = 0
Dice = 0
Type = 6
# Pong
bar_x = 0
point = 0
interval = 0
interval_step = 0
ball_x = 0
ball_y = 0
ball_dx = 0
ball_dy = 0
in_game = False
# Games
GameType = 0
Games: List[str] = []
Games = ["Dice", "Pong", "Invaders"]
GameType = 0
showGame(GameType)
basic.show_arrow(ArrowNames.WEST)
