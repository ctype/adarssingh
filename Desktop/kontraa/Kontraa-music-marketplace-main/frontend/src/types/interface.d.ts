interface IFormBaseProperties {
  errors: {
    [key: string]: string;
  };
}

interface GraphqlErrorObj {
  message: string;
  code: number;
  details?: {
    field: string;
    messages: string[];
  }[]
}

interface IBaseSliceInitialState {
  error: GraphqlErrorObj | null;
  isPending: boolean;
}

interface IBaseFilterOptions {
  sortBy?: string | null;
  order?: number | null;
  limit?: number | null;
  offset?: number | null;
  search?: string | null;
}

interface IAudioFilterOptions extends IBaseFilterOptions {
  genre?: number[] | null;
  subGenre?: number[] | null;
  instrumentId?: number[] | null;
  audioKey?: number[] | null;
  moodType?: number[] | null;
  language?: number[] | null;
  endBpm?: number | null;
  startBpm?: number | null;
  tags?: string[] | null;
  status?: number;
  isDraft?: boolean;
}

interface ISoundEffectFilterOptions extends IBaseFilterOptions {
  genreMix?: number | null;
  status?: number;
  tags?: string[] | null;
}

interface ISoundBankFilterOptions extends IBaseFilterOptions {
  genreMix?: number | null;
  tags?: string[] | null;
  status?: number;
  isDraft?: boolean;
}

interface IPresetFilterOptions extends IBaseFilterOptions {
  genreMix?: number | null;
  presetType?: number | null;
  tags?: string[] | null;
  status?: number;
  isDraft?: boolean;
}
