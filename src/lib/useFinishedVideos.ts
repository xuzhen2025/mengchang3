import { useMemo } from "react";
import { Asset } from "../types";
import { FinishedVideo, INITIAL_FINISHED } from "../data/finishedVideos";
import { DEFAULT_ASSOCIATED_SCRIPTS, DEFAULT_RELATED_VIDEOS } from "../data/videoResourceOptions";
import { toPublishedVideo } from "./publishedVideo";
import { useResourceEdits } from "./useResourceEdits";

type FinishedVideoEdit = FinishedVideo & { deleted?: boolean };

export function useFinishedVideos(uploadedVideos: Asset[]) {
  const { edits, saveEdits } = useResourceEdits<FinishedVideoEdit>("finished");
  const videos = useMemo(() => {
    const uniqueVideos = new Map<string, FinishedVideo>();
    for (const video of [...uploadedVideos.map(toPublishedVideo), ...INITIAL_FINISHED]) {
      if (!uniqueVideos.has(video.id)) uniqueVideos.set(video.id, video);
    }
    return [...uniqueVideos.values()]
      .filter((video) => !edits[video.id]?.deleted)
      .map((video) => ({
        ...video,
        associatedScripts: DEFAULT_ASSOCIATED_SCRIPTS,
        relatedVideos: DEFAULT_RELATED_VIDEOS,
        ...edits[video.id],
      }));
  }, [uploadedVideos, edits]);
  return { videos, saveEdits };
}
