import type { ValueOf } from "./utils";

export const VideoType = {
  Video: "video",
  Gif: "gif",
} as const;
export type VideoType = ValueOf<typeof VideoType>;

export const VideoResolution = {
  Original: "original",
  1080: "1080",
  720: "720",
  480: "480",
} as const;
export type VideoResolution = ValueOf<typeof VideoResolution>;

export const VideoFrameRate = {
  Original: "original",
  144: "144",
  60: "60",
  30: "30",
  15: "15",
} as const;
export type VideoFrameRate = ValueOf<typeof VideoFrameRate>;

export const CONFIG_STORAGE_KEY = "config";
