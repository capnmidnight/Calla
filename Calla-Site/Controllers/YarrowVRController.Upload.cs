using Juniper;
using Juniper.IO;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;

using Yarrow.Data;
using Yarrow.V2.Data;

namespace Calla.Controllers
{
    public partial class YarrowVRController : Controller
    {
        private static readonly DirectoryInfo activitiesRoot = new DirectoryInfo(".")
                .CD("wwwroot")
                .CD("data")
                .CD("activities");


        [HttpGet]
        public IActionResult Upload()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var activities = from dir in activitiesRoot.GetDirectories()
                             let file = dir.Touch("Activity.json")
                             where file.Exists && !db.Activities.Any(at => at.Name == dir.Name)
                             select file.Directory.Name;

            return View(activities.ToArray());
        }

        [HttpPost("YarrowVR/Upload/{activityName}")]
        public IActionResult Upload(string activityName)
        {
            var activityRoot = activitiesRoot.CD(activityName);
            var activityFile = activityRoot.Touch("Activity.json");
            if (!env.IsDevelopment()
                || string.IsNullOrWhiteSpace(activityName)
                || !activityFile.Exists)
            {
                return NotFound();
            }


            var activityFactory = new JsonFactory<Activity>();
            var activity = activityFactory.Deserialize(activityFile, null);

            var dbActivity = db.Activities.SingleOrDefault(at => at.Name == activity.Name)
                ?? new Activities
                {
                    Name = activity.Name
                };

            var dbZones = GetZones(activity);
            var dbTransforms = GetTransforms(activity);
            var dbFiles = GetFiles(activityRoot, activity);

            foreach (var file in dbFiles.Values)
            {
                if (file.Id == 0)
                {
                    db.Add(file);
                    db.SaveChanges();
                }
            }

            if (dbActivity.Id == 0)
            {
                db.Add(dbActivity);
            }

            db.AddRange(dbZones.Values.Where(z => z.Id == 0));
            db.AddRange(dbTransforms.Values.Where(t => t.Id == 0));

            db.SaveChanges();

            var dbTransformParents = GetTransformRelations(activity, dbTransforms);
            var dbTransformInZones = GetTransformZones(activity, dbZones, dbTransforms);
            var dbAudioTracks = GetAudioTracks(activity, dbTransforms, dbFiles);
            var dbSigns = GetSigns(activity, dbTransforms, dbFiles);

            db.AddRange(dbTransformParents);
            db.AddRange(dbTransformInZones);
            db.AddRange(dbAudioTracks.Values);
            db.AddRange(dbSigns);

            db.SaveChanges();

            var dbPlaybackControls = GetPlaybackControls(activity, dbTransforms, dbAudioTracks);
            var dbStations = GetStations(activity, dbTransforms, dbFiles);

            db.AddRange(dbStations.Values);
            db.AddRange(dbPlaybackControls);
            db.SaveChanges();

            var dbStationConnections = GetConnections(activity, dbStations);
            var dbActivityStartPoint = GetStartPoint(activity, dbActivity, dbStations);

            db.AddRange(dbStationConnections);
            db.Add(dbActivityStartPoint);

            db.SaveChanges();

            return Ok();
        }

        private Dictionary<string, Files> GetFiles(DirectoryInfo activityRoot, Activity activity)
        {
            return activity.AudioTracks
                .Select(at => at.FileName)
                .Union(activity.Images.Select(img => img.FileName))
                .Union(activity.Stations.Select(img => img.FileName))
                .Distinct()
                .Select(activityRoot.Touch)
                .ToDictionary(
                    f => f.Name,
                    f => db.Files.SingleOrDefault(f2 => f2.Name == f.Name)
                        ?? new Files
                        {
                            Name = f.Name,
                            Mime = MediaType.GuessByFile(f).Select(t => t.Value).FirstOrDefault(),
                            Size = (int)f.Length,
                            FileContents = new FileContents
                            {
                                Data = System.IO.File.ReadAllBytes(f.FullName)
                            }
                        });
        }

        private Dictionary<string, Zones> GetZones(Activity activity)
        {
            return activity.Zones.Select(z => z.Name)
                .Distinct()
                .ToDictionary(
                    zn => zn,
                    zn => db.Zones.SingleOrDefault(zn2 => zn2.Name == zn)
                        ?? new Zones
                        {
                            Name = zn
                        });
        }

