import { type DefaultOptions } from "@tanstack/react-query";
export const queryConfig = {
  queries: {
    // false に設定した場合、ウィンドウにフォーカスが当たってもクエリの再取得は行われません。
    refetchOnWindowFocus: false,
    // falseなら失敗したクエリはデフォルトでは再試行されません。
    retry: false,
    // データが「古い（stale）」とみなされるまでの時間をミリ秒単位で指定します。
    staleTime: 60 * 1000,
  },
} satisfies DefaultOptions;
