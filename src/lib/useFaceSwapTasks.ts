import { useEffect, useRef, useState } from "react";
import type { WatermarkVideo } from "../types";
import { createFaceSwapDemo, getFaceDemoProcessingOutcome } from "../data/faceSwapDemo";
import { advanceFaceSwap, beginFaceSwap, cancelFaceSwap, faceSwapTask, isFaceSwapBusy, type FaceSwapSession } from "./videoFaceSwap";

export function useFaceSwapTasks(onCharge: (amount: number, description: string) => boolean, onRefund: (amount: number, description: string) => void) {
  const sessions = useRef<Record<string, FaceSwapSession>>({});
  const [snapshot, setSnapshot] = useState(sessions.current);
  const [now, setNow] = useState(Date.now());
  const callbacks = useRef({ onCharge, onRefund });
  callbacks.current = { onCharge, onRefund };

  const commit = (id: string, next: FaceSwapSession) => {
    const previous = sessions.current[id];
    if (previous === next) return;
    sessions.current = { ...sessions.current, [id]: next };
    setSnapshot(sessions.current);
    const refund = next.attempts.reduce((sum, attempt) => sum + attempt.refunded, 0) - (previous?.attempts.reduce((sum, attempt) => sum + attempt.refunded, 0) || 0);
    if (refund > 0) callbacks.current.onRefund(refund, `视频换脸：${next.source.name}，本次${next.phase === "cancelled" ? "排队取消" : "处理失败"}`);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      const timestamp = Date.now();
      let active = false;
      for (const [id, session] of Object.entries(sessions.current)) {
        if (!isFaceSwapBusy(session)) continue;
        active = true;
        commit(id, advanceFaceSwap(session, timestamp));
      }
      if (active) setNow(timestamp);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  return {
    tasks: Object.entries(snapshot).map(([id, session]) => faceSwapTask(id, session, now)),
    create: (source: WatermarkVideo) => {
      const id = `face-swap-${crypto.randomUUID()}`;
      commit(id, createFaceSwapDemo(source, Date.now()));
      return id;
    },
    update: (id: string, update: (session: FaceSwapSession) => FaceSwapSession) => {
      const session = sessions.current[id];
      if (session) commit(id, update(session));
    },
    submit: (id: string) => {
      const current = sessions.current[id];
      if (!current) return false;
      const next = beginFaceSwap(current, crypto.randomUUID(), Date.now(), getFaceDemoProcessingOutcome(current.source.id));
      if (next === current) return false;
      if (!callbacks.current.onCharge(40, `视频换脸：${current.source.name}，第${next.attempts.length}次处理`)) return false;
      commit(id, next);
      setNow(Date.now());
      return true;
    },
    cancel: (id: string) => {
      const session = sessions.current[id];
      if (session) commit(id, cancelFaceSwap(session, Date.now()));
    },
  };
}