        private Dictionary<string, Transforms> GetTransforms(Activity activity)
        {
            var dbTransforms = activity
                .Scene
                .Nodes
                .ToDictionary(
                    n => n.Path,
                    n => db.Transforms.SingleOrDefault(t => t.FullPath == n.Path)
                        ?? new Transforms
                        {
                            Name = n.Name,
                            FullPath = n.Path,
                            Matrix = n.Transform.ToArray()
                        });

            return dbTransforms;
        }

        private static ActivityStartPoints GetStartPoint(Activity activity, Activities dbActivity, Dictionary<string, Stations> dbStations)
        {
            return new ActivityStartPoints
            {
                ActivityId = dbActivity.Id,
                StationId = dbStations[activity.StartingStation].TransformId
            };
        }

        private static StationConnections[] GetConnections(Activity activity, Dictionary<string, Stations> dbStations)
        {
            return activity
                .Stations
                .SelectMany(st1 => st1
                    .Exits
                    .Select(st2 => new StationConnections
                    {
                        FromStationId = dbStations[st1.SceneGraphPath].TransformId,
                        ToStationId = dbStations[st2].TransformId
                    }))
                .ToArray();
        }

        private static string FileName(AbstractFile v)
        {
            return new FileInfo(v.FileName).Name;
        }

        private static Dictionary<string, Stations> GetStations(Activity activity, Dictionary<string, Transforms> dbTransforms, Dictionary<string, Files> dbFiles)
        {
            return activity
                .Stations
                .ToDictionary(
                    st => st.SceneGraphPath,
                    st => new Stations
                    {
                        TransformId = dbTransforms[st.SceneGraphPath].Id,
                        FileId = dbFiles[FileName(st)].Id,
                        Latitude = st.CorrectedLocation.Latitude,
                        Longitude = st.CorrectedLocation.Longitude,
                        Altitude = st.CorrectedLocation.Altitude,
                        Rotation = st.CorrectedRotation.ToArray()
                    });
        }

        private static PlaybackControls[] GetPlaybackControls(Activity activity, Dictionary<string, Transforms> dbTransforms, Dictionary<string, AudioTracks> dbAudioTracks)
        {
            return activity
                .PlaybackControls
                .Select(pb => new PlaybackControls
                {
                    AudioTrackId = dbAudioTracks[pb.TargetAudioTrack].Id,
                    TransformId = dbTransforms[pb.SceneGraphPath].Id
                })
                .ToArray();
        }

        private static Signs[] GetSigns(Activity activity, Dictionary<string, Transforms> dbTransforms, Dictionary<string, Files> dbFiles)
        {
            return activity
                .Images
                .Select(img => new Signs
                {
                    TransformId = dbTransforms[img.SceneGraphPath].Id,
                    FileId = dbFiles[FileName(img)].Id,
                    IsCallout = img.IsCallout
                })
                .ToArray();
        }

        private static Dictionary<string, AudioTracks> GetAudioTracks(Activity activity, Dictionary<string, Transforms> dbTransforms, Dictionary<string, Files> dbFiles)
        {
            return activity
                .AudioTracks
                .ToDictionary(
                    at => at.SceneGraphPath,
                    at => new AudioTracks
                    {
                        TransformId = dbTransforms[at.SceneGraphPath].Id,
                        FileId = dbFiles[FileName(at)].Id,
                        Volume = at.Volume,
                        MinDistance = at.MinDistance,
                        MaxDistance = at.MaxDistance,
                        AutoPlay = at.AutoPlay,
                        Loop = at.Loop,
                        Spatialize = at.Spatialize
                    });
        }

        private static TransformInZone[] GetTransformZones(Activity activity, Dictionary<string, Zones> dbZones, Dictionary<string, Transforms> dbTransforms)
        {
            return activity
                .Zones
                .Select(z => new TransformInZone
                {
                    TransformId = dbTransforms[z.SceneGraphPath].Id,
                    ZoneId = dbZones[z.Name].Id
                })
                .ToArray();
        }

        private static TransformParents[] GetTransformRelations(Activity activity, Dictionary<string, Transforms> dbTransforms)
        {
            return activity
                .Scene
                .Nodes
                .Where(n => n.Parent != null)
                .Select(n => new TransformParents
                {
                    ChildTransformId = dbTransforms[n.Path].Id,
                    ParentTransformId = dbTransforms[n.Parent.Path].Id
                })
                .ToArray();
        }
    }
}
