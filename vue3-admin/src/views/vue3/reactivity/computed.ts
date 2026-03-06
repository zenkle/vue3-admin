import { track, trigger, setActiveEffect, getActiveEffect } from "./ref";
import  { EffectRunner } from "./ref";
export interface ComputedRef<T = any> {
  readonly value: T;
  readonly effect: EffectRunner;
}
class ComputedRefImpl<T> {
  public dep: Set<EffectRunner> = new Set();
  public effect: EffectRunner;
  private _value!: T;
  private _dirty: boolean = true;
  private _getter: () => T;
  constructor(getter: () => T) {
    this._getter = getter;
    const prevEffect = getActiveEffect();
    this.effect = new EffectRunner(() => {
      try {
        setActiveEffect(this.effect); 
        this._value = this._getter();
        this._dirty = false;
        return this._getter();
      } finally {
        setActiveEffect(prevEffect); 
      }
    });
    this.effect.scheduler = () => {
      this._dirty = true;
      trigger(this, "value");
    };
  }
  get value() {
    track(this, "value");
    if (this._dirty) {
      this.effect.run();
    }
    return this._value;
  }
}

export function computed<T>(getter: () => T): ComputedRef<T> {
  return new ComputedRefImpl(getter) as ComputedRef<T>;
}
