
declare namespace wallpaper {
	interface GetOptions {
		readonly screen?: 'all' | 'main' | number;
	}

	interface SetOptions {
		readonly screen?: 'all' | 'main' | number;
		readonly scale?: 'auto' | 'fill' | 'fit' | 'stretch' | 'center';
	}
}

declare const wallpaper: {
	get(options?: wallpaper.GetOptions): Promise<string>;
	set(imagePath: string, options?: wallpaper.SetOptions): Promise<void>;
	screens?(): Promise<string[]>;
	default: typeof wallpaper;
};