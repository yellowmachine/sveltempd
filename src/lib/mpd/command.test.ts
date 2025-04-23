import { describe, it, expect } from "vitest";
import { getFirstLevel, toBeIncluded, joinSnapClientOpts as join, parseSnapclientOpts as parse } from "./command"; 

const mockData = [
  {
    directory: "acdc",
    file: [
      "acdc/track1.mp3",
      "acdc/track2.mp3",
      "acdc/folder1/song1.mp3",
      "acdc/folder2/song2.mp3"
    ]
  },
  {
    directory: "acdc/folder1",
    file: [
      "acdc/folder1/song1.mp3",
      "acdc/folder1/song3.mp3"
    ]
  },
  {
    directory: "acdc/folder2",
    file: [
      "acdc/folder2/song2.mp3"
    ]
  }
];

describe("toBeIncluded", () => {
    it("returns null for an empty string", () => {
      expect(toBeIncluded("")).toBeNull();
    });
  
    it("returns null for a single slash", () => {
      expect(toBeIncluded("/")).toBeNull();
    });
  
    it("returns null for subdirectory paths", () => {
      expect(toBeIncluded("folder/file.mp3")).toBeNull();
      expect(toBeIncluded("/folder/file.mp3")).toBeNull();
      expect(toBeIncluded("folder/subfolder/file.mp3")).toBeNull();
    });
  
    it("returns the name if it is a top-level file", () => {
      expect(toBeIncluded("song.mp3")).toBe("song.mp3");
      expect(toBeIncluded("/song.mp3")).toBe("song.mp3");
    });
  
    it("does not confuse visually similar characters to '/'", () => {
      // U+29F8 "⧸" (Big Solidus) is not a real slash
      expect(toBeIncluded("AC⧸DC - Back In Black.mp3")).toBe("AC⧸DC - Back In Black.mp3");
      expect(toBeIncluded("/AC⧸DC - Back In Black.mp3")).toBe("AC⧸DC - Back In Black.mp3");
    });
  
    it("returns null if the name is only subfolders", () => {
      expect(toBeIncluded("folder/")).toBeNull();
      expect(toBeIncluded("/folder/")).toBeNull();
    });
  });

describe("getFirstLevel", () => {
    it("returns first-level directories and files in the 'acdc' root", () => {
      const result = getFirstLevel(mockData, "acdc");
      expect(result.directories.sort()).toEqual(["folder1", "folder2"]);
      expect(result.files.sort()).toEqual(["track1.mp3", "track2.mp3"]);
    });
  
    it("returns only files if there are no subdirectories", () => {
      const result = getFirstLevel(mockData, "acdc/folder2");
      expect(result.directories).toEqual([]);
      expect(result.files).toEqual(["song2.mp3"]);
    });
  
    it("returns empty arrays if the path does not exist", () => {
      const result = getFirstLevel(mockData, "acdc/nonexistent");
      expect(result.directories).toEqual([]);
      expect(result.files).toEqual([]);
    });
  });

describe("parseSnapclientOpts", () => {
    it("parses simple options", () => {
      const line = 'SNAPCLIENT_OPTS="--host localhost --port 1704 --debug"';
      expect(parse(line)).toEqual({
        host: "localhost",
        port: "1704",
        debug: true
      });
    });
  
    it("parses options with single quotes", () => {
      const line = "SNAPCLIENT_OPTS='--host localhost --name \"Living Room\" --debug'";
      expect(parse(line)).toEqual({
        host: "localhost",
        name: "Living Room",
        debug: true
      });
    });
  
    it.skip("parses flags without values", () => {
      const line = 'SNAPCLIENT_OPTS="--debug --verbose"';
      expect(parse(line)).toEqual({
        debug: true,
        verbose: true
      });
    });
  
    it("parses options with dashes", () => {
      const line = 'SNAPCLIENT_OPTS="--some-option value"';
      expect(parse(line)).toEqual({
        some_option: "value"
      });
    });
  
    it("parses options with spaces in value", () => {
      const line = 'SNAPCLIENT_OPTS="--name \'My Device\' --host localhost"';
      expect(parse(line)).toEqual({
        name: "My Device",
        host: "localhost"
      });
    });
  
    it("parses empty options", () => {
      const line = 'SNAPCLIENT_OPTS=""';
      expect(parse(line)).toEqual({});
    });
  });
  
describe("join", () => {
    it("joins simple options", () => {
      const obj = { host: "localhost", port: "1704", debug: true };
      expect(join(obj)).toBe('--host localhost --port 1704 --debug');
    });
  
    it("joins options with spaces in value", () => {
      const obj = { name: "Living Room", debug: true };
      expect(join(obj)).toBe('--name "Living Room" --debug');
    });
  
    it("joins options with underscores and ignores false flags", () => {
      const obj = { some_option: "value", debug: false, verbose: true };
      expect(join(obj)).toBe('--some-option value --verbose');
    });
  
    it("returns empty string for empty object", () => {
      expect(join({})).toBe('');
    });
  
    it("escapes values with spaces and keeps single-word values unquoted", () => {
      const obj = { name: "Device 1", host: "localhost" };
      expect(join(obj)).toBe('--name "Device 1" --host localhost');
    });
  });