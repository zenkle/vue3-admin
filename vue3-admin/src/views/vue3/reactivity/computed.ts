import { track, trigger, setActiveEffect, getActiveEffect } from "./ref";
import type { RefEffect } from "./ref";
export interface ComputedRef<T = any> {
  readonly value: T;
  readonly effect: RefEffect;
}
class ComputedRefImpl<T> {
  public dep: Set<RefEffect> = new Set();
  public effect: RefEffect;
  private _value!: T;
  private _dirty: boolean = true;
  private _getter: () => T;
  constructor(getter: () => T) {
    this._getter = getter;
    const prevEffect = getActiveEffect();
    this.effect = () => {
      try {
        setActiveEffect(this.effect); 
        this._value = this._getter();
        this._dirty = false;
        return this._getter();
      } finally {
        setActiveEffect(prevEffect); 
      }
    };
    this.effect.scheduler = () => {
      this._dirty = true;
      trigger(this, "value");
    };
  }
  get value() {
    track(this, "value");
    if (this._dirty) {
      this.effect();
    }
    return this._value;
  }
}

export function computed<T>(getter: () => T): ComputedRef<T> {
  return new ComputedRefImpl(getter) as ComputedRef<T>;
}
