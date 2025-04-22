import { describe, it, expect } from "vitest";
import { getFirstLevel } from "./command"; // Ajusta la ruta según tu proyecto

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

describe("getFirstLevel", () => {
  it("devuelve directorios y archivos de primer nivel en la raíz 'acdc'", () => {
    const result = getFirstLevel(mockData, "acdc");
    expect(result.directories.sort()).toEqual(["folder1", "folder2"]);
    expect(result.files.sort()).toEqual(["track1.mp3", "track2.mp3"]);
  });

  it("devuelve solo archivos si no hay subdirectorios", () => {
    const result = getFirstLevel(mockData, "acdc/folder2");
    expect(result.directories).toEqual([]);
    expect(result.files).toEqual(["song2.mp3"]);
  });

  it("devuelve vacío si la ruta no existe", () => {
    const result = getFirstLevel(mockData, "acdc/noexiste");
    expect(result.directories).toEqual([]);
    expect(result.files).toEqual([]);
  });
});
