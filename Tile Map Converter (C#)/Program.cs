using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml;
using Newtonsoft.Json;
using static System.Console;

namespace Tile_Map_Converter
{
    struct TileSet
    {
        public readonly int tileWidth;
        public readonly int tileHeight;
        public readonly string file;

        public TileSet(int width, int height, string tilesetName)
        {
            tileWidth = width;
            tileHeight = height;
            file = tilesetName;
        }
    }

    struct Point
    {
        public readonly int x;
        public readonly int y;

        public Point(int x, int y)
        {
            this.x = x;
            this.y = y;
        }
    }

    struct TileMap
    {
        public readonly string tileset;
        public readonly Point offset;
        public readonly int[][][] tiles;
        public readonly int[][] collision;

        public TileMap(string tilesetName, int numLayers, int mapWidth, int mapHeight) : this()
        {
            tileset = tilesetName;
            offset = new Point(-mapWidth / 2, -mapHeight / 2);
            tiles = new int[numLayers][][];
            collision = new int[mapHeight][];

            for (var i = 0; i < numLayers; ++i)
            {
                tiles[i] = new int[mapHeight][];
                for (var y = 0; y < mapHeight; ++y)
                {
                    tiles[i][y] = new int[mapWidth];
                }
            }

            for (var y = 0; y < mapHeight; ++y)
            {
                collision[y] = new int[mapWidth];
            }
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                WriteLine("Usage:");
                WriteLine("  xtiled <tiled.tmx> <lozya-data-dir>");
                return;
            }

            var tiledFilePath = args[0];
            var lozyaDataDirPath = args[1];

            var tiledFile = new FileInfo(tiledFilePath);
            var lozyaDataDir = new DirectoryInfo(lozyaDataDirPath);

            if (ValidateFile(tiledFile)
                && ValidateDirectory(lozyaDataDir))
            {
                var map = ReadXml(tiledFile);
                if (TryReadTileSet(tiledFile, map, out var set)
                    && TryGetTilesetPathRel(map, out var tilesetPathRel))
                {
                    var mapName = Path.GetFileNameWithoutExtension(tiledFile.Name);
                    var tilesetName = Path.GetFileNameWithoutExtension(tilesetPathRel);
                    ConvertFile(mapName, map, tilesetName, set, lozyaDataDir);
                }
            }

            WriteLine("Exiting");
        }

        static bool ValidateFile(FileInfo tiledFile)
        {
            if (!tiledFile.Exists)
            {
                Error.WriteLine("ERROR: Input file does not exist: " + tiledFile.FullName);
                return false;
            }

            return true;
        }

        private static bool ValidateDirectory(DirectoryInfo lozyaDataDir)
        {
            if (!lozyaDataDir.Exists)
            {
                if (!GetConfirmation($"WARNING: Output directory {lozyaDataDir.FullName} does not exist. Create it now?"))
                {
                    return false;
                }

                lozyaDataDir.Create();
            }

            return true;
        }

        private static bool GetConfirmation(string prompt)
        {
            Write(prompt);
            bool? confirm = null;
            while (confirm is null)
            {
                Write(" (y|n):");
                var key = ReadKey();
                if (key.Key == ConsoleKey.Y)
                {
                    confirm = true;
                }
                else if (key.Key == ConsoleKey.N)
                {
                    confirm = false;
                }
            }
            WriteLine();
            return confirm.Value;
        }

        private static XmlDocument ReadXml(FileInfo tiledFile)
        {
            var map = new XmlDocument();
            using var mapStream = tiledFile.OpenRead();
            map.Load(mapStream);
            return map;
        }

        private static bool TryGetElement(XmlNode xml, string path, out XmlNode element, string errorMessage)
        {
            element = xml.SelectSingleNode(path);
            if (element is null)
            {
                Error.WriteLine(errorMessage);
                return false;
            }

            return true;
        }

        private static bool TryGetAttribute(XmlNode xml, string name, out string attrValue, string errorMessage)
        {
            var attr = xml.Attributes[name];
            attrValue = attr?.Value;
            if (string.IsNullOrEmpty(attrValue))
            {
                Error.WriteLine(errorMessage);
                return false;
            }

            return true;
        }

        private static bool TryParseInt(string text, out int value, string errorMessage)
        {
            if (!int.TryParse(text, out value))
            {
                Error.Write(errorMessage);
                return false;
            }
            return true;
        }

        private static bool TryParseBool(string text, out bool value, string errorMessage)
        {
            if (!bool.TryParse(text, out value))
            {
                Error.Write(errorMessage);
                return false;
            }
            return true;
        }

        private static bool TryGetTilesetPathRel(XmlDocument mapXml, out string tilesetPathRel)
        {
            tilesetPathRel = null;
            return TryGetElement(mapXml, "map/tileset", out var tilesetElement, "Tilemap does not specify a tileset element. Please add on in Tiled.")
                && TryGetAttribute(tilesetElement, "source", out tilesetPathRel, "Tilemap tileset element does not specify a source attribute. Please add on in Tiled.");
        }

        private static bool TryReadTileSet(FileInfo tiledFile, XmlDocument mapXml, out XmlDocument tilesetXml)
        {
            if (!TryGetTilesetPathRel(mapXml, out var tilesetPathRel))
            {
                tilesetXml = null;
                return false;
            }

            var tilesetPath = Path.Combine(tiledFile.Directory.FullName, tilesetPathRel);
            var tilesetFile = new FileInfo(tilesetPath);

            if (!tilesetFile.Exists)
            {
                Error.WriteLine("Tileset file referenced in map does not exist: " + tilesetFile.FullName);
                tilesetXml = null;
                return false;
            }

            tilesetXml = ReadXml(tilesetFile);

            if (TryGetElement(tilesetXml, "tileset/properties/property[@name='Collision']", out var collisionPropElement, "Tileset file does not have a Collision property. Please add one in Tiled.")
                && TryGetAttribute(collisionPropElement, "type", out var collisionPropType, "Tileset's Collision property does not have a data type specified.")
                && collisionPropType != "bool")
            {
                Error.WriteLine($"Expected tileset's Collion property type to be \"bool\", but got {collisionPropType} instead.");
                return false;
            }

            return true;
        }

        private static void ConvertFile(string mapName, XmlDocument mapXml, string tilesetName, XmlDocument tilesetXml, DirectoryInfo lozyaDataDir)
        {
            var mapFilePathRel = Path.Combine("tilemaps", mapName + ".json");
            var mapFilePath = Path.Combine(lozyaDataDir.FullName, mapFilePathRel);
            var mapFile = new FileInfo(mapFilePath);

            var tilesetFilePathRel = Path.Combine("tilesets", tilesetName, "index.json");
            var tilesetFilePath = Path.Combine(lozyaDataDir.FullName, tilesetFilePathRel);
            var tilesetFile = new FileInfo(tilesetFilePath);

            _ = TryGetElement(tilesetXml, "tileset", out var tilesetElement, "");
            if (!TryGetAttribute(tilesetElement, "tilewidth", out var tileWidthString, "Tileset's tileset element does not have a tilewidth property.")
                || !TryGetAttribute(tilesetElement, "tileheight", out var tileHeightString, "Tileset's tileset element does not have a tileheight property.")
                || !TryParseInt(tileWidthString, out var tileWidth, $"Tileset's tilewidth attribute is not a valid integer: `{tileWidthString}`.")
                || !TryParseInt(tileHeightString, out var tileHeight, $"Tileset's tileheight attribute is not a valid integer: `{tileHeightString}`.")
                || !TryGetElement(tilesetElement, "image", out var imagePathRelElement, "Tileset element does not have an image element.")
                || !TryGetAttribute(imagePathRelElement, "source", out var imagePathRel, "Tileset's image element does not have a source attribute"))
            {
                return;
            }

            var tileElements = tilesetElement.SelectNodes("tile");
            if (tileElements.Count == 0)
            {
                Error.WriteLine("There are no tile metadata definitions in the tileset. No valid collision data will be generated for the map.");
            }

            var collisions = new Dictionary<int, bool>();
            foreach (XmlNode tileElement in tileElements)
            {
                if (!TryGetAttribute(tileElement, "id", out var idString, "Could not find an ID attribute on one of the tile elements")
                    || !TryParseInt(idString, out var id, $"Tile's id attribute is not a valid integer: `{idString}`")
                    || !TryGetElement(tileElement, "properties/property[@name='Collision']", out var collisionElement, "Could not find a Collision property on the tile")
                    || !TryGetAttribute(collisionElement, "value", out var valueString, "Collision property did not have a value")
                    || !TryParseBool(valueString, out var value, $"Value is not valid bool: `{valueString}`"))
                {
                    return;
                }
                else if (collisions.ContainsKey(id))
                {
                    Error.WriteLine($"Collision key {id} already exists");
                    return;
                }

                collisions[id] = value;
            }

            var tileset = new TileSet(tileWidth, tileHeight, imagePathRel);
            var tilesetJson = JsonConvert.SerializeObject(tileset, Newtonsoft.Json.Formatting.Indented);

            if (!TryGetElement(mapXml, "map", out var mapElement, "Map file does not have a root map element.")
                || !TryGetAttribute(mapElement, "width", out var widthString, "Map element does not have a width attribute.")
                || !TryGetAttribute(mapElement, "height", out var heightString, "Map element does not have a width attribute.")
                || !TryParseInt(widthString, out var mapWidth, $"Width value is not a valid integer: `{widthString}`")
                || !TryParseInt(heightString, out var mapHeight, $"Height value is not a valid integer: `{heightString}`"))
            {
                return;
            }

            var layerDataElements = mapElement.SelectNodes("layer/data[@encoding='csv']");
            if (layerDataElements.Count == 0)
            {
                Error.WriteLine("Map does not contain any layers");
                return;
            }

            var map = new TileMap(tilesetName, layerDataElements.Count, mapWidth, mapHeight);
            for(var i = 0; i < layerDataElements.Count; ++i)
            {
                var layerDataElement = layerDataElements[i];
                var layoutText = layerDataElement.InnerText
                    .Trim()
                    .Replace("\r", "")
                    .Replace("\n", "")
                    .Replace("\t", "")
                    .Replace(" ", "");
                var entries = layoutText.Split(',')
                    .Select(int.Parse)
                    .ToArray();
                for(var j = 0; j < entries.Length; ++j)
                {
                    var e = entries[j];
                    var x = j % mapWidth;
                    var y = j / mapWidth;
                    map.tiles[i][y][x] = e;

                    if(i == 0)
                    {
                        var c = collisions.GetValueOrDefault(e - 1, false);
                        map.collision[y][x] = c ? 1 : 0;
                    }
                }
            }

            var rowPrefixRegex = new Regex(@"\[\s+(\d+)", RegexOptions.Compiled | RegexOptions.Singleline);
            var rowPostfixRegex = new Regex(@"(\d+)\s+\]", RegexOptions.Compiled | RegexOptions.Singleline);
            var rowElementRegex = new Regex(@"(\d+),\s+(\d+)", RegexOptions.Compiled | RegexOptions.Singleline);
            var mapJson = JsonConvert.SerializeObject(map, Newtonsoft.Json.Formatting.Indented);
            mapJson = RunRegex(mapJson, rowElementRegex, (match) => $"{match.Groups[1].Value},{match.Groups[2].Value}");
            mapJson = RunRegex(mapJson, rowPrefixRegex, (match) => $"[{match.Groups[1].Value}");
            mapJson = RunRegex(mapJson, rowPostfixRegex, (match) => $"{match.Groups[1].Value}]");
            if (GetConfirmation("Okay, everything passes validation. Do you want to write the files now?"))
            {
                tilesetFile.Directory.Create();
                File.WriteAllText(tilesetFile.FullName, tilesetJson);

                mapFile.Directory.Create();
                File.WriteAllText(mapFile.FullName, mapJson);
            }
        }

        private static string RunRegex(string input, Regex regex, MatchEvaluator eval)
        {
            var len = input.Length + 1;
            while(input.Length < len)
            {
                len = input.Length;
                input = regex.Replace(input, eval);
            }

            return input;
        }
    }
}
