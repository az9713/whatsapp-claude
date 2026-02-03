import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Default settings
// Resolution: 1920x1080 (16:9) for landscape
// FPS: 30
// These can be overridden per-composition or via CLI
