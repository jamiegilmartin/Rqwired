/**
 * Loop Class
 * requestAnimationFrame wrapper
 * @see https://github.com/Augmenticon/Arigo-CV/blob/develop/src/Loop.cpp
 * @see https://gafferongames.com/post/fix_your_timestep/
 */
class Loop {
  startTime: any; //  now
  secondsRunning: number;
  duration: number;
  fps: number; // 60;
  fpsInterval: number; //  1000 / this.fps
  delta: number;
  frame: number;
  interval: 0;
  then: any; //  now
  playing: true;
  t: 0;
  dt: 0.01;
  currentTime: any; //  now
  regulateFPS: true;
  accumulator: 0;
  force: 10.0;
  mass: 1.0;
  run: any;

  constructor() {
    this.startTime = Date.now();
    this.secondsRunning = 0;
    this.duration = 10;
    this.fps = 30; // 60;
    this.fpsInterval = 1000 / this.fps;
    this.delta = 0;
    this.frame = 0;
    this.playing = true;
    this.interval = 0;
    this.t = 0;
    this.dt = 0.01;
    this.regulateFPS = true;
    this.accumulator = 0;
    this.force = 10.0;
    this.mass = 1.0;

    this.then = Date.now();
  }

  init(callback: Function) {
    this.run = callback;
    this.currentTime = Date.now();
    this.loop();
  }

  loop() {
    this.fpsInterval = 1000 / this.fps; // in case the gui changes it
    // get delta
    this.delta = this.currentTime.valueOf() - this.then.valueOf();

    const newTime = Date.now();
    // frame time
    let frameTime = newTime.valueOf() - this.currentTime.valueOf();
    if (frameTime > 0.16) {
      frameTime = 0.16;
    }
    this.currentTime = newTime;
    this.accumulator += frameTime;

    // set state
    let currentState = {
      velocity: 0,
      position: 0,
    };
    let previousState = currentState;

    // update always
    this.update();

    /**
     * @see http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
     * @see http://creativejs.com/resources/requestanimationframe/
     */
    if (this.regulateFPS) {
      if (this.delta > this.fpsInterval) {
        this.then = new Date(
          this.currentTime.valueOf() - (this.delta % this.fpsInterval),
        );

        while (this.accumulator >= this.dt) {
          previousState = currentState;
          currentState = this.integrate(currentState, this.t, this.dt);

          this.t += this.dt;
          this.accumulator -= this.dt;
        }
        const alpha = this.accumulator / this.dt;
        const state = this.interpolate(currentState, previousState, alpha);
        this.render(state);

        // console.log('reg', this.frame);
        this.frame++;
      }
    } else {
      this.render(currentState);
    }

    // time in seconds
    this.secondsRunning =
      (this.currentTime.valueOf() - this.startTime.valueOf()) / 1000;
    this.interval++;

    requestAnimationFrame(() => {
      if (this.playing) {
        this.loop();
      }
    });
  }

  integrate(currentState: any, t: number, dt: number) {
    currentState.position += currentState.velocity * dt;
    currentState.velocity += (this.force / this.mass) * dt;
    return currentState;
  }
  interpolate(currentState: any, previousState: any, alpha: number) {
    currentState.velocity =
      currentState.velocity * alpha + previousState.velocity * (1.0 - alpha);
    currentState.position =
      currentState.position * alpha + previousState.position * (1.0 - alpha);
    return currentState;
  }
  update() {
    this.run("update", null);
  }

  render(state: any) {
    this.run("render", state);
  }
}
export default Loop;
