import { IScreenViewport } from "@/helpers/intefaces";
import { EventEmitter } from "@/common/events";
import { BoomerangError } from "@/helpers/error";
import * as utils from "@/helpers/utils";

export class Base {

  /**
   * EventEmitter 
   */
  public events: EventEmitter;

  /**
   * Viewport
   */
  public screen: IScreenViewport;

  /**
   * Creates an instance.
   * 
   * @constructor
   * @memberof Base
   * @throws
   */
  constructor() {

    // Test window is defined
    if (!window) {
      throw new BoomerangError("window is not found.");
    }

    // Test document is defined
    if (!document) {
      throw new BoomerangError("document is not found.");
    }

    // Event bus
    this.events = new EventEmitter();

    // Set viewport
    this.screen = this.getScreenViewport();

    // Bind events
    this.bind()
  }

  /**
   * Bind events
   */
  private bind(): void {
    // Bind window events
    window.addEventListener("resize", utils.debounce(this.handleResize.bind(this)));
    window.addEventListener("scroll", utils.debounce(this.handleScroll.bind(this)));

    // on viewport resize event
    this.events.on(utils.BoomerangEvent.viewport.resize, (viewport: IScreenViewport) => {
      // Update vieport
      this.screen = viewport;
    });
  }

  /**
   * Get window viewport size
   * 
   * @returns {IScreenViewport}
   */
  public getScreenViewport(): IScreenViewport {
    return {
      x: window.innerWidth || document.documentElement?.clientWidth,
      y: window.innerHeight || document.documentElement?.clientHeight
    };
  }

  /**
   * Set Viewport sizes on window resize event
   */
  public handleResize(): void {
    this.events.emit(utils.BoomerangEvent.viewport.resize, this.getScreenViewport());
  }

  /**
   * Set scrolltop on window scroll event
   */
  public handleScroll(): void {
    // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.events.emit(utils.BoomerangEvent.viewport.scroll, scrollTop)
  }
}

export default Base;