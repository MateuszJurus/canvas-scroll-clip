import { Event, EventEmitter } from "./events";

describe('Event', () => {

  test("has been called", () => {
    const event = Event.resize;
    const callback = jest.fn();

    const emitter = new EventEmitter();

    emitter.on(event, callback);
    emitter.emit(event);

    expect(callback).toHaveBeenCalled();
  });

  test("verify console.warn event in console", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation();
    const callback = jest.fn();
    const testEvent = "Random event";
    const emitter = new EventEmitter();

    emitter.on(testEvent, callback);

    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toHaveBeenLastCalledWith(expect.stringContaining('BoomerangWarning'));
    expect(console.warn).toHaveBeenLastCalledWith(expect.stringContaining(testEvent));

    warn.mockReset();
  });

  test("verify repeated callback", () => {
    const event = Event.resize;
    const callback = jest.fn();

    const emitter = new EventEmitter();

    emitter.on(event, callback);
    emitter.on(event, callback);
    emitter.on(event, callback);
    emitter.emit(event);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("verify multiple events", () => {
    const event1 = Event.resize;
    const event2 = Event.scroll;
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const emitter = new EventEmitter();

    emitter.on(event1, callback1);
    emitter.on(event2, callback2);
    emitter.emit(event1);

    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
});