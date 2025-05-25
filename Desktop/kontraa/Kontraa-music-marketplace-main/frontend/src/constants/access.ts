const entities = [
  "AUDIOS",
  "PRESETS",
  "SOUND_BANKS",
  "SOUND_EFFECTS",
  "VIDEOS",
  "PHOTOS",
];

const accesses = [
  "READ",
  "WRITE",
  "DOWNLOAD",
];

const permissions = entities.map(e => {
  return accesses.map(a => ({
    accessName: `${e}_${a}`,
    entity: e,
    access: a,
  }));
});

export const RESOURCE_ACCESS = permissions.flat(1);
