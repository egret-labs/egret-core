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
	 * ```
	 * 	<tween:TweenItem target="{this.button}">
	 * 		<tween:props>
	 * 			<e:Object loop="{true}"/>
	 * 		</tween:props>
	 * 		<tween:paths>
	 * 			<e:Array>
	 * 				<tween:To duration="500">
	 * 					<tween:props>
	 * 						<e:Object x="{100}" y="{200}" />
	 * 					</tween:props>
	 * 				</tween:To>
	 * 				<tween:Wait duration="1000" />
	 * 				<tween:To duration="1000">
	 * 					<tween:props>
	 * 						<e:Object x="{200}" y="{100}" />
	 * 					</tween:props>
	 * 				</tween:To>
	 * 			</e:Array>
	 * 		</tween:paths>
	 * 	</tween:TweenItem>
	 * ```
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
			this.dispatchEventWith('pathComplete', false, path);

			var index = this._paths.indexOf(path);
			if (index >= 0 && index === this._paths.length - 1) {
				path.dispatchEventWith('complete');
			}
		}
	}

	export class TweenGroup extends EventDispatcher {
		private _items: TweenItem[];

		private completeCount: number = 0;

		constructor() {
			super();
		}

		public get items(): TweenItem[] {
			return this._items;
		}

		public set items(value: TweenItem[]) {
			this.completeCount = 0;
			this.registerEvent(false);
			this._items = value;
			this.registerEvent(true);
		}

		private registerEvent(add: boolean): void {
			this._items && this._items.forEach(item => {
				if (add) {
					item.addEventListener('complete', this.itemComplete, this);
				} else {
					item.removeEventListener('complete', this.itemComplete, this);
				}
			});
		}

		public play(): void {
			if (this._items) {
				for (var i = 0; i < this._items.length; i++) {
					var item = this._items[i];
					item.play();
				}
			}
		}

		public pause(): void {
			if (this._items) {
				for (var i = 0; i < this._items.length; i++) {
					var item = this._items[i];
					item.pause();
				}
			}
		}

		private itemComplete(e: Event): void {
			var item = e.currentTarget.data as TweenItem;
			this.completeCount++;
			this.dispatchEventWith('itemComplete', false, item);
			if (this.completeCount === this.items.length) {
				this.dispatchEventWith('complete');
				this.completeCount = 0;
			}
		}
	}
}