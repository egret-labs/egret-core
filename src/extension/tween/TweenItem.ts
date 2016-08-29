module egret.tween {

	export type EaseType =
		'quadIn' | 'quadOut' | 'quadOut' | 'quadInOut' |
		'cubicIn' | 'cubicOut' | 'cubicInOut' |
		'quartIn' | 'quartOut' | 'quartInOut' |
		'quintIn' | 'quintOut' | 'quintInOut' |
		'sineIn' | 'sineOut' | 'sineInOut' |
		'backIn' | 'backOut' | 'backInOut' |
		'circIn' | 'circOut' | 'circInOut' |
		'bounceIn' | 'bounceOut' | 'bounceInOut' |
		'elasticIn' | 'elasticOut' | 'elasticInOut';

	export interface TweenProps {
		useTicks?: boolean;
		ignoreGlobalPause?: boolean;
		loop?: boolean;
		override?: boolean;
		paused?: boolean;
		position?: number;
		onChange?: () => void;
		onChangeObj?: any;
	}

	export class BasePath extends EventDispatcher {
		public name: string = "";
	}

	export class To extends BasePath {
		public props: Object = undefined;
		public duration: number = 500;
		public ease: EaseType | Function = undefined;
	}

	export class Wait extends BasePath {
		public duration: number = 500;
		public passive: boolean = undefined;
	}
	
	export class Set extends BasePath {
		public props: Object = undefined;
	}

	export class Tick extends BasePath {
		public delta: number = 500;
	}

	function convertEase(ease: EaseType | Function): Function {
		if (typeof ease === 'function') {
			return ease;
		} else {
			var func: Function = Ease[ease];
			if (typeof func === 'function') {
				return func;
			}
		}
		return null;
	}

	/**
	 * <code>
	 * 	<tween:TweenItem target="{this.button}">
	 * 		<tween:paths>
	 * 			<tween:To props="{{x: 500}}" duration="500" ease="sineIn"/>
	 * 			<tween:Wait duration="500"/>
	 * 		<tween:paths>
	 * 	</tween:TweenItem>
	 * </code>
	 */
	export class TweenItem extends EventDispatcher {

		private _props: TweenProps;
		private _target: any;
		private _paths: BasePath[];

		private tween: Tween;

		constructor() {
			super();
		}

		public get props(): TweenProps {
			return this._props;
		}

		public set props(value: TweenProps) {
			this._props = value;
		}

		public get target(): any {
			return this._target;
		}

		public set target(value: any) {
			this._target = value;
		}

		public get paths(): BasePath[] {
			return this._paths;
		}

		public set paths(value: BasePath[]) {
			this._paths = value || [];
		}

		public play(): void {
			if (!this.tween) {
				this.createTween();
			} else {
				this.tween.setPaused(false);
			}
		}

		public pause(): void {
			if (this.tween) {
				this.tween.setPaused(true);
			}
		}

		private createTween(): void {
			this.tween = Tween.get(this._target, this._props);

			if (this._paths) {
				this.applyPaths();
			}
		}

		private applyPaths(): void {
			for (var i = 0; i < this._paths.length; i++) {
				var path = this._paths[i];
				this.applyPath(path);
			}
		}

		private applyPath(path: BasePath): void {
			if (path instanceof To) {
				this.tween.to(path.props, path.duration, convertEase(path.ease));
			} else if (path instanceof Wait) {
				this.tween.wait(path.duration, path.passive);
			} else if (path instanceof Set) {
				this.tween.set(path.props);
			} else if (path instanceof Tick) {
				this.tween.tick(path.delta);
			}

			this.tween.call(() => this.pathComplete(path));
		}

		private pathComplete(path: BasePath): void {
			path.dispatchEventWith('complete');
			this.dispatchEventWith('itemComplete', false, path);

			var index = this._paths.indexOf(path);
			if (index >= 0 && index === this._paths.length - 1) {
				path.dispatchEventWith('complete');
			}
		}
	}
}