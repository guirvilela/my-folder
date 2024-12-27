export interface Photo {
  base64: string;
  exif?: {
    ImageLength: number;
    ImageWidth: number;
    LightSource: number;
    Orientation: number;
    [key: string]: any;
  };
  height: number;
  uri: string;
  width: number;
}
